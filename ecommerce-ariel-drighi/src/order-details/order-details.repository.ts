import { Injectable } from '@nestjs/common';
import { OrderDetail } from './order-detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderDetailsRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async createOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
    return this.orderDetailsRepository.save(orderDetail);
  }
}
