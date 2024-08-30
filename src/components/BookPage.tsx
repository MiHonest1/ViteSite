import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import styles from './BookPage.module.css';

interface BookDetails {
  title: string;
  authors: string[];
  description: string;
  publishedDate: string;
  averageRating: number;
  pageCount: number;
  imageLinks: {
    thumbnail: string;
  };
}

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDetails>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`,
        );
        const data = await response.json();
        setBook(data.volumeInfo);
      } catch (error) {
        console.error('Ошибка получения данных книги:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!book) {
    return <div className={styles.error}>Книга не найдена</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.Link}>
        <Link to="/" className={styles.backLinkWrapper}>
          <button className={styles.backLinkButton}>Назад к списку</button>
        </Link>
      </div>
      <div className={styles.bookDetails}>
        <div className={styles.bookImageContainer}>
          {book.imageLinks?.thumbnail && (
            <img
              className={styles.bookImage}
              src={book.imageLinks.thumbnail}
              alt={book.title}
            />
          )}
        </div>
        <div className={styles.bookInfoContainer}>
          <h1 className={styles.bookTitle}>{book.title}</h1>
          <p className={styles.bookInfo}>
            Авторы: {book.authors?.join(', ') || 'Неизвестны'}
          </p>
          <p className={styles.bookInfo}>
            Релиз: {book.publishedDate || 'Дата не указана'}
          </p>
          <p className={styles.bookInfo}>
            Страниц: {book.pageCount || 'Не указано'}
          </p>
          <p className={styles.bookInfo}>
            Рейтинг: {book.averageRating || 'Отсутствует'}
          </p>
        </div>
      </div>
      <p className={styles.bookDescriptionTitle}>Описание:</p>
      <div className={styles.bookDescription}>
        {ReactHtmlParser(book.description) || 'Без описания'}
      </div>
    </div>
  );
}
