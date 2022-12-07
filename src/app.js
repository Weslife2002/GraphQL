/* eslint-disable no-console */
/* eslint-disable import/extensions */
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import schema from './schema/schema.js';

const app = express();
const MONGODB_URI = 'mongodb://127.0.0.1:27017/graphql';

mongoose.connect(MONGODB_URI);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('The app is running on port 4000');
});
