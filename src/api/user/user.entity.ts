import { Exclude } from 'class-transformer';

import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IsEmail, Min,  } from 'class-validator';
import { Role } from './user.role.enum';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Column()
  public firstName?: string;

  @Column()
  public lastName?: string;

  @Column({ unique: true })
  @IsEmail({ message: 'Email is not valid' })
  public email: string;

  @Column()
  @Min(8, { message: 'Password must be at least 8 characters' })
  @Exclude()
  public password: string;

  @Column({ default: '' })
  public card?: string;

  @Exclude()
  @Column({ default: '' })
  public cardExpiration?: string;

  @Column({ default: '' })
  @Exclude()
  public cardCvv?: string;

  @Column({ default: '' })
  @Exclude()
  public accountNumber?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public roles: Role;

  @Column({ nullable: true })
  public avatarId?: number;

  @Column({ nullable: true })
  public avatarImage?: string;

  @Column({
    nullable: true
  })

  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Column({ default: false })
  public blackListed: boolean;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  //describe a typeorm hook to automatically hash the password before saving it to the database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}