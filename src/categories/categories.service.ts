import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategoriesStorage } from './interfaces/categories.interface';
import { getPaginationData } from '../helpers/pagination/pagination';
import { sortData } from '../helpers/sorting/sorting';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoriesStorage') private storage: ICategoriesStorage,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.storage.createCategory(createCategoryDto);
  }

  async findAll(
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const categories = await this.storage.getCategories();
    let data = categories;
    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }

    if (page && limit) {
      return getPaginationData(+page, +limit, data);
    }

    return data;
  }

  async findOne(id: string) {
    return await this.storage.getCategoryById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.storage.updateCategory(id, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.storage.removeCategory(id);
  }
}
