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
import { Role } from 'src/entities/role.entity';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getAllDepts(adminId: number) {
    return this.deptRepository.find({
      where: { created_by: { id: adminId } },
    });
  }

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
    /* Check if dept exists, and if admin is authorised to update this dept */
    const dept = await this.deptRepository.findOne({
      where: { id: deptId, created_by: { id: adminId } },
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

  async deleteDept(deptId: number, adminId: number) {
    /* Check if dept exists, and if admin is authorised to delete this dept */
    const dept = await this.deptRepository.findOne({
      where: { id: deptId, created_by: { id: adminId } },
    });

    if (!dept) {
      throw new NotFoundException('Department not found');
    }

    /* Check if there are any roles mapped to this dept */
    const mappedRoles = await this.roleRepository.find({
      where: { dept: { id: deptId } },
    });

    if (mappedRoles.length > 0) {
      throw new BadRequestException(
        'Cannot delete department with mapped roles. Please unmap roles first.',
      );
    }

    await this.deptRepository.remove(dept);

    return { message: 'Department deleted successfully', id: deptId };
  }
}
