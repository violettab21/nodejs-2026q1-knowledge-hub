import { sortData } from './sorting';

const testArray = [
  {
    id: '1e27b6f3-fa40-44e8-8baf-9ede2f71249c',
    title: 'BArticle1',
    content: 'Article1 content',
    authorId: null,
    categoryId: null,
    createdAt: 1234,
    updatedAt: 4321,
    tags: ['tag1', 'tag2'],
  },
  {
    id: '206fce25-a5e4-474c-8f3c-24b045642e5d',
    title: 'AArticle2',
    content: 'Article2 content',
    authorId: null,
    categoryId: null,
    createdAt: 4311,
    updatedAt: 123,
    tags: [],
  },
];

describe('Verify Sorting', () => {
  it('should sort array by provided field - string', () => {
    const res = sortData('title', 'asc', testArray);
    expect(res).toEqual([testArray[1], testArray[0]]);
  });

  it('should sort array by provided field - number', () => {
    const res = sortData('createdAt', 'desc', testArray);
    expect(res).toEqual([testArray[1], testArray[0]]);
  });

  it('should sort array by provided field - array', () => {
    const res = sortData('tags', 'asc', testArray);
    expect(res).toEqual([testArray[1], testArray[0]]);
  });
});
