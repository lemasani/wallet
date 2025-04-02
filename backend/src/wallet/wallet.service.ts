import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto, UpdateWalletDto } from './dto/wallet.dto';
import { Database } from '../database/database';

@Injectable()
export class WalletService {
  constructor(private readonly database: Database) {}
  async create(createWallet: CreateWalletDto) {
    const checkExisting = await this.database.account.findFirst({
      where: {
        userId: createWallet.userId,
        name: createWallet.name,
      },
    });

    if (checkExisting) {
      throw new ConflictException(
        'User already has an account with this name.',
      );
    }

    return this.database.account.create({
      data: createWallet,
    });
  }

  async findAllForUser(userId: string) {
    return this.database.account.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        balance: true,
      },
    });
  }

  async findOne(id: string) {
    return this.database.account.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        balance: true,
      },
    });
  }

  async update(id: string, userId: string, updateWallet: UpdateWalletDto) {
    // Ensure the wallet belongs to the user before updating
    const existingWallet = await this.database.account.findFirst({
      where: { id, userId }, // Check if the wallet exists for this user
    });

    if (!existingWallet) {
      throw new NotFoundException(
        'Wallet not found or does not belong to this user.',
      );
    }

    return this.database.account.update({
      where: { id },
      data: updateWallet,
    });
  }

  async remove(id: string) {
    return this.database.account.delete({
      where: { id },
    });
  }
}
