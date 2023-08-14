import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { getValidateOptions } from '../../core/validators/validation';

export class HealthMartCustomerInfo {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Customer Name required'))
  @IsString()
  healthMartCustName: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Address required'))
  @IsString()
  healthMartCustAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('City required'))
  @IsString()
  healthMartCustCity: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('State required'))
  @IsString()
  healthMartCustState: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Zipcode required'))
  @IsString()
  healthMartCustZipcode: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Country required'))
  @IsString()
  healthMartCustCountry: string;
}

export class HealthMartOrderPayload {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Product required'))
  @IsString()
  healthMartProduct: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty(getValidateOptions('Quantity required'))
  @IsNumber(undefined, getValidateOptions(`Invalid quantity`))
  @Min(0, getValidateOptions(`Invalid quantity value`))
  healthMartQuantity: number;

  @ApiProperty({ type: HealthMartCustomerInfo, required: true })
  @IsNotEmpty(getValidateOptions(`healthMartCustomerInfo required`))
  @ValidateNested({ each: true, always: true })
  @Type(() => HealthMartCustomerInfo)
  healthMartCustomerInfo: HealthMartCustomerInfo;
}

export class CarePlusClientInfo {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Client Name required'))
  @IsString()
  carePlusClientName: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Address required'))
  @IsString()
  carePlusClientAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('City required'))
  @IsString()
  carePlusClientCity: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('State required'))
  @IsString()
  carePlusClientState: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Zipcode required'))
  @IsString()
  carePlusClientZipcode: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Country required'))
  @IsString()
  carePlusClientCountry: string;
}

export class CarePlusOrderPayload {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Product required'))
  @IsString()
  carePlusProduct: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty(getValidateOptions('Quantity required'))
  @IsNumber(undefined, getValidateOptions(`Invalid quantity`))
  @Min(0, getValidateOptions(`Invalid quantity value`))
  carePlusQuantity: number;

  @ApiProperty({ type: CarePlusClientInfo, required: true })
  @IsNotEmpty(getValidateOptions(`carePlusClientInfo required`))
  @ValidateNested({ each: true, always: true })
  @Type(() => CarePlusClientInfo)
  carePlusClientInfo: CarePlusClientInfo;
}

export class QuickCareUserData {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('User Name required'))
  @IsString()
  quickCareUserName: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Address required'))
  @IsString()
  quickCareUserAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('City required'))
  @IsString()
  quickCareUserCity: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('State required'))
  @IsString()
  quickCareUserState: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Zipcode required'))
  @IsString()
  quickCareUserZipcode: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Country required'))
  @IsString()
  quickCareUserCountry: string;
}

export class QuickCareOrderPayload {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty(getValidateOptions('Product required'))
  @IsString()
  quickCareProduct: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty(getValidateOptions('Quantity required'))
  @IsNumber(undefined, getValidateOptions(`Invalid quantity`))
  @Min(0, getValidateOptions(`Invalid quantity value`))
  quickCareQuantity: number;

  @ApiProperty({ type: QuickCareUserData, required: true })
  @IsNotEmpty(getValidateOptions(`quickCareUserData required`))
  @ValidateNested({ each: true, always: true })
  @Type(() => QuickCareUserData)
  quickCareUserData: QuickCareUserData;
}

export class OrderDto extends IntersectionType(
  HealthMartOrderPayload,
  QuickCareOrderPayload,
  CarePlusOrderPayload,
) {}

export class CreateOrderDto extends PartialType(OrderDto) {}
