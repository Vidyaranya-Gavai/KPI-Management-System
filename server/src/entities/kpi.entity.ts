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
import { KPIScore } from './kpi-score.entity';

@Entity('kpi')
export class KPI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  score_type: string;

  @ManyToOne(() => KPI, (kpi) => kpi.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: KPI;

  @OneToMany(() => KPI, (kpi) => kpi.parent)
  children: KPI[];

  @ManyToOne(() => Role, (role) => role.kpis)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'boolean', default: true })
  contribute_to_parent: boolean;

  @OneToMany(() => KPIScore, (score) => score.kpi)
  kpiScores: KPIScore[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
