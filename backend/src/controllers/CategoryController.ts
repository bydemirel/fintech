import { JsonController, Get, Post, Put, Delete, Body, Param, QueryParam, Authorized, CurrentUser } from 'routing-controllers';
import { Service } from 'typedi';
import { CategoryService } from '../services/CategoryService';
import { User } from '../entities/User';
import { Category } from '../entities/Category';

@JsonController('/categories')
@Service()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Authorized()
  async getCategories(
    @CurrentUser({ required: true }) user: User,
    @QueryParam('type') type?: 'income' | 'expense'
  ) {
    if (type) {
      return this.categoryService.findByUserIdAndType(user.id, type);
    }
    return this.categoryService.findByUserId(user.id);
  }

  @Post()
  @Authorized()
  async createCategory(
    @CurrentUser({ required: true }) user: User,
    @Body() categoryData: Partial<Category>
  ) {
    // Kullanıcı ID'sini ekle
    categoryData.userId = user.id;
    return this.categoryService.createCategory(categoryData);
  }

  @Put('/:id')
  @Authorized()
  async updateCategory(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number,
    @Body() categoryData: Partial<Category>
  ) {
    return this.categoryService.updateCategory(id, user.id, categoryData);
  }

  @Delete('/:id')
  @Authorized()
  async deleteCategory(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number
  ) {
    await this.categoryService.deleteCategory(id, user.id);
    return { success: true };
  }
} 