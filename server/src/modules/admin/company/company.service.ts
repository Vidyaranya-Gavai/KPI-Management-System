import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../../../entities/company.entity';
import { CompanyEmailDomain } from '../../../entities/company-email-domain.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { AdminUser } from '../../../entities/admin-user.entity';
import { BootstrapCompanyDto } from './dtos/bootstrap-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(CompanyEmailDomain)
    private readonly domainRepo: Repository<CompanyEmailDomain>,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    adminId?: number
  ) {
    const {
      name,
      code,
      parent_company_id,
      email_domains,
      is_active,
    } = createCompanyDto;

    // Normalize domains
    const normalizedDomains = email_domains.map(d => ({
      domain: d.domain.trim().toLowerCase(),
      is_active: d.is_active ?? true,
    }));

    // Check duplicate domains in request itself
    const uniqueDomains = new Set(normalizedDomains.map(d => d.domain));
    if (uniqueDomains.size !== normalizedDomains.length) {
      throw new BadRequestException('Duplicate email domains in request');
    }

    // Validate parent company (if provided)
    let parentCompany: Company | null = null;
    if (parent_company_id) {
      parentCompany = await this.companyRepo.findOne({
        where: { id: parent_company_id },
      });

      if (!parentCompany) {
        throw new NotFoundException('Parent company not found');
      }
    }

    // Check domain uniqueness in DB
    const existingDomains = await this.domainRepo.find({
      where: normalizedDomains.map(d => ({ domain: d.domain })),
    });

    if (existingDomains.length > 0) {
      throw new ConflictException(
        `Domain already exists: ${existingDomains
          .map(d => d.domain)
          .join(', ')}`,
      );
    }

    // Transaction starts
    return await this.dataSource.transaction(async manager => {
      // Admin reference (optional)
      let admin: AdminUser | null = null;
      if (adminId) {
        admin = await manager.findOne(AdminUser, {
          where: { id: adminId },
        });
      }

      // Create company
      const company = manager.create(Company, {
        name,
        code,
        is_active: is_active ?? true,
        parent: parentCompany,
        created_by: admin,
      });

      const savedCompany = await manager.save(company);

      // Create email domains
      const domainEntities = normalizedDomains.map(d =>
        manager.create(CompanyEmailDomain, {
          domain: d.domain,
          is_active: d.is_active,
          company: savedCompany,
          created_by: admin,
        }),
      );

      await manager.save(domainEntities);

      // Return minimal response
      return {
        id: savedCompany.id,
        name: savedCompany.name,
        code: savedCompany.code,
        domains: domainEntities.map(d => d.domain),
      };
    });
  }

  async createBootstrapCompanies(
    bootstrapCompanyDto: BootstrapCompanyDto,
    adminId: number,
  ) {
    const totalDomains =
      bootstrapCompanyDto.parent.email_domains.length +
      bootstrapCompanyDto.children.reduce(
        (sum, child) => sum + child.email_domains.length,
        0,
      );

    if (totalDomains > 25) {
      throw new BadRequestException(
        'Maximum 25 email domains allowed in one bootstrap request',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      /* Create parent company */
      const parentCompany = manager.create(Company, {
        name: bootstrapCompanyDto.parent.name,
        code: bootstrapCompanyDto.parent.code,
        is_active: bootstrapCompanyDto.parent.is_active,
        created_by: { id: adminId },
      });

      const savedParent = await manager.save(parentCompany);

      /* Create parent email domains */
      const parentDomains = bootstrapCompanyDto.parent.email_domains.map((d) =>
        manager.create(CompanyEmailDomain, {
          domain: d.domain,
          is_active: d.is_active,
          company: savedParent,
          created_by: { id: adminId },
        }),
      );

      if (parentDomains.length > 0) {
        await manager.save(parentDomains);
      }

      /* Create child companies + their domains */
      for (const child of bootstrapCompanyDto.children) {
        const childCompany = manager.create(Company, {
          name: child.name,
          code: child.code,
          is_active: child.is_active,
          parent: savedParent,
          created_by: { id: adminId },
        });

        const savedChild = await manager.save(childCompany);

        const childDomains = child.email_domains.map((d) =>
          manager.create(CompanyEmailDomain, {
            domain: d.domain,
            is_active: d.is_active,
            company: savedChild,
            created_by: { id: adminId },
          }),
        );

        if (childDomains.length > 0) {
          await manager.save(childDomains);
        }
      }

      return {
        message: 'Companies bootstrapped successfully',
        parent_company_id: savedParent.id,
        child_count: bootstrapCompanyDto.children.length,
        total_domains_created: totalDomains,
      };
    });
  }
}
