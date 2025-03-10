import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query} from '@nestjs/common';
import { CategoryService } from './category.service';
import {CreateCategoryDto, UpdateCategoryDto} from './dto/category.dto';

@Controller('transaction/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body(ValidationPipe) createCategory: CreateCategoryDto) {
    return this.categoryService.create(createCategory);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.categoryService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Query('userId') userId:string, @Body(ValidationPipe) updateCategory: UpdateCategoryDto) {
    return this.categoryService.update(id, userId, updateCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
