import { ApiProperty } from '@nestjs/swagger';

export class PharmacyDto {
  @ApiProperty({ type: String, required: true })
  integrationName: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  address: string;

  @ApiProperty({ type: String, required: true })
  city: string;

  @ApiProperty({ type: String, required: true })
  state: string;

  @ApiProperty({ type: String, required: true })
  zipcode: string;

  @ApiProperty({ type: String, required: true })
  country: string;

  @ApiProperty({ type: String, required: true })
  fax: string;

  @ApiProperty({ type: String, required: true })
  phone: string;
}
