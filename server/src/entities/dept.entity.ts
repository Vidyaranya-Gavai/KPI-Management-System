import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { AdminUser } from './admin-user.entity';
import { Company } from './company.entity';

@Entity('dept')
export class Dept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @OneToMany(() => Role, (role) => role.dept)
  roles: Role[];

  // Dept → Admin (created by)
  @ManyToOne(() => AdminUser, (admin) => admin.depts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  created_by: AdminUser | null;

  // Dept → Company
  @ManyToOne(() => Company, (company) => company.depts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
