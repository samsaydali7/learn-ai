import { Injectable } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto, Author } from './authors.dto';

@Injectable()
export class AuthorsService {
  private authors: Map<string, Author> = new Map();
  private authorIdCounter = 1;

  create(createAuthorDto: CreateAuthorDto): Author {
    const id = String(this.authorIdCounter++);
    const author: Author = {
      id,
      ...createAuthorDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.authors.set(id, author);
    return author;
  }

  findAll(): Author[] {
    return Array.from(this.authors.values());
  }

  findOne(id: string): Author | undefined {
    return this.authors.get(id);
  }

  findByEmail(email: string): Author | undefined {
    return Array.from(this.authors.values()).find((author) => author.email === email);
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto): Author | undefined {
    const author = this.authors.get(id);
    if (!author) {
      return undefined;
    }
    const updated = {
      ...author,
      ...updateAuthorDto,
      updatedAt: new Date(),
    };
    this.authors.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.authors.delete(id);
  }
}
