import mongoose from 'mongoose';

const { Schema } = mongoose;
const AuthorSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const BookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  }],
  genre: {
    type: String,
    required: true,
  },
});
const Author = mongoose.model('Author', AuthorSchema);
const Book = mongoose.model('Book', BookSchema);

export { Author, Book };
