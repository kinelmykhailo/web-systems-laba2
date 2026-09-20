export class Library<T extends { id: string }> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = initialItems;
  }

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return this.items;
  }

  setItems(items: T[]): void {
    this.items = items;
  }
}