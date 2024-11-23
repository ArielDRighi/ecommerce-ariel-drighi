import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addOrder(
    @Body() body: CreateOrderDto,
  ): Promise<{ id: string; total: number; orderDetailIds: string[] }> {
    try {
      const productIds = body.products.map((product) => product.id);
      return this.ordersService.addOrder(body.userId, productIds);
    } catch (e) {
      throw new BadRequestException('Error creando Orden');
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', new ParseUUIDPipe()) id: string): Promise<Order> {
    const order = await this.ordersService.getOrder(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Get('user/:id')
  async getUserWithOrders(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ id: string; orders: { id: string; date: Date }[] }> {
    const userWithOrders = await this.ordersService.getUserWithOrders(id);
    if (!userWithOrders) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return userWithOrders;
  }
}
