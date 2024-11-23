import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async addCategories(categories: Category[]): Promise<void> {
    for (const category of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: category.name },
      });
      if (!existingCategory) {
        await this.categoryRepository.save(category);
      }
    }
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ where: { id } });
  }
}
