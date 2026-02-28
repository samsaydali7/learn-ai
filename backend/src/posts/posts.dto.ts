export class CreatePostDto {
  title: string;
  content: string;
  mainImage: string;
  categoryId?: string;
}

export class UpdatePostDto {
  title?: string;
  content?: string;
  mainImage?: string;
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
