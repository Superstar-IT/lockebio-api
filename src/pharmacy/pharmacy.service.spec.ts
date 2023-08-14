import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { PharmacyMockService } from '../core/lib/pharmacy-mock.service';
import { PharmacyDto } from './dto/pharmacy.dto';
import { PharmacyService } from './pharmacy.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('PharmacyService', () => {
  let service: PharmacyService;
  let mockCacheManager: Cache;
  let mockPharmacyMockService: PharmacyMockService;
  let mockConfigService: ConfigService;

  const mockCacheData = [
    {
      integrationName: 'healthmart',
      name: 'HealthMart Pharmacy',
      address: '123 Main St',
      city: 'Cityville',
      state: 'Stateville',
      zipcode: '12345',
      country: 'Countryland',
      fax: '123-456-7890',
      phone: '987-654-3210',
    },
  ] as PharmacyDto[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: PharmacyMockService,
          useValue: {
            getPharmacies: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PharmacyService>(PharmacyService);
    mockCacheManager = module.get(CACHE_MANAGER);
    mockPharmacyMockService = module.get(PharmacyMockService);
    mockConfigService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get pharmacies from cache if exists', async () => {
    mockCacheManager.get = jest.fn().mockResolvedValue(mockCacheData);

    const result = await service.getPharmacies();

    expect(result).toEqual(mockCacheData);
    expect(mockCacheManager.get).toHaveBeenCalledWith('pharmacies');
    expect(mockPharmacyMockService.getPharmacies).not.toHaveBeenCalled();
  });

  it('should get pharmacies from mock service if not in cache', async () => {
    mockCacheManager.get = jest.fn(null);
    const mockPharmacies = mockCacheData;
    mockPharmacyMockService.getPharmacies = jest
      .fn()
      .mockResolvedValue(mockPharmacies);

    const result = await service.getPharmacies();

    expect(result).toEqual(mockPharmacies);
    expect(mockCacheManager.get).toHaveBeenCalledWith('pharmacies');
    expect(mockPharmacyMockService.getPharmacies).toHaveBeenCalled();
    expect(mockConfigService.get).toHaveBeenCalledWith('app.cacheTTL');
    expect(mockCacheManager.set).toHaveBeenCalledWith(
      'pharmacies',
      mockPharmacies,
      undefined,
    );
  });

  it('should filter pharmacies by integration name if provided', async () => {
    mockCacheManager.get = jest.fn().mockResolvedValue(mockCacheData);

    const result = await service.getPharmacies('healthmart');

    expect(result).toEqual([mockCacheData[0]]);
  });

  it('should throw error on failure', async () => {
    mockCacheManager.get = jest.fn().mockResolvedValue(null);
    mockPharmacyMockService.getPharmacies = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed'));

    await expect(service.getPharmacies()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
