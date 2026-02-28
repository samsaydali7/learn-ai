import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [AuthModule, PostsModule, CategoriesModule, CommentsModule, AuthorsModule],
  controllers: [AppController],
})
export class AppModule {}
