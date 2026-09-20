import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { Library } from './services/Library.js';
import { Storage } from './services/Storage.js';
import { Book } from './models/Book.js';
import { User } from './models/User.js';
import { AppRenderer } from './components/render.js';

const savedBooks = Storage.load<Book[]>('books') ?? [];
const savedUsers = Storage.load<User[]>('users') ?? [];

const bookLibrary = new Library<Book>(
  savedBooks.map((b) => Object.assign(new Book(b.id, b.title, b.author, b.year), b)),
);
const userLibrary = new Library<User>(
  savedUsers.map((u) => Object.assign(new User(u.id, u.name, u.email), u)),
);

new AppRenderer(bookLibrary, userLibrary).render();