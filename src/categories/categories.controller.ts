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
  HttpCode,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryParams, CategoryQueryParams } from './dto/category-params.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Category],
  })
  findAll(@Query() params: CategoryQueryParams) {
    const { page, limit, sortBy, order } = params;
    return this.categoriesService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  findOne(@Param() params: CategoryParams) {
    const category = this.categoriesService.findOne(params.id);
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
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
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param() params: CategoryParams) {
    const category = this.categoriesService.remove(params.id);
    if (category) {
      return category;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }
}
