const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.raw({ type: '*/*' }));

const port = 3000;

const posts = ['0th Post'];

app.get('/', (_, response) => {
  response.status(200).send('Ready').end();
});

app.get('/null', (_, response) => {
  response
    .status(200)
    .send(JSON.stringify({ id: null, text: undefined }))
    .end();
});

app.get('/posts/:id', (request, response) => {
  const id = parseInt(request.params['id']);

  if (typeof posts[id] !== 'undefined') {
    response.send(JSON.stringify({ id, text: posts[id] })).end();
  } else {
    response.status(404).send('Not Found').end();
  }
});

app.post('/posts', (request, response) => {
  posts.push(request.body.toString());

  response.send(JSON.stringify({ id: posts.length - 1, success: true }));
});

app.listen(port, (err) => {
  if (err) {
    console.error('Error:', err);
  }
  console.log(`listening on port ${port}`);
});
