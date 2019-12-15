const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();

const schema = require('./schema/schema');

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log('Server is running...');
});
