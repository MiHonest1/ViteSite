import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BookList from './components/BookList';
import React from 'react';
import NoPage from './components/NoPage';
import BookPage from './components/BookPage';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
