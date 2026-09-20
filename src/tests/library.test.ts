import { expect } from 'chai';
import { Library } from '../services/Library.js';

describe('Library Generic Class Tests', () => {
  it('should add an item to the library', () => {
    const library = new Library<{ id: string; name: string }>();
    library.addItem({ id: '1', name: 'Test Item' });
    expect(library.getAll()).to.have.lengthOf(1);
  });

  it('should remove an item by id', () => {
    const library = new Library<{ id: string; name: string }>();
    library.addItem({ id: '1', name: 'Test Item' });
    library.removeItem('1');
    expect(library.getAll()).to.have.lengthOf(0);
  });

  it('should find an item by id', () => {
    const library = new Library<{ id: string; name: string }>();
    library.addItem({ id: '1', name: 'Test Item' });
    const found = library.findById('1');
    expect(found).to.deep.equal({ id: '1', name: 'Test Item' });
  });
});