import { ApiProperty } from '@nestjs/swagger';
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn 
} from 'typeorm';

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: "varchar", length: 255 })
    name: string;

    @ApiProperty()
    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "text", nullable: true, name: "password_hash"})
    passwordHash: string;

    @ApiProperty()
    @Column({ type: "varchar", length: 20, nullable: true })
    phone: string;

    @ApiProperty()
    @Column({ type: "text", nullable: true })
    address: string;

    @ApiProperty()
    @Column({ type: "enum", default: "customer", enum: ["customer", "admin"] })
    role: "customer" | "admin";

    @ApiProperty()
    @Column({ type: "varchar", length: 255, nullable: true })
    avatar: string;

    @ApiProperty()
    @Column({ type: "enum", default: "local", enum: ["local", "google", "github"]})
    provider: "local" | "google" | "github";

    @ApiProperty()
    @Column({ type: "varchar", length: 255, nullable: true, name: "provider_id" })
    providerId: string;

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;
}