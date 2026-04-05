import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ICategoriesStorage } from '../interfaces/categories.interface';

@Injectable()
export class CategoriesStorage implements ICategoriesStorage {
  private categories: Category[] = [];

  constructor() {}

  getCategories() {
    return this.categories;
  }

  getCategoryById(id: string) {
    const foundCategory = this.categories.find(
      (category) => category.id === id,
    );
    if (foundCategory) {
      return foundCategory;
    }
    return null;
  }

  createCategory(createCategoryDto: CreateCategoryDto) {
    const newCategory: Category = {
      id: randomUUID(),
      ...createCategoryDto,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = this.categories.find(
      (category) => category.id === id,
    );
    if (updatedCategory) {
      updatedCategory.name = updateCategoryDto.name;
      updatedCategory.description = updateCategoryDto.description;
      return updatedCategory;
    }
    return null;
  }

  removeCategory(id: string) {
    const deletedCategory = this.categories.find(
      (category) => category.id === id,
    );
    if (deletedCategory) {
      this.categories = this.categories.filter(
        (category) => category.id !== id,
      );
      return deletedCategory;
    }
    return null;
  }
}
