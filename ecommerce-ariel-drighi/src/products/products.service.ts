import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async addProducts(products: Product[]): Promise<void> {
    await this.productsRepository.addProducts(products);
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.findAll(page, limit);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByName(name: string): Promise<Product | undefined> {
    return this.productsRepository.findByName(name);
  }

  async create(createProductDto: CreateProductDto): Promise<string> {
    const category = await this.categoriesService.getCategoryById(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.stock = createProductDto.stock;
    product.imgUrl =
      createProductDto.imgUrl ||
      'https://img.freepik.com/vector-gratis/ilustracion-icono-galeria_53876-27002.jpg';
    product.category = category;

    const newProduct = await this.productsRepository.create(product);

    return newProduct.id;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.getCategoryById(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
      existingProduct.category = category;
    }

    Object.assign(existingProduct, updateProductDto);

    await this.productsRepository.update(id, existingProduct);
    return this.productsRepository.findOne(id);
  }

  async delete(id: string): Promise<string> {
    const deletedProduct = await this.productsRepository.findOne(id);
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productsRepository.delete(id);
    return deletedProduct.id;
  }

  async updateImageUrl(id: string, imgUrl: string): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    product.imgUrl = imgUrl;
    return this.productsRepository.save(product);
  }
}
