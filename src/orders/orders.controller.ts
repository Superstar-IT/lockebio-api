import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isNotEmptyObject } from 'class-validator';

import { getFromDto } from '../core/utils/repository.utils';
import { generateRandomId } from '../core/utils/string.utils';
import { PharmacyDto } from '../pharmacy/dto/pharmacy.dto';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './dto/order-response.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pharmacyService: PharmacyService,
  ) {}

  @ApiOkResponse({ type: Order })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Post(':integrationName/orders')
  async createOrder(
    @Param('integrationName') integrationName: string,
    @Body()
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    if (!isNotEmptyObject(createOrderDto))
      throw new BadRequestException(`Order payload required`);

    const pharmacy = await this.getPharmacy(integrationName);

    const newOrder: OrderEntity = {
      id: generateRandomId(13),
      integrationName: pharmacy.integrationName,
      product:
        createOrderDto.healthMartProduct ||
        createOrderDto.carePlusProduct ||
        createOrderDto.quickCareProduct,
      quantity:
        createOrderDto.healthMartQuantity ||
        createOrderDto.carePlusQuantity ||
        createOrderDto.quickCareQuantity,
      customerInfo: {
        name:
          createOrderDto.healthMartCustomerInfo.healthMartCustName ||
          createOrderDto.carePlusClientInfo.carePlusClientName ||
          createOrderDto.quickCareUserData.quickCareUserName,

        address:
          createOrderDto.healthMartCustomerInfo.healthMartCustAddress ||
          createOrderDto.carePlusClientInfo.carePlusClientAddress ||
          createOrderDto.quickCareUserData.quickCareUserAddress,

        city:
          createOrderDto.healthMartCustomerInfo.healthMartCustCity ||
          createOrderDto.carePlusClientInfo.carePlusClientCity ||
          createOrderDto.quickCareUserData.quickCareUserCity,

        state:
          createOrderDto.healthMartCustomerInfo.healthMartCustState ||
          createOrderDto.carePlusClientInfo.carePlusClientState ||
          createOrderDto.quickCareUserData.quickCareUserState,

        zipCode:
          createOrderDto.healthMartCustomerInfo.healthMartCustZipcode ||
          createOrderDto.carePlusClientInfo.carePlusClientZipcode ||
          createOrderDto.quickCareUserData.quickCareUserZipcode,
        country:
          createOrderDto.healthMartCustomerInfo.healthMartCustCountry ||
          createOrderDto.carePlusClientInfo.carePlusClientCountry ||
          createOrderDto.quickCareUserData.quickCareUserCountry,
      },
    };

    return await this.ordersService.createOrder(newOrder).then((res) => {
      const order = getFromDto<Order>(createOrderDto, new Order());
      if (integrationName === 'healthmart') {
        order.healthMartId = res.id;
      } else if (integrationName === 'careplus') {
        order.carePlusId = res.id;
      } else if (integrationName === 'quickcare') {
        order.quickCareId = res.id;
      }
      return order;
    });
  }

  @ApiOkResponse({ type: Order, isArray: true })
  @ApiOkResponse({ type: NotFoundException })
  @Get(':integrationName/orders')
  async findAllOrdersByIntegrationName(
    @Param('integrationName') integrationName: string,
  ): Promise<Order[]> {
    const pharmacy = await this.getPharmacy(integrationName);
    const orders = await this.ordersService.findAllOrdersByIntegrationName(
      pharmacy.integrationName,
    );

    return orders.map((order) => {
      const result = new Order();
      if (integrationName === 'healthmart') {
        result.healthMartId = order.id;
        result.healthMartProduct = order.product;
        result.healthMartQuantity = order.quantity;
        result.healthMartCustomerInfo = {
          healthMartCustName: order.customerInfo.name,
          healthMartCustAddress: order.customerInfo.address,
          healthMartCustCity: order.customerInfo.city,
          healthMartCustState: order.customerInfo.state,
          healthMartCustZipcode: order.customerInfo.zipCode,
          healthMartCustCountry: order.customerInfo.country,
        };
        return result;
      }
      if (integrationName === 'quickcare') {
        result.quickCareId = order.id;
        result.quickCareProduct = order.product;
        result.quickCareQuantity = order.quantity;
        result.quickCareUserData = {
          quickCareUserName: order.customerInfo.name,
          quickCareUserAddress: order.customerInfo.address,
          quickCareUserCity: order.customerInfo.city,
          quickCareUserState: order.customerInfo.state,
          quickCareUserZipcode: order.customerInfo.zipCode,
          quickCareUserCountry: order.customerInfo.country,
        };
        return result;
      }
      if (integrationName === 'careplus') {
        result.carePlusId = order.id;
        result.carePlusProduct = order.product;
        result.carePlusQuantity = order.quantity;
        result.carePlusClientInfo = {
          carePlusClientName: order.customerInfo.name,
          carePlusClientAddress: order.customerInfo.address,
          carePlusClientCity: order.customerInfo.city,
          carePlusClientState: order.customerInfo.state,
          carePlusClientZipcode: order.customerInfo.zipCode,
          carePlusClientCountry: order.customerInfo.country,
        };
        return result;
      }
    });
  }

  @ApiOkResponse({ type: Order })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get(':integrationName/orders/:id')
  async findOneOrder(
    @Param('id') id: string,
    @Param('integrationName') integrationName: string,
  ): Promise<Order> {
    const pharmacy = await this.getPharmacy(integrationName);
    const order = await this.ordersService.findOneOrder(
      pharmacy.integrationName,
      id,
    );
    if (!order) throw new NotFoundException(`Order not found`);

    const result = new Order();

    if (integrationName === 'healthmart') {
      result.healthMartId = order.id;
      result.healthMartProduct = order.product;
      result.healthMartQuantity = order.quantity;
      result.healthMartCustomerInfo = {
        healthMartCustName: order.customerInfo.name,
        healthMartCustAddress: order.customerInfo.address,
        healthMartCustCity: order.customerInfo.city,
        healthMartCustState: order.customerInfo.state,
        healthMartCustZipcode: order.customerInfo.zipCode,
        healthMartCustCountry: order.customerInfo.country,
      };
      return result;
    }
    if (integrationName === 'quickcare') {
      result.quickCareId = order.id;
      result.quickCareProduct = order.product;
      result.quickCareQuantity = order.quantity;
      result.quickCareUserData = {
        quickCareUserName: order.customerInfo.name,
        quickCareUserAddress: order.customerInfo.address,
        quickCareUserCity: order.customerInfo.city,
        quickCareUserState: order.customerInfo.state,
        quickCareUserZipcode: order.customerInfo.zipCode,
        quickCareUserCountry: order.customerInfo.country,
      };
      return result;
    }
    if (integrationName === 'careplus') {
      result.carePlusId = order.id;
      result.carePlusProduct = order.product;
      result.carePlusQuantity = order.quantity;
      result.carePlusClientInfo = {
        carePlusClientName: order.customerInfo.name,
        carePlusClientAddress: order.customerInfo.address,
        carePlusClientCity: order.customerInfo.city,
        carePlusClientState: order.customerInfo.state,
        carePlusClientZipcode: order.customerInfo.zipCode,
        carePlusClientCountry: order.customerInfo.country,
      };
      return result;
    }
  }

  async getPharmacy(integrationName: string): Promise<PharmacyDto> {
    const [pharmacy] = await this.pharmacyService.getPharmacies(
      integrationName,
    );
    if (!pharmacy)
      throw new NotFoundException(
        `Pharmacy not found for integrationName: ${integrationName}`,
      );

    return pharmacy;
  }
}
