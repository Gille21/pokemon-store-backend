import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CartService {
  private readonly dbPath = path.resolve(process.cwd(), 'database.json');

  private readDB() {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
  }

  private writeDB(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }


  private calculateTotal(items: any[]): number {
    return items.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 0),
      0,
    );
  }

  async getCart(userId: string) {
    const db = this.readDB();
    const cart = db.carts.find((c) => c.userId === userId);
    return cart || { userId, items: [], total: 0 };
  }

  async addToCart(userId: string, pokemonData: any) {
    const db = this.readDB();
    let userCart = db.carts.find((c) => c.userId === userId);

    if (!userCart) {
      userCart = { userId, items: [], total: 0 };
      db.carts.push(userCart);
    }


    const pId = Number(pokemonData.id || pokemonData.pokemonId);
    const existing = userCart.items.find((i) => Number(i.id) === pId);

    if (existing) {
      existing.quantity += 1;
    } else {

      userCart.items.push({
        ...pokemonData,
        id: pId,
        quantity: 1,
      });
    }


    userCart.total = this.calculateTotal(userCart.items);

    this.writeDB(db);
    return userCart;
  }

  async removeFromCart(userId: string, pokemonId: number) {
    const db = this.readDB();
    const cart = db.carts.find((c) => c.userId === userId);

    if (!cart) throw new NotFoundException('Carrito no encontrado');


    cart.items = cart.items.filter((i) => i.id !== pokemonId);


    cart.total = this.calculateTotal(cart.items);

    this.writeDB(db);
    return cart;
  }

  async increaseQuantity(userId: string, pokemonId: number) {
    const db = this.readDB();
    const cart = db.carts.find((c) => c.userId === userId);
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    const item = cart.items.find((i) => i.id === pokemonId);
    if (!item) throw new NotFoundException('Pokémon no encontrado');

    item.quantity += 1;
    cart.total = this.calculateTotal(cart.items);

    this.writeDB(db);
    return cart;
  }

  async decreaseQuantity(userId: string, pokemonId: number) {
    const db = this.readDB();
    const cart = db.carts.find((c) => c.userId === userId);
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    const item = cart.items.find((i) => i.id === pokemonId);
    if (!item) throw new NotFoundException('Pokémon no encontrado');

    item.quantity -= 1;


    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== pokemonId);
    }

    cart.total = this.calculateTotal(cart.items);
    this.writeDB(db);
    return cart;
  }

  async checkout(userId: string) {
    const db = this.readDB();
    const cart = db.carts.find((c) => c.userId === userId);

    if (!cart || cart.items.length === 0)
      throw new NotFoundException('Carrito vacío');

    const total = this.calculateTotal(cart.items);

    const order = {
      id: Date.now().toString(),
      userId,
      items: cart.items,
      total,
      createdAt: new Date().toISOString(),
    };

    if (!db.orders) db.orders = [];
    db.orders.push(order);


    cart.items = [];
    cart.total = 0;

    this.writeDB(db);
    return order;
  }
}
