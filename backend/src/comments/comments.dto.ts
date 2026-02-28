import { IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsString()
  postId: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}

export interface Comment {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  parentCommentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
