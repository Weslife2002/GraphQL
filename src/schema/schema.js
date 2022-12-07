/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { Author, Book } from '../models/Model.js';
import { fakeAuthorData, fakeBookData } from '../seeders/fakeData.js';

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authors: {
      type: new GraphQLList(GraphQLID),
    },
    authorList: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        const resultList = await Author.find({ _id: { $in: parent.authors } });
        return resultList;
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    _id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const resultList = await Book.find({ authors: parent._id });
        return resultList;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const books = await Book.findOne({ _id: args._id });
        return books;
      },
    },
    author: {
      type: AuthorType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const authors = await Author.findOne({ _id: args._id });
        return authors;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const books = await Book.find({}).limit(5).lean();
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        const authors = await Author.find({}).limit(5).lean();
        return authors;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Basic create
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        authorIds: { type: new GraphQLList(GraphQLString) },
        genre: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const newBooks = await Book.insertMany([{
          name: args.name,
          authors: args.authorIds,
          genre: args.genre,
        }]);
        return newBooks[0];
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const newAuthors = await Author.insertMany([{
          firstname: args.firstname,
          lastname: args.lastname,
          age: args.age,
        }]);
        return newAuthors[0];
      },
    },
    // Seed data
    addFakeBooks: {
      type: new GraphQLList(BookType),
      args: {
        bookNo: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const newBooks = fakeBookData(args.bookNo);
        return newBooks;
      },
    },
    addFakeAuthors: {
      type: new GraphQLList(AuthorType),
      args: {
        authorNo: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const newAuthors = fakeAuthorData(args.authorNo);
        return newAuthors;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
