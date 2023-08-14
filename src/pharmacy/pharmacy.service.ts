import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { isEmpty } from 'class-validator';

import { PharmacyMockService } from 'src/lib/pharmacy-mock.service';
import { PharmacyDto } from './dto/pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pharmacyMockService: PharmacyMockService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getPharmacies(integrationName?: string): Promise<PharmacyDto[]> {
    const cachedPharmacies = await this.cacheManager.get('pharmacies');
    let pharmacies: PharmacyDto[] = [];
    if (cachedPharmacies) pharmacies = cachedPharmacies as PharmacyDto[];
    else {
      pharmacies = await this.pharmacyMockService
        .getPharmacies()
        .catch((err) => {
          throw new InternalServerErrorException(
            `Failed to fetch pharmacies: ${err.message}`,
          );
        });
      await this.cacheManager.set(
        'pharmacies',
        pharmacies,
        this.configService.get('app.cacheTTL'),
      );
    }

    return isEmpty(integrationName)
      ? pharmacies
      : pharmacies.filter(
          (pharmacy) => pharmacy.integrationName === integrationName,
        );
  }
}
