import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, Min, MinLength } from "class-validator";

export class VariantAttribDto {
  @ApiProperty()
  attributeId: number;
  @ApiProperty()
  valueId: number;
}

export class ProductSizeDto {
  @ApiProperty()
  productVariantId: number;
  @ApiProperty()
  size: number;
  @ApiProperty()
  stock: number;
}

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  variants: {
    price: number;
    sku: string;
    sizes: ProductSizeDto[];
    attributes: VariantAttribDto[];
    imageUrls?: string[];
  }[];
}

export class AddProductDto {
  @ApiProperty()
  @Min(1)
  productId: number;
  @ApiProperty()
  @Min(1)
  count: number;
}

export class AddProductAttribDto {
  @ApiProperty()
  @Min(1)
  prodId: number;
  @ApiProperty()
  @MinLength(1)
  @MaxLength(255)
  attribName: string;
  @ApiProperty()
  @MinLength(1)
  @MaxLength(255)
  attribValue: string;
}

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
}