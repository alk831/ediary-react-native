import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  getRepository,
} from 'typeorm';
import { UserId } from '../../types';
import { IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Product } from './Product';
import { Meal } from './Meal';
import { Profile } from './Profile';

@Entity('User')
export class User {

  @PrimaryGeneratedColumn()
  id!: UserId;

  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email!: string | null;

  @Column()
  login!: string;

  @Column()
  @MinLength(4)
  @MaxLength(14)
  password!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;

  @OneToMany(type => Product, product => product.userId)
  products!: Product[];
  
  @OneToMany(type => Meal, meal => meal.userId)
  meals!: Meal[];

  @OneToOne(type => Profile, profile => profile.user)
  profile!: Profile; 
  
  async getProfile(): Promise<Profile> {
    const profile = await getRepository(Profile).findOneOrFail(this.id);
    this.profile = profile;
    return profile;
  }
}