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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './authors.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const author = this.authorsService.create(createAuthorDto);
    return { success: true, data: author };
  }

  @Get()
  findAll(@Query('email') email?: string) {
    let authors;
    if (email) {
      const author = this.authorsService.findByEmail(email);
      authors = author ? [author] : [];
    } else {
      authors = this.authorsService.findAll();
    }
    return { success: true, data: authors };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const author = this.authorsService.findOne(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return { success: true, data: author };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    const author = this.authorsService.update(id, updateAuthorDto);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return { success: true, data: author };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const success = this.authorsService.remove(id);
    if (!success) {
      throw new NotFoundException('Author not found');
    }
    return { success: true, message: 'Author deleted' };
  }
}
