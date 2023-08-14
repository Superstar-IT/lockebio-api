import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PharmacyMockService } from '../core/lib/pharmacy-mock.service';
import { PharmacyDto } from '../pharmacy/dto/pharmacy.dto';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './dto/order-response.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let pharmacyService: PharmacyService;
  let ordersService: OrdersService;

  const mockCachePharmacyData = [
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

  const createOrderData = {
    healthMartProduct: 'Painkiller',
    healthMartQuantity: 3,
    healthMartCustomerInfo: {
      healthMartCustName: 'John Doe',
      healthMartCustAddress: '123 Main Street',
      healthMartCustCity: 'Cityville',
      healthMartCustState: 'State',
      healthMartCustZipcode: '12345',
      healthMartCustCountry: 'Country',
    },
  } as CreateOrderDto;

  const mockedOrders = [
    {
      id: '1691622645898',
      product: 'Painkiller',
      quantity: 3,
      integrationName: 'healthmart',
      customerInfo: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Cityville',
        state: 'State',
        zipCode: '12345',
        country: 'Country',
      },
    },
  ] as OrderEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        PharmacyService,
        {
          provide: InMemoryDBService,
          useValue: {
            create: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PharmacyMockService,
          useValue: {
            getPharmacies: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
    pharmacyService = module.get<PharmacyService>(PharmacyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test for createOrder
  it('should create a new order', async () => {
    ordersService.createOrder = jest.fn().mockResolvedValue(mockedOrders[0]);
    pharmacyService.getPharmacies = jest
      .fn()
      .mockResolvedValue(mockCachePharmacyData);
    const expectedResult: Order = {
      healthMartId: '1691622645898',
      ...createOrderData,
    };
    const result = await controller.createOrder('healthmart', createOrderData);

    expect(ordersService.createOrder).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should throw error if invalid order data', async () => {
    const orderDto = {} as CreateOrderDto;

    await expect(controller.createOrder('test', orderDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // Tests for findAllOrdersByIntegrationName
  it('should get all orders for integration', async () => {
    const integrationName = 'healthmart';

    pharmacyService.getPharmacies = jest
      .fn()
      .mockResolvedValue(mockCachePharmacyData);
    ordersService.findAllOrdersByIntegrationName = jest
      .fn()
      .mockResolvedValue(mockedOrders);

    const result = await controller.findAllOrdersByIntegrationName(
      integrationName,
    );

    expect(pharmacyService.getPharmacies).toHaveBeenCalledWith(integrationName);
    expect(ordersService.findAllOrdersByIntegrationName).toHaveBeenCalledWith(
      integrationName,
    );
    const expectedResult: Order[] = [
      {
        healthMartId: '1691622645898',
        ...createOrderData,
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  // Test for getPharmacy
  it('should get pharmacy by integration name', async () => {
    pharmacyService.getPharmacies = jest
      .fn()
      .mockResolvedValue(mockCachePharmacyData);

    const result = await controller.getPharmacy('healthmart');

    expect(result).toEqual(mockCachePharmacyData[0]);
    expect(pharmacyService.getPharmacies).toHaveBeenCalledWith('healthmart');
  });

  it('should throw not found error if pharmacy not found', async () => {
    pharmacyService.getPharmacies = jest.fn().mockResolvedValue([]);

    await expect(controller.getPharmacy('test')).rejects.toThrow(
      NotFoundException,
    );
  });
});
