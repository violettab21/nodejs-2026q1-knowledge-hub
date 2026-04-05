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
import {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
} from 'src/constants/constants';

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
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Category],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  findAll(@Query() params: CategoryQueryParams) {
    const { page, limit, sortBy, order } = params;
    return this.categoriesService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  findOne(@Param() params: CategoryParams) {
    const category = this.categoriesService.findOne(params.id);
    if (category) {
      return category;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
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
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  remove(@Param() params: CategoryParams) {
    const category = this.categoriesService.remove(params.id);
    if (category) {
      return category;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }
}
