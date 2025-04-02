import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpadateUserDto } from './dto/user.dto';
import { Database } from '../database/database';
import { hashPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(private readonly database: Database) {}

  async create(createUser: CreateUserDto) {
    const existingUser = await this.database.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(createUser.password);

    const createdUser = await this.database.user.create({
      data: {
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        email: createUser.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return createdUser;
  }

  async findAll() {
    return this.database.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findOne(id: string) {
    // Check if user exists
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isDeleted) {
      throw new ConflictException('User does not exist');
    }

    return this.database.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async update(id: string, updateUser: UpadateUserDto) {
    // Check if user exists
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isDeleted) {
      throw new ConflictException('User does not exist');
    }

    // If password is provided, hash it
    if (updateUser.password) {
      updateUser.password = await hashPassword(updateUser.password);
    }

    return this.database.user.update({
      where: { id },
      data: updateUser,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async remove(id: string) {
    // Check if user exists
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (user.isDeleted) {
      throw new ConflictException('User does not exist');
    }

    return this.database.user.update({
      where: { id },
      data: {
        isDeleted: true,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }
}
