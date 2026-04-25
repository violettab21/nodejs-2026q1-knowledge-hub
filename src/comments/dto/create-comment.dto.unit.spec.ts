import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

describe('Create Comment DTO', () => {
  it('should not fail if all fields passed and valid', async () => {
    const validComment = {
      content: 'comment content',
      authorId: '915b21e3-fa85-413a-9a6a-c01030592935',
      articleId: '58118e98-5879-4536-841a-daa3ba3b67bc',
    };
    const dto = plainToInstance(CreateCommentDto, validComment);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should not fail if all required fields passed and valid', async () => {
    const validComment = {
      content: 'comment content',
      articleId: '58118e98-5879-4536-841a-daa3ba3b67bc',
    };
    const dto = plainToInstance(CreateCommentDto, validComment);
    const result = await validateOrReject(dto);
    expect(result).toBeUndefined();
  });

  it('should throw error if required fields are missing', async () => {
    const invalidComment = {
      content: 'content without articleId',
    };
    const dto = plainToInstance(CreateCommentDto, invalidComment);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if articleId is invalid', async () => {
    const invalidComment = {
      content: 'comment content',
      articleId: '58118e98-5879-4536-8',
    };
    const dto = plainToInstance(CreateCommentDto, invalidComment);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });

  it('should throw error if authorId is invalid', async () => {
    const invalidComment = {
      content: 'comment content',
      articleId: '58118e98-5879-4536-841a-daa3ba3b67bc',
      authorId: '58118e98-5879-4536-8',
    };
    const dto = plainToInstance(CreateCommentDto, invalidComment);

    await expect(validateOrReject(dto)).rejects.toThrow();
  });
});
