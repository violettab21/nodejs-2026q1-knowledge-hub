import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategoriesStorage } from './interfaces/categories.interface';
import { ArticlesService } from 'src/articles/articles.service';
import { getPaginationData } from 'src/helpers/pagination/pagination';
import { sortData } from 'src/helpers/sorting/sorting';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoriesStorage') private storage: ICategoriesStorage,
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.storage.createCategory(createCategoryDto);
  }

  findAll(
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ) {
    const categories = this.storage.getCategories();
    let data = categories;
    if (sortBy && order) {
      data = sortData(sortBy, order, data);
    }

    if (page && limit) {
      return getPaginationData(+page, +limit, data);
    }

    return data;
  }

  findOne(id: string) {
    return this.storage.getCategoryById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.storage.updateCategory(id, updateCategoryDto);
  }

  remove(id: string) {
    const category = this.storage.removeCategory(id);
    if (category) {
      this.articlesService.cleanCategoryId(category.id);
      return category;
    }
    return null;
  }
}
