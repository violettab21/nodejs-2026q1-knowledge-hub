import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

export interface ICategoriesStorage {
  getCategories(): Category[];
  getCategoryById(id: string): Category | null;
  createCategory(createCategoryDto: CreateCategoryDto): Category;
  updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Category | null;
  removeCategory(id: string): Category | null;
}
