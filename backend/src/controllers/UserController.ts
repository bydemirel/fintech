import { JsonController, Post, Body, Get, Put, Param, Authorized, CurrentUser } from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() userData: any) {
    return this.userService.register(userData);
  }

  @Post('/login')
  async login(@Body() loginData: { email: string; password: string }) {
    return this.userService.login(loginData.email, loginData.password);
  }

  @Get('/profile')
  @Authorized()
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Put('/profile')
  @Authorized()
  async updateProfile(@CurrentUser({ required: true }) user: User, @Body() userData: any) {
    const { password, ...updateData } = userData;
    return this.userService.updateUser(user.id, updateData);
  }

  @Put('/change-password')
  @Authorized()
  async changePassword(
    @CurrentUser({ required: true }) user: User,
    @Body() passwordData: { currentPassword: string; newPassword: string }
  ) {
    await this.userService.updatePassword(
      user.id,
      passwordData.currentPassword,
      passwordData.newPassword
    );
    return { success: true };
  }
} 