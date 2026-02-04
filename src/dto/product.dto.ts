import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { MaxLength, Min, MinLength } from "class-validator";

export interface VariantAttribDto {
  attributeId: number; // id из таблицы Attribute
  valueId: number;     // id из таблицы AttributeValue
}

export interface ProductSizeDto {
  productVariantId: number;
  size: string;
  stock: number;
}

export interface CreateProductDto {
  name: string;
  categoryId: number;
  variants: {
    price: number;
    sku: string;
    sizes: ProductSizeDto[];
    attributes: VariantAttribDto[];
    imageUrls?: string[];
  }[];
}

export class AddProductDto {
    @Min(1)
    productId: number;
    @Min(1)
    count: number;
}

export class AddProductAttribDto {
    @Min(1)
    prodId: number;
    @MinLength(1)
    @MaxLength(255)
    attribName: string;
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