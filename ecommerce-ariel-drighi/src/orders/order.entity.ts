import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderDetail } from '../order-details/order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user_id: User;

  @Column('timestamp')
  date: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order_id)
  orderDetails: OrderDetail[];
}
