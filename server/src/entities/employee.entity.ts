import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Dept } from './dept.entity';
import { KPIScore } from './kpi-score.entity';
import { CalculatedScore } from './calculated-score.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  emp_id: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'bigint', unique: true, nullable: true })
  contact_no: number;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Role, (role) => role.employees)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Dept)
  @JoinColumn({ name: 'dept_id' })
  dept: Dept;

  @ManyToOne(() => Employee, (emp) => emp.approvees, { nullable: true })
  @JoinColumn({ name: 'kpi_approver_id' })
  kpiApprover: Employee;

  @OneToMany(() => Employee, (emp) => emp.kpiApprover)
  approvees: Employee[];

  @OneToMany(() => KPIScore, (score) => score.employee)
  kpiScores: KPIScore[];

  @OneToMany(() => CalculatedScore, (score) => score.employee)
  calculatedScores: CalculatedScore[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
