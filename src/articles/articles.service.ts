import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IArticlesStorage } from './interfaces/articles.interface';

@Injectable()
export class ArticlesService {
  constructor(@Inject('IArticlesStorage') private storage: IArticlesStorage) {}
  create(createArticleDto: CreateArticleDto) {
    return this.storage.createArticle(createArticleDto);
  }

  findAll(
    status?: 'draft' | 'published' | 'archived',
    categoryId?: string,
    tag?: string,
  ) {
    const articles = this.storage.getArticles();
    if (status || categoryId || tag) {
      return articles.filter((article) => {
        return (
          (status ? article.status === status : true) &&
          (categoryId ? article.categoryId === categoryId : true) &&
          (tag ? article.tags.includes(tag) : true)
        );
      });
    }
    return articles;
  }

  findOne(id: string) {
    return this.storage.getArticleById(id);
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.storage.updateArticle(id, updateArticleDto);
  }

  remove(id: string) {
    return this.storage.removeArticle(id);
  }
}
