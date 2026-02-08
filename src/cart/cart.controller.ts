import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  add(@Req() req, @Body() pokemon: any) {
    return this.cartService.addToCart(req.user.sub, pokemon);
  }

  @UseGuards(JwtAuthGuard)
  @Post('decrease')
  decrease(@Req() req, @Body() body: { id: number }) {
    return this.cartService.decreaseQuantity(req.user.sub, body.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('increase/:id')
  increase(@Req() req, @Param('id') id: string) {
    return this.cartService.increaseQuantity(req.user.sub, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.sub, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Req() req) {
    return this.cartService.checkout(req.user.sub);
  }
}
