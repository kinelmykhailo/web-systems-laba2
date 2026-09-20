import type { IUser } from '../interfaces/IUser.js';

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedBooksCount: number = 0
  ) {}
}