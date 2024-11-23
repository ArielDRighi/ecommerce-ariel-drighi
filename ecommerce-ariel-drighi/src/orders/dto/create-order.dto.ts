import { IsNotEmpty, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
