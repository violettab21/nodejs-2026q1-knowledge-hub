import { Injectable } from '@nestjs/common';

import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ICategoriesStorage } from '../interfaces/categories.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesStorage implements ICategoriesStorage {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return await this.prisma.category.findMany();
  }

  async getCategoryById(id: string) {
    const foundCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    return foundCategory;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
      },
    });

    return newCategory;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.prisma.category.update({
      where: { id: id },
      data: {
        ...updateCategoryDto,
      },
    });

    return updatedCategory;
  }

  async removeCategory(id: string) {
    const deletedCategory = await this.prisma.category.delete({
      where: { id: id },
    });

    return deletedCategory;
  }
}
