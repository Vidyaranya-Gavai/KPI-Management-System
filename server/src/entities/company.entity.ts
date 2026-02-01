import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CompanyEmailDomain } from "./company-email-domain.entity";
import { AdminUser } from "./admin-user.entity";

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  code: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

    // Parent company (self reference)
  @ManyToOne(() => Company, company => company.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_company_id' })
  parent: Company | null;

  // Child companies
  @OneToMany(() => Company, company => company.parent)
  children: Company[];

  // Email domains
  @OneToMany(() => CompanyEmailDomain, d => d.company)
  email_domains: CompanyEmailDomain[];

  // Admin who created the company
  @ManyToOne(() => AdminUser, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  created_by: AdminUser | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
