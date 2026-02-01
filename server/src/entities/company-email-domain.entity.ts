import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company.entity";
import { AdminUser } from "./admin-user.entity";

@Entity('company_email_domain')
export class CompanyEmailDomain {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, company => company.email_domains, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'text', unique: true })
  domain: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // Admin who added this domain
  @ManyToOne(() => AdminUser, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  created_by: AdminUser | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
