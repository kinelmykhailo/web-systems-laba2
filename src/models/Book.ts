import type { IBook } from '../interfaces/IBook.js';

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false,
    public borrowedBy: string | null = null
  ) {}
}