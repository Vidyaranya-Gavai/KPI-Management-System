import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Dept } from 'src/entities/dept.entity';
import { CreateRoleDto } from './dtos/create/create-role.dto';

export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Dept)
    private readonly deptRepo: Repository<Dept>,
  ) {}

  async createRole(
    deptId: number,
    createRoleDto: CreateRoleDto,
    adminId: number,
  ) {
    // 1️⃣ Check dept exists
    const dept = await this.deptRepo.findOne({
      where: { id: deptId },
      relations: ['created_by', 'company'],
    });

    if (!dept) {
      throw new NotFoundException('Department not found');
    }

    // 2️⃣ Ownership check
    if (!dept.created_by || dept.created_by.id !== adminId) {
      throw new ForbiddenException(
        'You are not allowed to create role in this department',
      );
    }

    // 3️⃣ Duplicate role name check (within same dept)
    const existingRole = await this.roleRepo.findOne({
      where: {
        name: createRoleDto.name,
        dept: { id: deptId },
      },
      relations: ['dept'],
    });

    if (existingRole) {
      throw new BadRequestException(
        'Role with this name already exists in this department',
      );
    }

    // 4️⃣ Create role
    const role = this.roleRepo.create({
      name: createRoleDto.name,
      type: createRoleDto.type,
      dept: dept,
      company: dept.company,
      created_by: dept.created_by,
    });

    await this.roleRepo.save(role);

    return {
      message: 'Role created successfully',
      role: {
        id: role.id,
        name: role.name,
        type: role.type,
        dept: {
          id: dept.id,
          name: dept.name,
          type: dept.type,
        },
        company: {
          id: role.company.id,
          name: role.company.name,
        },
      },
    };
  }
}
