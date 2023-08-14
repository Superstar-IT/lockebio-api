import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PharmacyDto } from './dto/pharmacy.dto';
import { PharmacyService } from './pharmacy.service';

@ApiTags('Pharmacy')
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @ApiOkResponse({ type: PharmacyDto, isArray: true })
  @Get()
  async getPharmacies() {
    return await this.pharmacyService.getPharmacies();
  }
}
