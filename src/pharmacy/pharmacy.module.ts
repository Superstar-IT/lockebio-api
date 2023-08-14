import { Module } from '@nestjs/common';

import { PharmacyMockService } from 'src/core/lib/pharmacy-mock.service';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';

@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService, PharmacyMockService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
