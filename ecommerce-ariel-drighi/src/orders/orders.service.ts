import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(
    userId: string,
    productIds: string[],
  ): Promise<{ id: string; total: number; orderDetailIds: string[] }> {
    return this.ordersRepository.addOrder(userId, productIds);
  }

  async getOrder(id: string): Promise<Order> {
    return this.ordersRepository.getOrder(id);
  }

  async getUserWithOrders(
    userId: string,
  ): Promise<{ id: string; orders: { id: string; date: Date }[] }> {
    return this.ordersRepository.getUserWithOrders(userId);
  }
}
