import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CategoriesService } from '../categories/categories.service';
import { AdminGuard } from '../auth/admin.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { Role } from 'src/users/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post('seeder')
  async seedProducts(): Promise<string> {
    const categories = await this.categoriesService.getCategories();

    const smartphoneCategory = categories.find(
      (category) => category.name === 'smartphone',
    );
    const monitorCategory = categories.find(
      (category) => category.name === 'monitor',
    );
    const keyboardCategory = categories.find(
      (category) => category.name === 'keyboard',
    );
    const mouseCategory = categories.find(
      (category) => category.name === 'mouse',
    );
    const products = [
      {
        id: undefined,
        name: 'Iphone 15',
        description: 'The best smartphone in the world',
        price: 199.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: smartphoneCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Samsung Galaxy S23',
        description: 'The best smartphone in the world',
        price: 150.0,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: smartphoneCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Motorola Edge 40',
        description: 'The best smartphone in the world',
        price: 179.89,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: smartphoneCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Samsung Odyssey G9',
        description: 'The best monitor in the world',
        price: 299.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: monitorCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'LG UltraGear',
        description: 'The best monitor in the world',
        price: 199.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: monitorCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Acer Predator',
        description: 'The best monitor in the world',
        price: 150.0,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: monitorCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Razer BlackWidow V3',
        description: 'The best keyboard in the world',
        price: 99.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: keyboardCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Corsair K70',
        description: 'The best keyboard in the world',
        price: 79.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: keyboardCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Logitech G Pro',
        description: 'The best keyboard in the world',
        price: 59.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: keyboardCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Razer Viper',
        description: 'The best mouse in the world',
        price: 49.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: mouseCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'Logitech G502 Pro',
        description: 'The best mouse in the world',
        price: 39.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: mouseCategory,
        orderDetails: [],
      },
      {
        id: undefined,
        name: 'SteelSeries Rival 3',
        description: 'The best mouse in the world',
        price: 29.99,
        stock: 12,
        imgUrl: 'default-image-url.jpg',
        category: mouseCategory,
        orderDetails: [],
      },
    ];
    await this.productsService.addProducts(products);
    return 'Products seeded successfully';
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Product[]> {
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    return this.productsService.findAll(pageNumber, limitNumber);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> | undefined {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ id: string }> {
    const existingProduct = await this.productsService.findByName(
      createProductDto.name,
    );
    if (existingProduct) {
      throw new BadRequestException('Ya existe un producto con ese nombre');
    }
    const newProductId = await this.productsService.create(createProductDto);
    return { id: newProductId };
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ id: string }> {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    return { id: updatedProduct.id };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ id: string }> {
    const deletedProductId = await this.productsService.delete(id);
    return { id: deletedProductId };
  }
}
