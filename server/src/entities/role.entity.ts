import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Dept } from './dept.entity';
import { KPI } from './kpi.entity';
import { Employee } from './employee.entity';
import { AdminUser } from './admin-user.entity';
import { Company } from './company.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Dept, (dept) => dept.roles)
  @JoinColumn({ name: 'dept_id' })
  dept: Dept;

  @OneToMany(() => KPI, (kpi) => kpi.role)
  kpis: KPI[];

  @OneToMany(() => Employee, (emp) => emp.role)
  employees: Employee[];

  // Role → Admin (created by)
  @ManyToOne(() => AdminUser, (admin) => admin.roles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  created_by: AdminUser | null;

  // Role → Company
  @ManyToOne(() => Company, (company) => company.roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
