/* eslint-disable import/extensions */
import _ from 'lodash';
import { faker } from '@faker-js/faker';
import { Author, Book } from '../models/Model.js';

async function fakeAuthorData(authorNo) {
  const authors = [];
  _.forEach(_.range(authorNo), () => {
    const newAuthor = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      age: _.random(20, 50),
    };
    authors.push(newAuthor);
  });
  Author.insertMany(authors);
}

async function fakeBookData(bookNo) {
  const authors = await Author.find();
  const authorIds = _.map(authors, author => author._id);
  const books = [];
  _.forEach(_.range(bookNo), () => {
    const authorNo = _.random(4) + 1;
    const newBook = {
      name: faker.commerce.productName(),
      authors: _.sampleSize(authorIds, authorNo),
      genre: faker.music.genre(),
    };
    books.push(newBook);
  });
  const newBooks = Book.insertMany(books);
  return newBooks;
}

export {
  fakeAuthorData,
  fakeBookData,
};
