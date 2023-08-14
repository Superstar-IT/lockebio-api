import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

import {
  CarePlusOrderPayload,
  HealthMartOrderPayload,
  QuickCareOrderPayload,
} from './create-order.dto';
import { IsNotEmpty } from 'class-validator';

export class HealthMartOrder extends HealthMartOrderPayload {
  @ApiProperty({ type: String, required: true, readOnly: true })
  @IsNotEmpty()
  healthMartId: string;
}

export class CarePlusOrder extends CarePlusOrderPayload {
  @ApiProperty({ type: String, required: true, readOnly: true })
  @IsNotEmpty()
  carePlusId: string;
}

export class QuickCareOrder extends QuickCareOrderPayload {
  @ApiProperty({ type: String, required: true, readOnly: true })
  @IsNotEmpty()
  quickCareId: string;
}

export class UnionOrder extends IntersectionType(
  HealthMartOrder,
  CarePlusOrder,
  QuickCareOrder,
) {}

export class Order extends PartialType(UnionOrder) {}

// 1692005683088
