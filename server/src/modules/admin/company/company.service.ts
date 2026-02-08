import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Company } from '../../../entities/company.entity';
import { CompanyEmailDomain } from '../../../entities/company-email-domain.entity';
import { CreateCompanyDto } from './dtos/create/create-company.dto';
import { AdminUser } from '../../../entities/admin-user.entity';
import { BootstrapCompanyDto } from './dtos/create/bootstrap-company.dto';
import { UpdateCompanyDto } from './dtos/update/update-company.dto';

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

  async updateCompany(
    companyId: number,
    adminId: number,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const companyRepository = manager.getRepository(Company);
      const domainRepository = manager.getRepository(CompanyEmailDomain);

      /* ---------------------------------------------------
      * 1. Fetch company scoped to admin
      * --------------------------------------------------- */
      const company = await companyRepository.findOne({
        where: {
          id: companyId,
          created_by: { id: adminId },
        },
        relations: ['email_domains'],
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      /* ---------------------------------------------------
      * 2. Update company fields (PATCH semantics)
      * --------------------------------------------------- */
      if (updateCompanyDto.name !== undefined) {
        company.name = updateCompanyDto.name;
      }

      if (updateCompanyDto.code !== undefined) {
        company.code = updateCompanyDto.code;
      }

      if (updateCompanyDto.is_active !== undefined) {
        company.is_active = updateCompanyDto.is_active;
      }

      await companyRepository.save(company);

      /* ---------------------------------------------------
      * 3. Update existing domains
      * --------------------------------------------------- */
      if (updateCompanyDto.update_domains?.length) {
        for (const updateDomain of updateCompanyDto.update_domains) {
          const domain = company.email_domains.find(
            (d) => d.id === updateDomain.id,
          );

          if (!domain) {
            throw new BadRequestException(
              `Domain with id ${updateDomain.id} does not belong to this company`,
            );
          }

          if (updateDomain.domain !== undefined) {
            domain.domain = updateDomain.domain;
          }

          if (updateDomain.is_active !== undefined) {
            domain.is_active = updateDomain.is_active;
          }

          try {
            await domainRepository.save(domain);
          } catch (err) {
            // Handles unique constraint on domain
            throw new ConflictException('Domain already exists');
          }
        }
      }

      /* ---------------------------------------------------
      * 4. Add new domains (create semantics)
      * --------------------------------------------------- */
      if (updateCompanyDto.new_domains?.length) {
        const existingCount = company.email_domains.length;
        const newCount = updateCompanyDto.new_domains.length;

        if (existingCount + newCount > 10) {
          throw new BadRequestException(
            'A company can have a maximum of 10 email domains',
          );
        }

        for (const newDomain of updateCompanyDto.new_domains) {
          const domainEntity = domainRepository.create({
            domain: newDomain.domain,
            is_active: newDomain.is_active ?? true,
            company,
            created_by: { id: adminId } as AdminUser,
          });

          try {
            await domainRepository.save(domainEntity);
          } catch (err) {
            throw new ConflictException('Domain already exists');
          }
        }
      }

      /* ---------------------------------------------------
      * 5. Return updated company snapshot
      * --------------------------------------------------- */
      return companyRepository.findOne({
        where: { id: company.id },
        relations: ['email_domains', 'parent'],
      });
    });
  }

  async deleteCompany(
    companyId: number,
    adminId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const companyRepository = manager.getRepository(Company);
      const domainRepository = manager.getRepository(CompanyEmailDomain);

      /* ---------------------------------------------------
      * 1. Fetch company scoped to admin
      * --------------------------------------------------- */
      const company = await companyRepository.findOne({
        where: {
          id: companyId,
          created_by: { id: adminId },
        },
        relations: ['email_domains'],
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const domainIds = company.email_domains.map(d => d.id);

      /* ---------------------------------------------------
      * 2. Detach child companies (set parent to null)
      * --------------------------------------------------- */
      await companyRepository.update(
        { parent: { id: companyId } },
        { parent: null },
      );

      /* ---------------------------------------------------
      * 3. Delete company (DB cascade should handle domains)
      * --------------------------------------------------- */
      await companyRepository.remove(company);

      /* ---------------------------------------------------
      * 4. Defensive check – ensure no domains remain
      * --------------------------------------------------- */
      if (domainIds.length) {
        const remainingDomains = await domainRepository.find({
          where: {
            id: In(domainIds),
          },
        });

        if (remainingDomains.length) {
          await domainRepository.remove(remainingDomains);
        }
      }

      /* ---------------------------------------------------
      * 5. Return response
      * --------------------------------------------------- */
      return {
        message: 'Company deleted successfully',
        company_id: companyId,
      };
    });
  }

  async deleteCompanyDomain(
    companyId: number,
    domainId: number,
    adminId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const companyRepository = manager.getRepository(Company);
      const domainRepository = manager.getRepository(CompanyEmailDomain);

      /* ---------------------------------------------------
      * 1. Fetch company scoped to admin
      * --------------------------------------------------- */
      const company = await companyRepository.findOne({
        where: {
          id: companyId,
          created_by: { id: adminId },
        },
        relations: ['email_domains'],
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      /* ---------------------------------------------------
      * 2. Validate domain belongs to company
      * --------------------------------------------------- */
      const domain = company.email_domains.find(
        (d) => d.id === domainId,
      );

      if (!domain) {
        throw new NotFoundException(
          'Domain does not belong to this company',
        );
      }

      /* ---------------------------------------------------
      * 3. Ensure company has more than 1 domain
      * --------------------------------------------------- */
      if (company.email_domains.length <= 1) {
        throw new BadRequestException(
          'A company must have at least one email domain',
        );
      }

      /* ---------------------------------------------------
      * 4. Delete domain
      * --------------------------------------------------- */
      await domainRepository.remove(domain);

      /* ---------------------------------------------------
      * 5. Defensive verification
      * --------------------------------------------------- */
      const remainingDomainsCount = await domainRepository.count({
        where: {
          company: { id: companyId },
        },
      });

      if (remainingDomainsCount === 0) {
        throw new BadRequestException(
          'Company cannot have zero email domains',
        );
      }

      /* ---------------------------------------------------
      * 6. Return response
      * --------------------------------------------------- */
      return {
        message: 'Company email domain deleted successfully',
        company_id: companyId,
        domain_id: domainId,
      };
    });
  }
}
