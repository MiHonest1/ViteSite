import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
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

  const filteredBooks: Book[] = books.filter(
    (book) =>
      book.title.toLowerCase().includes(inputWord.toLowerCase()) ||
      book.author.toLowerCase().includes(inputWord.toLowerCase()),
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container book-list-container">
      <h1>JavaScript книжки</h1>

      <input
        className="text-field__input"
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
          <ul className="book-grid">
            {currentBooks.map((book) => (
              <li key={book.id} className="book-item">
                <div>
                  <img src={book.cover} alt={book.title} />
                  <p>Авторы: {book.author}</p>
                </div>
                <Link to={`/book/${book.id}`}>
                  <h3>{book.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Назад
            </button>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Вперед
            </button>
            <p>
              Страница {currentPage} из {totalPages}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
