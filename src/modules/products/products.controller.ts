import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Product } from 'entities/product.entity'
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'helpers/imageStorage'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import { join } from 'path'

import { CreateUpdateProductDto } from './dto/create-update-product.dto'
import { ProductsService } from './products.service'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @ApiCreatedResponse({ description: 'List all products' })
  @ApiBadRequestResponse({ description: 'Error for list of products.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.productService.paginate(page)
  }
  
  @ApiCreatedResponse({ description: 'Get product by ID.' })
  @ApiBadRequestResponse({ description: 'Error for product by ID.' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id)
  }

  @ApiCreatedResponse({ description: 'Create new product' })
  @ApiBadRequestResponse({ description: 'Error for creating new product.' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createProductDto: CreateUpdateProductDto): Promise<Product> {
    return this.productService.create(createProductDto)
  }

  @ApiCreatedResponse({ description: 'Upload image.' })
  @ApiBadRequestResponse({ description: 'Error while uploading image.' })
  @Post()
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.OK)
  async upload(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string): Promise<Product> {
    const filename = file?.filename
    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')
    const imageFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imageFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.productService.updateProductImage(productId, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateProductDto: CreateUpdateProductDto): Promise<Product> {
    return this.productService.update(id, updateProductDto)
  }

  @ApiCreatedResponse({ description: 'Delete product.' })
  @ApiBadRequestResponse({ description: 'Error for deleting product.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id)
  }
}
