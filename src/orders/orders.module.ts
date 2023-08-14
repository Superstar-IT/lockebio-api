import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { OrdersService } from './orders.service';

@Module({
  imports: [InMemoryDBModule.forFeature('orders'), PharmacyModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
