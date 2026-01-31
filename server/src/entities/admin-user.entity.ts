import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { AdminRefreshToken } from './admin-refresh-token.entity';

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

  @OneToMany(
    () => AdminRefreshToken,
    (token) => token.admin,
  )
  refreshTokens: AdminRefreshToken[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
