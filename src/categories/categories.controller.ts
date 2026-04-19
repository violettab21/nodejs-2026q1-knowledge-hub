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
  INTERNAL_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
} from 'src/constants/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Roles } from 'src/auth/auth.roles';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('Category')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    type: Category,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Category],
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  async findAll(@Query() params: CategoryQueryParams) {
    const { page, limit, sortBy, order } = params;
    return await this.categoriesService.findAll(page, limit, sortBy, order);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  async findOne(@Param() params: CategoryParams) {
    const category = await this.categoriesService.findOne(params.id);
    if (category) {
      return category;
    }
    throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN])
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    type: Category,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  async update(
    @Param() params: CategoryParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category = await this.categoriesService.update(
        params.id,
        updateCategoryDto,
      );

      return category;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          INTERNAL_ERROR_MESSAGE,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({ status: 400, description: BAD_REQUEST_MESSAGE })
  @ApiResponse({ status: 404, description: NOT_FOUND_MESSAGE })
  async remove(@Param() params: CategoryParams) {
    try {
      const category = await this.categoriesService.remove(params.id);

      return category;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          INTERNAL_ERROR_MESSAGE,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
