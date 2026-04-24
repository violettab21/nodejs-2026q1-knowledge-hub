import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ICommentsStorage } from './interfaces/comments.interface';

describe('CommentsService', () => {
  let service: CommentsService;

  const newTestComment = {
    content: 'Comment',
    articleId: '1bb3634e-7ffa-46a7-8507-64a66c815816',
    authorId: null,
  };

  const comments = [
    {
      id: 'e219c6b3-5242-4c66-8775-6bf26a301fb0',
      content: 'comment1',
      articleId: 'ccc7b51f-48ef-4bb8-9026-9301b394a01c',
      authorId: null,
      createdAt: new Date(),
    },
    {
      id: '7b493014-3945-4770-bd02-30f184b53eeb',
      content: 'comment2',
      articleId: '4e3f1630-be42-4bcc-ab7a-9544e419ec16',
      authorId: null,
      createdAt: new Date(),
    },
  ];

  const mockedCommentsStorage = {
    getComments: vi.fn().mockImplementation(() => comments),
    getCommentById: vi
      .fn()
      .mockImplementation((commentId) =>
        comments.find((comment) => comment.id === commentId),
      ),
    createComment: vi
      .fn()
      .mockImplementation((createCommentDto: CreateCommentDto) => {
        return {
          id: '7a6e04c1-bbda-4891-894b-bdad8b949ef7',
          ...createCommentDto,
          createdAt: new Date(),
        };
      }),
    removeComment: vi.fn().mockImplementation((id) => {
      const category = comments.find((comment) => comment.id === id);
      return {
        ...category,
      };
    }),
  } as vi.mocked<ICommentsStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: 'ICommentsStorage',
          useValue: mockedCommentsStorage,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all comments with articleId', async () => {
    const articleId = 'ccc7b51f-48ef-4bb8-9026-9301b394a01c';
    const receivedComments = await service.findAll(articleId);
    const numberOfComments = comments.filter(
      (comment) => comment.articleId === articleId,
    );
    expect(receivedComments.length).toBe(numberOfComments.length);
    expect('createdAt' in receivedComments[0]).toBe(true);
    expect(typeof receivedComments[0].createdAt === 'number').toBe(true);
    expect('content' in receivedComments[0]).toBe(true);
    expect('id' in receivedComments[0]).toBe(true);
    expect('authorId' in receivedComments[0]).toBe(true);
    expect('articleId' in receivedComments[0]).toBe(true);
    expect(mockedCommentsStorage.getComments).toHaveBeenCalled();
  });

  it('should get comment by Id', async () => {
    const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
    const receivedComment = await service.findOne(id);
    expect('createdAt' in receivedComment).toBe(true);
    expect(typeof receivedComment.createdAt === 'number').toBe(true);
    expect('content' in receivedComment).toBe(true);
    expect('id' in receivedComment).toBe(true);
    expect('authorId' in receivedComment).toBe(true);
    expect('articleId' in receivedComment).toBe(true);
    expect(mockedCommentsStorage.getCommentById).toHaveBeenCalledWith(id);
  });

  it('should trigger comment creation', async () => {
    const comm = await service.create(newTestComment);
    expect('createdAt' in comm).toBe(true);
    expect(typeof comm.createdAt === 'number').toBe(true);
    expect('content' in comm).toBe(true);
    expect('id' in comm).toBe(true);
    expect('authorId' in comm).toBe(true);
    expect('articleId' in comm).toBe(true);
    expect(mockedCommentsStorage.createComment).toHaveBeenCalledWith(
      newTestComment,
    );
  });

  it('should trigger comment delete', async () => {
    const id = 'e219c6b3-5242-4c66-8775-6bf26a301fb0';
    await service.remove(id);

    expect(mockedCommentsStorage.removeComment).toHaveBeenCalledWith(id);
  });
});
