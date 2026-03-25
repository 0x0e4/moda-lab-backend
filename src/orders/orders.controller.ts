import { Controller, Post, Body, Get, UseGuards, Query, Param, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

}