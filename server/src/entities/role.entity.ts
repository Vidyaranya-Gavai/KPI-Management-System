import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Dept } from './dept.entity';
import { KPI } from './kpi.entity';
import { Employee } from './employee.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Dept, dept => dept.roles)
  @JoinColumn({ name: 'dept_id' })
  dept: Dept;

  @OneToMany(() => KPI, kpi => kpi.role)
  kpis: KPI[];

  @OneToMany(() => Employee, emp => emp.role)
  employees: Employee[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
