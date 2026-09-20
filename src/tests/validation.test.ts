import { expect } from 'chai';
import { Validation } from '../utils/validators.js';

describe('Validation Namespace Tests', () => {
  it('should validate non-empty strings', () => {
    expect(Validation.isNotEmpty('Hello')).to.be.true;
    expect(Validation.isNotEmpty('   ')).to.be.false;
  });

  it('should validate numeric IDs', () => {
    expect(Validation.isValidId('12345')).to.be.true;
    expect(Validation.isValidId('123a5')).to.be.false;
  });

  it('should validate publication years', () => {
    expect(Validation.isValidYear('2004')).to.be.true;
    expect(Validation.isValidYear('999')).to.be.false;
    expect(Validation.isValidYear('2050')).to.be.false;
  });
});