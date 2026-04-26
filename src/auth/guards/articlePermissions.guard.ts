import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/enums';
import { IArticlesStorage } from '../../articles/interfaces/articles.interface';

@Injectable()
export class PermissionsArticlesGuard implements CanActivate {
  constructor(
    @Inject('IArticlesStorage')
    private storage: IArticlesStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const articleId = req.params?.id;
    if (user.role === UserRole.EDITOR && req.method !== 'GET') {
      if (articleId) {
        const article = await this.storage.getArticleById(articleId);
        if (article.authorId !== user.userId) {
          return false;
        }
      }

      const body = req.body;
      if (body?.authorId && body?.authorId !== user.userId) {
        return false;
      }
    }
    return true;
  }
}
