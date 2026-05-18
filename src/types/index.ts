export interface User {
  id: number;
  email: string;
  role: 'admin' | 'librarian';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  genreId: number;
  genre?: Genre;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
}

export interface Borrow {
  id: number;
  bookId: number;
  memberId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  book?: Book;
  member?: Member;
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Staff {
  id: number;
  email: string;
  role: 'admin' | 'librarian';
  createdAt: string;
}

export interface Statistics {
  totalBooks: number;
  totalMembers: number;
  activeBorrows: number;
  overdueBooks: number;
}