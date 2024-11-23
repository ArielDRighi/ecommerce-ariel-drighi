import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository, In, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { OrderDetail } from '../order-details/order-detail.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async addOrder(
    userId: string,
    productIds: string[],
  ): Promise<{ id: string; total: number; orderDetailIds: string[] }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const order = this.ordersRepository.create({
      user_id: user,
      date: new Date(),
    });
    await this.ordersRepository.save(order);

    const products = await this.productsRepository.find({
      where: { id: In(productIds), stock: MoreThan(0) },
    });

    if (products.length === 0) {
      throw new NotFoundException('Producto no encontrado o sin stock');
    }

    let total = 0;
    const orderDetails: OrderDetail[] = [];

    for (const product of products) {
      console.log(typeof product.price);
      product.stock -= 1;
      total += Number(product.price);

      const orderDetail = new OrderDetail();
      orderDetail.price = product.price;
      orderDetail.product = product;
      orderDetail.order_id = order;

      orderDetails.push(orderDetail);
    }

    await this.productsRepository.save(products);

    await this.orderDetailsRepository.save(orderDetails);

    return {
      id: order.id,
      total,
      orderDetailIds: orderDetails.map((detail) => detail.id),
    };
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.orderDetails = order.orderDetails.map((detail) => ({
      ...detail,
      price: Number(detail.price),
      product: {
        ...detail.product,
        price: Number(detail.product.price),
      },
    }));

    return order;
  }

  async getUserWithOrders(
    userId: string,
  ): Promise<{ id: string; orders: { id: string; date: Date }[] }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userWithOrders = {
      id: user.id,
      orders: user.orders.map((order) => ({
        id: order.id,
        date: order.date,
      })),
    };

    return userWithOrders;
  }




}
