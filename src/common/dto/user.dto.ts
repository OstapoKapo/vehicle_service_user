import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    firstName?: string;
    @IsOptional()
    @IsString()
    @MinLength(2)
    lastName?: string;
    @IsEmail()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    email?: string;
}

export class CreateUserDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail()
    email!: string;

    @ValidateIf(o => o.isAdmin === true) 
    @IsString()
    @MinLength(6, { message: 'Password need to be at least 6 characters' })
    password?: string;

    @ValidateIf(o => o.isAdmin === true)
    @IsString()
    @MinLength(6)
    confirmPassword?: string;

    @IsString()
    @MinLength(2)
    firstName!: string;

    @IsString()
    @MinLength(2)
    lastName!: string;
    
    @IsBoolean()
    isAdmin!: boolean;
}