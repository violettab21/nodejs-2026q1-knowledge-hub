import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Article } from '../entities/article.entity';

export interface IArticlesStorage {
  getArticles(): Article[];
  getArticleById(id: string): Article | null;
  createArticle(createArticleDto: CreateArticleDto): Article;
  updateArticle(id: string, updateArticleDto: UpdateArticleDto): Article | null;
  removeArticle(id: string): Article | null;
}
