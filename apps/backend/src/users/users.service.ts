/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, OnModuleInit } from '@nestjs/common';

import { User } from './users.model';
import * as bcrypt from 'bcrypt';

import { MOCK_USERS } from './mock/users.mock';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];
  private currentId = 1;

  async onModuleInit() {
    await this.initMockUser();
  }

  private async initMockUser() {
    for (const mockUser of MOCK_USERS) {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);

      this.users.push({
        id: this.currentId++,
        email: mockUser.email,
        password: hashedPassword,
        name: mockUser.name,
      });
    }
  }

  async create(email: string, password: string, name: string): Promise<User> {
    const user: User = {
      id: this.currentId++,
      email,
      password,
      name,
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async getUsersDictionary(): Promise<
    Record<number, { id: number; name: string }>
  > {
    return this.users.reduce(
      (acc, user) => {
        acc[user.id] = {
          id: user.id,
          name: user.name,
        };
        return acc;
      },
      {} as Record<number, { id: number; name: string }>,
    );
  }
}
