import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KPI } from './kpi.entity';
import { Employee } from './employee.entity';
import { MonthEnum } from './month.enum';

@Entity('kpi_score')
export class KPIScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => KPI)
  @JoinColumn({ name: 'kpi_id' })
  kpi: KPI;

  @ManyToOne(() => Employee, emp => emp.kpiScores)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'enum', enum: MonthEnum })
  month: MonthEnum;

  @Column({ type: 'int' })
  year: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
