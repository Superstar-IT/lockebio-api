import { Test, TestingModule } from '@nestjs/testing';

import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { PharmacyDto } from './dto/pharmacy.dto';

describe('PharmacyController', () => {
  let controller: PharmacyController;
  let mockPharmacyService: PharmacyService;

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
      controllers: [PharmacyController],
      providers: [
        {
          provide: PharmacyService,
          useValue: {
            getPharmacies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyController>(PharmacyController);
    mockPharmacyService = module.get<PharmacyService>(PharmacyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call pharmacy service and return pharmacies', async () => {
    const mockPharmacies = [{ id: 1 }];
    mockPharmacyService.getPharmacies = jest
      .fn()
      .mockResolvedValue(mockPharmacies);

    const result = await controller.getPharmacies();

    expect(result).toEqual(mockPharmacies);
    expect(mockPharmacyService.getPharmacies).toHaveBeenCalled();
  });
});

/*


describe('PharmacyController', () => {
  let controller: PharmacyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyController],
      providers: [
        {
          provide: PharmacyService,
          useValue: {
            getPharmacies: jest.fn(), 
          },
        }
      ],
    }).compile();

    
  });

  
});
*/
