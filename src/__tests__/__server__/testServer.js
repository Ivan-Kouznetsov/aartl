const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

/*
 * REST
 */

const restApp = express();
restApp.use(bodyParser.raw({ type: '*/*' }));

const restPort = 3000;

const posts = ['0th Post'];

restApp.get('/', (_, response) => {
  response.status(200).send('Ready').end();
});

restApp.get('/null', (_, response) => {
  response
    .status(200)
    .send(JSON.stringify({ id: null, text: undefined }))
    .end();
});

restApp.get('/posts/:id', (request, response) => {
  const id = parseInt(request.params['id']);

  if (typeof posts[id] !== 'undefined') {
    // sometimes useful but gets in the way of jest output
    // console.log(JSON.stringify({ id, text: posts[id] }));
    response.send(JSON.stringify({ id, text: posts[id] })).end();
  } else {
    response.status(404).send('Not Found').end();
  }
});

restApp.delete('/posts/:id', (request, response) => {
  const id = parseInt(request.params['id']);

  if (typeof posts[id] !== 'undefined') {
    delete posts[id];
    response.status(200).send('Ready').end();
  } else {
    response.status(404).send('Not Found').end();
  }
});

restApp.post('/posts', (request, response) => {
  posts.push(request.body.toString());

  response.send(JSON.stringify({ id: posts.length - 1, success: true }));
});

restApp.get('/posts', (_, response) => {
  const results = [];
  for (let id = 0; id < posts.length; id++) {
    results.push({ id, text: posts[id] });
  }

  response.send(JSON.stringify(results)).end();
});

restApp.get('/random', (_, response) => {
  response.send(JSON.stringify({ id: Math.floor(Math.random() * Math.floor(100)), text: Math.random().toFixed(10) }));
});

restApp.listen(restPort, (err) => {
  if (err) {
    console.error('Error:', err);
  }
  console.log(`listening on port ${restPort}`);
});

/*
 * GraphQL
 */

const graphqlPort = 4000;

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Query {
  post(id: Int!): String
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  post: (args) => {
    return posts[args.id];
  },
};

const graphqlApp = express();
graphqlApp.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
graphqlApp.listen(graphqlPort);
console.log(`Running a GraphQL API server at http://localhost:${graphqlPort}/graphql`);
