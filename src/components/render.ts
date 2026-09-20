import { Library } from '../services/Library.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { Validation } from '../utils/validators.js';
import { NotificationService } from '../services/NotificationService.js';
import { Storage } from '../services/Storage.js';

const REQUIRED_MSG = "Це поле є обов'язковим";

export class AppRenderer {
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;
  private appContainer: HTMLElement;

  private bookPage: number = 1;
  private userPage: number = 1;
  private itemsPerPage: number = 5;
  private bookSearch: string = '';

  constructor(bookLibrary: Library<Book>, userLibrary: Library<User>) {
    this.bookLibrary = bookLibrary;
    this.userLibrary = userLibrary;
    this.appContainer = document.getElementById('app')!;
  }

  render(): void {
    this.appContainer.innerHTML = '';

    // Головний контейнер
    const container = document.createElement('div');
    container.className = 'container mt-4';

    // Заголовок
    const h1 = document.createElement('h1');
    h1.className = 'text-center mb-4';
    h1.innerText = 'Система Управління Бібліотекою';
    container.appendChild(h1);

    // Створення секцій
    container.appendChild(this.createBookFormSection());
    container.appendChild(this.createUserFormSection());
    container.appendChild(this.createBookListSection());
    container.appendChild(this.createUserListSection());

    this.appContainer.appendChild(container);
  }

  private createBookFormSection(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card p-3 mb-4';

    const h3 = document.createElement('h3');
    h3.innerText = 'Додати Книгу';
    card.appendChild(h3);

    const titleInput = document.createElement('input');
    titleInput.className = 'form-control mb-2';
    titleInput.placeholder = 'Назва книги';

    const titleError = document.createElement('div');
    titleError.className = 'text-danger small mb-2';

    const authorInput = document.createElement('input');
    authorInput.className = 'form-control mb-2';
    authorInput.placeholder = 'Автор';

    const authorError = document.createElement('div');
    authorError.className = 'text-danger small mb-2';

    const yearInput = document.createElement('input');
    yearInput.className = 'form-control mb-2';
    yearInput.placeholder = 'Рік видання';

    const yearError = document.createElement('div');
    yearError.className = 'text-danger small mb-2';

    const btn = document.createElement('button');
    btn.className = 'btn btn-success';
    btn.innerText = 'Додати Книгу';

    btn.onclick = () => {
      let isValid = true;
      titleError.innerText = '';
      authorError.innerText = '';
      yearError.innerText = '';

      if (!Validation.isNotEmpty(titleInput.value)) {
        titleError.innerText = REQUIRED_MSG;
        isValid = false;
      }
      if (!Validation.isNotEmpty(authorInput.value)) {
        authorError.innerText = REQUIRED_MSG;
        isValid = false;
      }
      if (!Validation.isNotEmpty(yearInput.value)) {
        yearError.innerText = REQUIRED_MSG;
        isValid = false;
      } else if (!Validation.isValidYear(yearInput.value)) {
        yearError.innerText = 'Введіть коректний рік (4 цифри)';
        isValid = false;
      }

      if (isValid) {
        const newBook = new Book(
          Date.now().toString(),
          titleInput.value.trim(),
          authorInput.value.trim(),
          Number(yearInput.value),
        );
        this.bookLibrary.addItem(newBook);
        Storage.save('books', this.bookLibrary.getAll());
        this.render();
      }
    };

    card.appendChild(titleInput);
    card.appendChild(titleError);
    card.appendChild(authorInput);
    card.appendChild(authorError);
    card.appendChild(yearInput);
    card.appendChild(yearError);
    card.appendChild(btn);

    return card;
  }

  private createUserFormSection(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card p-3 mb-4';

    const h3 = document.createElement('h3');
    h3.innerText = 'Додати Користувача';
    card.appendChild(h3);

    const nameInput = document.createElement('input');
    nameInput.className = 'form-control mb-2';
    nameInput.placeholder = "Ім'я";

    const nameError = document.createElement('div');
    nameError.className = 'text-danger small mb-2';

    const emailInput = document.createElement('input');
    emailInput.className = 'form-control mb-2';
    emailInput.placeholder = 'Email';

    const emailError = document.createElement('div');
    emailError.className = 'text-danger small mb-2';

    const btn = document.createElement('button');
    btn.className = 'btn btn-success';
    btn.innerText = 'Додати Користувача';

    btn.onclick = () => {
      let isValid = true;
      nameError.innerText = '';
      emailError.innerText = '';

      if (!Validation.isNotEmpty(nameInput.value)) {
        nameError.innerText = REQUIRED_MSG;
        isValid = false;
      }
      if (!Validation.isNotEmpty(emailInput.value)) {
        emailError.innerText = REQUIRED_MSG;
        isValid = false;
      }

      if (isValid) {
        const newUser = new User(
          Date.now().toString(),
          nameInput.value.trim(),
          emailInput.value.trim(),
        );
        this.userLibrary.addItem(newUser);
        Storage.save('users', this.userLibrary.getAll());
        this.render();
      }
    };

    card.appendChild(nameInput);
    card.appendChild(nameError);
    card.appendChild(emailInput);
    card.appendChild(emailError);
    card.appendChild(btn);

    return card;
  }

  private createBookListSection(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card p-3 mb-4';

    const h3 = document.createElement('h3');
    h3.innerText = 'Список Книг';
    card.appendChild(h3);

    // Пошук
    const searchInput = document.createElement('input');
    searchInput.className = 'form-control mb-3';
    searchInput.placeholder = 'Пошук за назвою або автором...';
    searchInput.value = this.bookSearch;
    searchInput.dataset.search = 'true';
    searchInput.oninput = () => {
      this.bookSearch = searchInput.value;
      this.bookPage = 1;
      this.render();

      // після перерендеру повертаємо фокус у поле пошуку
      const el = this.appContainer.querySelector<HTMLInputElement>('input[data-search]');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    };
    card.appendChild(searchInput);

    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group mb-3';

    const query = this.bookSearch.trim().toLowerCase();
    const filteredBooks = this.bookLibrary
      .getAll()
      .filter(
        (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query),
      );

    // Пагінація
    const totalPages = Math.ceil(filteredBooks.length / this.itemsPerPage) || 1;
    if (this.bookPage > totalPages) this.bookPage = totalPages;

    const paginatedBooks = filteredBooks.slice(
      (this.bookPage - 1) * this.itemsPerPage,
      this.bookPage * this.itemsPerPage,
    );

    if (paginatedBooks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'list-group-item text-muted';
      empty.innerText = 'Книг не знайдено';
      listGroup.appendChild(empty);
    }

    paginatedBooks.forEach((book) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const span = document.createElement('span');
      span.innerText = `${book.title} by ${book.author} (${book.year})`;
      li.appendChild(span);

      const btnGroup = document.createElement('div');

      if (!book.isBorrowed) {
        const borrowBtn = document.createElement('button');
        borrowBtn.className = 'btn btn-primary btn-sm me-2';
        borrowBtn.innerText = 'Позичити';
        borrowBtn.onclick = () => {
          NotificationService.showPrompt(
            'Введіть ID користувача для позичення книги:',
            (userId) => {
              if (!Validation.isNotEmpty(userId)) {
                NotificationService.showModal('Помилка', "Це поле є обов'язковим!");
                return;
              }
              if (!/^\d+$/.test(userId)) {
                NotificationService.showModal('Помилка', 'ID користувача має містити лише цифри!');
                return;
              }

              const user = this.userLibrary.findById(userId);
              if (!user) {
                NotificationService.showModal('Помилка', 'Користувача з таким ID не знайдено!');
                return;
              }
              if (user.borrowedBooksCount >= 3) {
                NotificationService.showModal(
                  'Ліміт вичерпано',
                  'Користувач не може позичити більше 3-х книг!',
                );
                return;
              }

              book.isBorrowed = true;
              book.borrowedBy = user.id;
              user.borrowedBooksCount += 1;

              Storage.save('books', this.bookLibrary.getAll());
              Storage.save('users', this.userLibrary.getAll());

              NotificationService.showModal(
                'Успіх',
                `${book.title} has been borrowed by ${user.id} ${user.name} (${user.email}).`,
                () => {
                  this.render();
                },
              );
            },
          );
        };
        btnGroup.appendChild(borrowBtn);
      } else {
        const returnBtn = document.createElement('button');
        returnBtn.className = 'btn btn-warning btn-sm me-2';
        returnBtn.innerText = 'Повернути';
        returnBtn.onclick = () => {
          const user = this.userLibrary.findById(book.borrowedBy!);
          if (user) {
            user.borrowedBooksCount = Math.max(0, user.borrowedBooksCount - 1);
          }
          book.isBorrowed = false;
          book.borrowedBy = null;

          Storage.save('books', this.bookLibrary.getAll());
          Storage.save('users', this.userLibrary.getAll());

          NotificationService.showModal('Повернення', `${book.title} has been returned.`, () => {
            this.render();
          });
        };
        btnGroup.appendChild(returnBtn);
      }

      // Видалення книги
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.innerText = 'Видалити';
      deleteBtn.onclick = () => {
        // якщо книга була позичена — звільняємо слот у користувача
        if (book.isBorrowed && book.borrowedBy) {
          const holder = this.userLibrary.findById(book.borrowedBy);
          if (holder) {
            holder.borrowedBooksCount = Math.max(0, holder.borrowedBooksCount - 1);
            Storage.save('users', this.userLibrary.getAll());
          }
        }
        this.bookLibrary.removeItem(book.id);
        Storage.save('books', this.bookLibrary.getAll());
        this.render();
      };
      btnGroup.appendChild(deleteBtn);

      li.appendChild(btnGroup);
      listGroup.appendChild(li);
    });

    card.appendChild(listGroup);

    // Пагінація UI
    const pagination = this.createPagination(totalPages, this.bookPage, (page) => {
      this.bookPage = page;
      this.render();
    });
    card.appendChild(pagination);

    return card;
  }

  private createUserListSection(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card p-3 mb-4';

    const h3 = document.createElement('h3');
    h3.innerText = 'Список Користувачів';
    card.appendChild(h3);

    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group mb-3';

    const users = this.userLibrary.getAll();
    const totalPages = Math.ceil(users.length / this.itemsPerPage) || 1;
    if (this.userPage > totalPages) this.userPage = totalPages;

    const paginatedUsers = users.slice(
      (this.userPage - 1) * this.itemsPerPage,
      this.userPage * this.itemsPerPage,
    );

    if (paginatedUsers.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'list-group-item text-muted';
      empty.innerText = 'Користувачів немає';
      listGroup.appendChild(empty);
    }

    paginatedUsers.forEach((user) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const span = document.createElement('span');
      span.innerText = `${user.id} ${user.name} (${user.email}) [Книг: ${user.borrowedBooksCount}]`;
      li.appendChild(span);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.innerText = 'Видалити';
      deleteBtn.onclick = () => {
        this.userLibrary.removeItem(user.id);
        Storage.save('users', this.userLibrary.getAll());
        this.render();
      };
      li.appendChild(deleteBtn);

      listGroup.appendChild(li);
    });

    card.appendChild(listGroup);

    const pagination = this.createPagination(totalPages, this.userPage, (page) => {
      this.userPage = page;
      this.render();
    });
    card.appendChild(pagination);

    return card;
  }

  private createPagination(
    totalPages: number,
    currentPage: number,
    onPageChange: (p: number) => void,
  ): HTMLElement {
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;

      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.innerText = i.toString();
      a.onclick = (e) => {
        e.preventDefault();
        onPageChange(i);
      };

      li.appendChild(a);
      ul.appendChild(li);
    }

    nav.appendChild(ul);
    return nav;
  }
}