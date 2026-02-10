import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { MonthEnum } from './month.enum';

@Entity('calculated_scores')
export class CalculatedScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (emp) => emp.calculatedScores)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  final_score: number;

  @Column({ type: 'enum', enum: MonthEnum })
  month: MonthEnum;

  @Column({ type: 'int' })
  year: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
