import { join } from 'path';
import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  GraphqlInterceptor,
  SentryModule,
} from '@travelerdev/nestjs-sentry-graphql';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { LoggerModule } from './logger/app-logger.module';
import { GqlThrottlerGuard } from './util/guards/gql-execution-context.guard';
import throttle from './config/throttle.config';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ItemModule } from './items/item.module';
import { WarehouseStockModule } from './warehouseStocks/warehouseStock.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { ItemCategoryModule } from './itemCategories/itemCategory.module';
import { PharmacyStockModule } from './pharmacyStock/pharmacyStock.module';
import { StockMovementModule } from './stockMovement/stockMovement.module';
import { EmailModule } from './email/email.module';

const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;

let providerArr: any = [
  {
    provide: APP_INTERCEPTOR,
    useFactory: () => new GraphqlInterceptor(),
  },
];
if (env !== 'development') {
  providerArr.push({
    provide: APP_GUARD,
    useClass: GqlThrottlerGuard,
  });
}

dotenv.config({ path: join(process.cwd(), `.env.${env}`) });
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), `.env.${env}`),
      isGlobal: true,
      load: [throttle],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [],
    }),
    UsersModule,
    OrganizationModule,
    WarehouseModule,
    ItemModule,
    EmailModule,
    WarehouseStockModule,
    StockMovementModule,
    PharmacyModule,
    ItemCategoryModule,
    PharmacyStockModule,
    AuthModule,
    AccountModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttle.TTL'),
          limit: config.get('throttle.LIMIT'),
        },
      ],
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
      environment: process.env.APP_ENV,
      logLevels: ['debug'],
    }),
  ],
  controllers: [],
  providers: providerArr,
})
export class AppModule {}
