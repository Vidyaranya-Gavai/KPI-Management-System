import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dept } from '../../../entities/dept.entity';
import { Company } from '../../../entities/company.entity';
import { CreateDeptDto } from './dtos/create/create-dept.dto';
import { UpdateDeptDto } from './dtos/update/update-dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createDept(
    createDeptDto: CreateDeptDto,
    companyId: number,
    adminId: number,
  ) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const existingDept = await this.deptRepository.findOne({
      where: {
        name: createDeptDto.name,
        company: { id: companyId },
      },
      relations: ['company'],
    });

    if (existingDept) {
      throw new BadRequestException(
        'Department with this name already exists for the company',
      );
    }

    const dept = this.deptRepository.create({
      name: createDeptDto.name,
      type: createDeptDto.type,
      company: { id: companyId },
      created_by: { id: adminId },
    });

    return this.deptRepository.save(dept);
  }

  async updateDept(
    deptId: number,
    updateDeptDto: UpdateDeptDto,
    adminId: number,
  ) {
    const dept = await this.deptRepository.findOne({
      where: { id: deptId },
      relations: ['company'],
    });

    if (!dept) {
      throw new NotFoundException('Department not found');
    }

    if (updateDeptDto.name) {
      // Case 1: same name as current
      if (updateDeptDto.name === dept.name) {
        throw new BadRequestException('Department name is already the same');
      }

      // Case 2: name clashes with another dept in same company
      const existingDept = await this.deptRepository.findOne({
        where: {
          name: updateDeptDto.name,
          company: { id: dept.company.id },
        },
        relations: ['company'],
      });

      if (existingDept) {
        throw new BadRequestException(
          'Department with this name already exists in the company',
        );
      }
    }

    Object.assign(dept, updateDeptDto);

    return this.deptRepository.save(dept);
  }
}
