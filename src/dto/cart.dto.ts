import { ApiProperty } from "@nestjs/swagger";


export class AddCartItemDto {
    @ApiProperty()
    variantId: number;
    @ApiProperty()
    sizeId: number | null;
    @ApiProperty()
    quantity: number;
}

export class UpdateCartItemDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    quantity: number;
}