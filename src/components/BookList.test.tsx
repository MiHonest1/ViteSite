import { expect } from 'chai';
import { filterBooks, paginate } from './BookList.tsx';

describe('filterBooks', () => {
  const example = [
    {
      id: '2weL0iAfrEMC',
      title: 'JavaScript: The Definitive Guide',
      author: 'Douglas Crockford',
      cover:
        'https://books.google.com/books/content?id=2weL0iAfrEMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
    {
      id: '8novEAAAQBAJ',
      title: 'Decoding javascript',
      author: 'Rushabh Mulraj Shah',
      cover:
        'https://books.google.com/books/publisher/content?id=8novEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73benAjv3q8sjXY6uVoX9QbllnbsxD5qrKI013WN56Ol5DZn6fSQdwNh_C7OfYsoOHtt0BvJccHejic7fs79evHwQ9G8z8ovaWNmQE8MOrllntivOrKd23R-DFH-vucCIY20XDT&source=gbs_api',
    },
  ];

  it('Фильтрация по названию', () => {
    const result = filterBooks(example, 'JavaScript');
    expect(result).to.have.lengthOf(2);
    expect(result[0].title).to.equal('JavaScript: The Definitive Guide');
    expect(result[1].title).to.equal('Decoding javascript');
  });

  it('Фильтрация по автору книги', () => {
    const result = filterBooks(example, 'Douglas');
    expect(result).to.have.lengthOf(1);
    expect(result[0].author).to.equal('Douglas Crockford');
  });

  it('Ничего не подошло под введённые данные', () => {
    const result = filterBooks(example, 'C#');
    expect(result).to.have.lengthOf(0);
  });

  it('Отсутствие зависимости от регистра', () => {
    const result = filterBooks(example, 'javascript');
    expect(result).to.have.lengthOf(2);
    expect(result[0].title).to.equal('JavaScript: The Definitive Guide');
    expect(result[1].title).to.equal('Decoding javascript');
  });
});

describe('paginate', () => {
  it('Установка номера текущей страницы в 1, если указанный номер страницы меньше 1', () => {
    const totalPages = 5;
    let currentPage = 0;
    paginate(currentPage, totalPages, (page) => {
      expect(page).to.equal(1);
    });
  });

  it('Установка номера текущей страницы в конечный, если указанный номер страницы больше общего количества страниц', () => {
    const totalPages = 5;
    let currentPage = 6;
    paginate(currentPage, totalPages, (page) => {
      expect(page).to.equal(totalPages);
    });
  });

  it('Установка номера текущей страницы в указанный номер страницы, если он находится в допустимом диапазоне', () => {
    const totalPages = 5;
    let currentPage = 3;
    paginate(currentPage, totalPages, (page) => {
      expect(page).to.equal(currentPage);
    });
  });
});
