import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesService.create(createCategoryDto);
    return { success: true, data: category };
  }

  @Get()
  findAll() {
    const categories = this.categoriesService.findAll();
    return { success: true, data: categories };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const category = this.categoriesService.findOne(id);
    if (!category) {
      return { success: false, message: 'Category not found' };
    }
    return { success: true, data: category };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = this.categoriesService.update(id, updateCategoryDto);
    if (!category) {
      return { success: false, message: 'Category not found' };
    }
    return { success: true, data: category };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const success = this.categoriesService.remove(id);
    if (!success) {
      return { success: false, message: 'Category not found' };
    }
    return { success: true, message: 'Category deleted' };
  }
}
