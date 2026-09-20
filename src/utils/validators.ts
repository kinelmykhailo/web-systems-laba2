export namespace Validation {
  export function isNotEmpty(value: string): boolean {
    return value.trim() !== '';
  }

  export function isValidId(id: string): boolean {
    return /^\d+$/.test(id);
  }

  export function isValidYear(year: string): boolean {
    const yearNum = Number(year);
    return /^\d{4}$/.test(year) && yearNum > 1000 && yearNum <= new Date().getFullYear();
  }
}