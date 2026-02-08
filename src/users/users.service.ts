import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  findAll() {
    throw new Error('Method not implemented.');
  }

  private readonly dbPath = path.resolve(process.cwd(), 'database.json');

  private readDB() {
    const data = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(data);
  }

  private writeDB(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const db = this.readDB();
    return db.users.find((u: User) => u.email === email);
  }

  async create(user: User): Promise<User> {
    const db = this.readDB();
    const newUser = { ...user, id: Date.now().toString() };
    db.users.push(newUser);
    this.writeDB(db);
    return newUser;
  }
}
