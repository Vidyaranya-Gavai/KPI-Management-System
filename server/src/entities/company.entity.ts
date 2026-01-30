import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CompanyEmailDomain } from "./company-email-domain.entity";

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

  @OneToMany(() => CompanyEmailDomain, d => d.company)
  email_domains: CompanyEmailDomain[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
