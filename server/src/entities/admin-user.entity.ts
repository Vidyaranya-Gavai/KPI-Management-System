import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { AdminRefreshToken } from './admin-refresh-token.entity';
import { Company } from './company.entity';
import { CompanyEmailDomain } from './company-email-domain.entity';
import { Dept } from './dept.entity';
import { Role } from './role.entity';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'text' })
  @IsEmail()
  recovery_email: string;

  @OneToMany(() => AdminRefreshToken, (token) => token.admin)
  refreshTokens: AdminRefreshToken[];

  @OneToMany(() => Company, (company) => company.created_by)
  companies: Company[];

  @OneToMany(() => CompanyEmailDomain, (domain) => domain.created_by)
  companyEmailDomains: CompanyEmailDomain[];

  @OneToMany(() => Dept, (dept) => dept.created_by)
  depts: Dept[];

  @OneToMany(() => Role, (role) => role.created_by)
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
