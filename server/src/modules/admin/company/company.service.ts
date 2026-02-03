import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../../../entities/company.entity';
import { CompanyEmailDomain } from '../../../entities/company-email-domain.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { AdminUser } from '../../../entities/admin-user.entity';

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
}
