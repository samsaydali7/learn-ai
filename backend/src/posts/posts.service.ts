import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto, BlogPost } from './posts.dto';

@Injectable()
export class PostsService {
  private posts: Map<string, BlogPost> = new Map();
  private postIdCounter = 1;

  create(createPostDto: CreatePostDto): BlogPost {
    const id = String(this.postIdCounter++);
    const post: BlogPost = {
      id,
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  findAll(): BlogPost[] {
    return Array.from(this.posts.values());
  }

  findOne(id: string): BlogPost | undefined {
    return this.posts.get(id);
  }

  update(id: string, updatePostDto: UpdatePostDto): BlogPost | undefined {
    const post = this.posts.get(id);
    if (!post) {
      return undefined;
    }
    const updated = {
      ...post,
      ...updatePostDto,
      updatedAt: new Date(),
    };
    this.posts.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.posts.delete(id);
  }

  findByCategory(categoryId: string): BlogPost[] {
    return Array.from(this.posts.values()).filter(
      (post) => post.categoryId === categoryId,
    );
  }
}
