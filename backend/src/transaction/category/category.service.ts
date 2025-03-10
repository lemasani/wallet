import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateCategoryDto, UpdateCategoryDto} from './dto/category.dto';
import {Database} from '../../database/database';

@Injectable()
export class CategoryService {
  constructor(private readonly database: Database) {}
  
  async create(createCategory: CreateCategoryDto) {
    const checkExisting = await this.database.category.findFirst({
      where: {
        userId: createCategory.userId,
        name: createCategory.name,
      }
    })
    
    if (checkExisting) {
      throw new ConflictException('Category for the user already exists');
    }
    return this.database.category.create({
      data: createCategory,
      select: {
        id: true,
        name: true,
      }
    })
  }

  async findAllForUser(userId: string) {
    return this.database.category.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        name: true,
      }
    })
  }

  async findOne(id: string) {
    return this.database.category.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
      }
    })
  }

  async update(id: string, userId: string, updateCategory: UpdateCategoryDto) {
    const checkExisting = await this.database.category.findFirst({
      where: {
        userId,id
      }
    })
    if (!checkExisting) {
      throw new NotFoundException('Category for the user does not exists');
    }
    
    
    return this.database.category.update({
      where: {id},
      data: updateCategory,
    })
  }

  async remove(id: string) {
    return this.database.category.delete({
      where: {id}
    })
  }
}
