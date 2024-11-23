import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
