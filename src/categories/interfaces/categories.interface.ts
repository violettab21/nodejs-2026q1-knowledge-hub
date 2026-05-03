import { Category } from 'generated/prisma/client';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export interface ICategoriesStorage {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category> | null;
  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
  updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> | null;
  removeCategory(id: string): Promise<Category> | null;
}
