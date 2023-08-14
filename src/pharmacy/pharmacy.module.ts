import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyMockService } from 'src/lib/pharmacy-mock.service';

@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService, PharmacyMockService],
})
export class PharmacyModule {}
