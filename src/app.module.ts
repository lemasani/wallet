import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from "@nestjs/core";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, ThrottlerModule.forRoot([{
    name: "short",
    ttl: 1000,
    limit: 3,
  },{
    name: "long",
    ttl: 60000,
    limit: 100,
  }]), UserModule],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: ThrottlerGuard  }],
})
export class AppModule {}
