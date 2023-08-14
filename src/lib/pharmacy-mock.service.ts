import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

import { PharmacyDto } from 'src/pharmacy/dto/pharmacy.dto';

@Injectable()
export class PharmacyMockService {
  constructor(private readonly configService: ConfigService) {
    this.httpClient = axios.create({
      baseURL: this.configService.get('app.pharmacyMockApiServer'),
    });
  }

  httpClient: AxiosInstance;

  async getPharmacies(): Promise<PharmacyDto[]> {
    return await this.httpClient
      .get(`/pharmacy`)
      .then((res) => res.data as PharmacyDto[]);
  }
}
