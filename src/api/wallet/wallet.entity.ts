import {
    Column,
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
  @Entity('Wallet')
  export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;
  
    @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    user: User;
  
    @Column({ default: 0 })
    balance: number;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  