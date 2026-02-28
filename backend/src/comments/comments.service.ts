import { Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto, Comment } from './comments.dto';

@Injectable()
export class CommentsService {
  private comments: Map<string, Comment> = new Map();
  private commentIdCounter = 1;

  create(createCommentDto: CreateCommentDto): Comment {
    const id = String(this.commentIdCounter++);
    const comment: Comment = {
      id,
      ...createCommentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  findAll(): Comment[] {
    return Array.from(this.comments.values());
  }

  findOne(id: string): Comment | undefined {
    return this.comments.get(id);
  }

  findByPostId(postId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.postId === postId,
    );
  }

  findByAuthorId(authorId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.authorId === authorId,
    );
  }

  update(id: string, updateCommentDto: UpdateCommentDto): Comment | undefined {
    const comment = this.comments.get(id);
    if (!comment) {
      return undefined;
    }
    const updated = {
      ...comment,
      ...updateCommentDto,
      updatedAt: new Date(),
    };
    this.comments.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.comments.delete(id);
  }
}
