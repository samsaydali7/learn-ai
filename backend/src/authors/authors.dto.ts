import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
