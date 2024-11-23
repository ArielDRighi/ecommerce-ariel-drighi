import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }

  async addCategories(categories: { name: string }[]): Promise<void> {
    const categoriesToAdd: Category[] = categories.map((category) => {
      const newCategory = new Category();
      newCategory.name = category.name;
      newCategory.products = [];
      return newCategory;
    });
    await this.categoryRepository.addCategories(categoriesToAdd);
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.categoryRepository.getCategoryById(id);
  }
}
