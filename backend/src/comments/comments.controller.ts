import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const comment = this.commentsService.create(createCommentDto);
    return { success: true, data: comment };
  }

  @Get()
  findAll(@Query('postId') postId?: string, @Query('authorId') authorId?: string) {
    let comments;
    if (postId) {
      comments = this.commentsService.findByPostId(postId);
    } else if (authorId) {
      comments = this.commentsService.findByAuthorId(authorId);
    } else {
      comments = this.commentsService.findAll();
    }
    return { success: true, data: comments };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const comment = this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return { success: true, data: comment };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = this.commentsService.update(id, updateCommentDto);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return { success: true, data: comment };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const success = this.commentsService.remove(id);
    if (!success) {
      throw new NotFoundException('Comment not found');
    }
    return { success: true, message: 'Comment deleted' };
  }
}
