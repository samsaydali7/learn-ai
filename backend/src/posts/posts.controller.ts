import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    const post = this.postsService.create(createPostDto);
    return { success: true, data: post };
  }

  @Get()
  findAll() {
    const posts = this.postsService.findAll();
    return { success: true, data: posts };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const post = this.postsService.findOne(id);
    if (!post) {
      return { success: false, message: 'Post not found' };
    }
    return { success: true, data: post };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = this.postsService.update(id, updatePostDto);
    if (!post) {
      return { success: false, message: 'Post not found' };
    }
    return { success: true, data: post };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const success = this.postsService.remove(id);
    if (!success) {
      return { success: false, message: 'Post not found' };
    }
    return { success: true, message: 'Post deleted' };
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    const posts = this.postsService.findByCategory(categoryId);
    return { success: true, data: posts };
  }
}
