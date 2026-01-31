import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { AdminUser } from './admin-user.entity';

@Entity('admin_refresh_token')
@Index(['tokenHash'])
@Index(['adminId'])
export class AdminRefreshToken {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'admin_id', type: 'bigint' })
  adminId: number;

  @ManyToOne(() => AdminUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: AdminUser;

  @Column({ name: 'token_hash', type: 'text' })
  tokenHash: string;

  @Column({
    name: 'is_valid',
    type: 'boolean',
    default: true,
  })
  isValid: boolean;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
