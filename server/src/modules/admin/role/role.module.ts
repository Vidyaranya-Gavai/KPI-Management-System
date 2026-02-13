import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dept } from 'src/entities/dept.entity';
import { Company } from 'src/entities/company.entity';
import { Role } from 'src/entities/role.entity';
import { KPI } from 'src/entities/kpi.entity';
import { Employee } from 'src/entities/employee.entity';
import { KPIScore } from 'src/entities/kpi-score.entity';
import { CalculatedScore } from 'src/entities/calculated-score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dept,
      Company,
      Role,
      KPI,
      Employee,
      KPIScore,
      CalculatedScore,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
