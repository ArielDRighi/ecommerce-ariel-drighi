import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async addProducts(products: Product[]): Promise<void> {
    try {
      await this.productsRepository.insert(products);
    } catch (error) {
      if (error.code === '23505') {
        console.error('Algunos productos ya existen');
      } else {
        throw error;
      }
    }
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    const [result] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
    });

    return result.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  }

  async findOne(id: string): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async findByName(name: string): Promise<Product | undefined> {
    return this.productsRepository.findOne({ where: { name } });
  }

  async create(product: Product): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);

    return savedProduct;
  }

  async update(id: string, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
  }

  async save(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }
}
