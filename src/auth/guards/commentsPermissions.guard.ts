import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/enums';
import { ICommentsStorage } from '../../comments/interfaces/comments.interface';

@Injectable()
export class PermissionsCommentsGuard implements CanActivate {
  constructor(
    @Inject('ICommentsStorage')
    private storage: ICommentsStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const commentId = req.params?.id;
    if (user.role === UserRole.EDITOR && req.method !== 'GET') {
      if (commentId) {
        const comment = await this.storage.getCommentById(commentId);
        if (comment?.authorId !== user.userId) {
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
