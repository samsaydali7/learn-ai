import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto, Category } from './categories.dto';

@Injectable()
export class CategoriesService {
  private categories: Map<string, Category> = new Map();
  private categoryIdCounter = 1;

  create(createCategoryDto: CreateCategoryDto): Category {
    const id = String(this.categoryIdCounter++);
    const category: Category = {
      id,
      ...createCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  findAll(): Category[] {
    return Array.from(this.categories.values());
  }

  findOne(id: string): Category | undefined {
    return this.categories.get(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): Category | undefined {
    const category = this.categories.get(id);
    if (!category) {
      return undefined;
    }
    const updated = {
      ...category,
      ...updateCategoryDto,
      updatedAt: new Date(),
    };
    this.categories.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.categories.delete(id);
  }
}
