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
module.exports.restPort = restPort;

if (require.main.id !== '.') return;

const posts = ['0th Post'];
const books = [
  { id: 1, title: 'My story', releaseDate: 'Jan 10, 2000' },
  { id: 2, title: 'Why are things?', releaseDate: 'Jan 12, 2000' },
  { id: 3, title: 'I did and you can too', releaseDate: 'Feb 14, 2000' },
  { id: 4, title: 'Aaarhg', releaseDate: 'Aug 1, 2000' },
];

// GET

restApp.get('/', (_, response) => {
  response.status(200).send('Ready').end();
});

restApp.get('/null', (_, response) => {
  response.setHeader('content-type', 'application/json');
  response
    .status(200)
    .send(JSON.stringify({ id: null, text: undefined }))
    .end();
});

restApp.get('/xml', (_, response) => {
  response.setHeader('content-type', 'application/xml');
  response
    .status(200)
    .send(
      `<?xml version = "1.0" encoding = "utf-8"?>
    <!-- xslplane.1.xml -->
    <?xml-stylesheet type = "text/xsl"  href = "xslplane.1.xsl" ?>
    <plane>
       <year> 1977 </year>
       <make> Cessna </make>
       <model> Skyhawk </model>
       <color> Light blue and white </color>
    </plane>`
    )
    .end();
});

restApp.get('/posts/:id', (request, response) => {
  const id = parseInt(request.params['id']);
  response.setHeader('content-type', 'application/json');
  if (typeof posts[id] !== 'undefined') {
    // sometimes useful but gets in the way of jest output
    // console.log(JSON.stringify({ id, text: posts[id] }));
    response.send(JSON.stringify({ id, text: posts[id] })).end();
  } else {
    response.status(404).send('Not Found').end();
  }
});

restApp.get('/posts', (_, response) => {
  const results = [];
  for (let id = 0; id < posts.length; id++) {
    results.push({ id, text: posts[id] });
  }
  response.setHeader('content-type', 'application/json');
  response.send(JSON.stringify(results)).end();
});

restApp.get('/random', (_, response) => {
  response.setHeader('content-type', 'application/json');
  response.send(JSON.stringify({ id: Math.floor(Math.random() * Math.floor(100)), text: Math.random().toFixed(10) }));
});

restApp.get('/books', (request, response) => {
  response.setHeader('content-type', 'application/json');

  if (request.query['sort'] == 'desc') {
    response.send(JSON.stringify([...books].reverse()));
  } else if (request.query['sort'] == 'unsorted') {
    response.send(JSON.stringify([books[1], books[3], books[2], books[4]]));
  } else {
    response.send(JSON.stringify(books));
  }
});

restApp.get('/lastpost', (_, response) => {
  response.setHeader('content-type', 'application/json');

  response.send(JSON.stringify({ id: posts.length - 1, text: posts[posts.length - 1] })).end();
});

// DELETE

restApp.delete('/posts/:id', (request, response) => {
  const id = parseInt(request.params['id']);

  if (typeof posts[id] !== 'undefined') {
    delete posts[id];
    response.status(200).send('Ready').end();
  } else {
    response.status(404).send('Not Found').end();
  }
});

// POST

restApp.post('/posts', (request, response) => {
  posts.push(request.body.toString());
  response.setHeader('content-type', 'application/json');
  response.send(JSON.stringify({ id: posts.length - 1, success: true }));
});

// Listen

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
