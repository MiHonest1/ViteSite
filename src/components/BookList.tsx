import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

export function filterBooks(books: Book[], inputWord: string): Book[] {
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(inputWord.toLowerCase()) ||
      book.author.toLowerCase().includes(inputWord.toLowerCase()),
  );
}

export function paginate(
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void,
) {
  if (currentPage < 1) {
    setCurrentPage(1);
  } else if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  } else {
    setCurrentPage(currentPage);
  }
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [inputWord, setInputWord] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=javascript+book&startIndex=0&maxResults=40`,
        );
        const data = await response.json();
        console.log(data);
        const fetchedBooks = data.items.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || 'Unknown',
          cover: item.volumeInfo.imageLinks?.thumbnail || '',
        }));
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Ошибка получения книг:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = filterBooks(books, inputWord);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="bookListContainer">
      <h1 className="title">Книги по JavaScript</h1>

      <input
        className="textFieldInput"
        type="text"
        value={inputWord}
        onChange={(e) => {
          setInputWord(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Найти по названию или автору"
      />

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <ul className="bookGrid">
            {currentBooks.map((book) => (
              <li key={book.id} className="bookItem">
                <div className="bookCover">
                  <Link to={`/book/${book.id}`}>
                    <img src={book.cover} alt={book.title} />
                  </Link>
                </div>
                <div className="bookInfo">
                  <p>Авторы: {book.author}</p>
                  <Link to={`/book/${book.id}`}>
                    <h3>{book.title}</h3>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <button
              onClick={() =>
                paginate(currentPage - 1, totalPages, setCurrentPage)
              }
              disabled={currentPage === 1}
            >
              {'⇦'}
            </button>

            <button
              onClick={() =>
                paginate(currentPage + 1, totalPages, setCurrentPage)
              }
              disabled={currentPage === totalPages}
            >
              {'⇨'}
            </button>
            <p className="pageCount">
              Страница {currentPage} из {totalPages}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
