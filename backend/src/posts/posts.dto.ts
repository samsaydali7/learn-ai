import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  mainImage: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  mainImage: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}
