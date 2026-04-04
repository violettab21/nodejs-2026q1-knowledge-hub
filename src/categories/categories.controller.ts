import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryParams } from './dto/category-params.dto';

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: CategoryParams) {
    const category = this.categoriesService.findOne(params.id);
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  update(
    @Param() params: CategoryParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = this.categoriesService.update(
      params.id,
      updateCategoryDto,
    );
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  remove(@Param() params: CategoryParams) {
    const category = this.categoriesService.remove(params.id);
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }
}
