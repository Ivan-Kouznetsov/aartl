const fetch = require('node-fetch');
const jsonpath = require('jsonpath');

const localhost = 'http://localhost:3000/';

describe('Jest tests', () => {
  it('should save a post', async () => {
    const postText = 'Hello World';
    const postResponse = await fetch(`${localhost}posts/`, { method: 'post', body: postText });

    const id = jsonpath.query(await postResponse.json(), '$..id')[0];
    const getResponse = await fetch(`${localhost}posts/${id}`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text')[0];

    expect(text).toEqual(postText);
  });

  it('should get 0th post', async () => {
    const getResponse = await fetch(`${localhost}posts/0`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text')[0];

    expect(text).toEqual('Hello this is 0th Post');
  });

  it('should get 200 status code', async () => {
    const getResponse = await fetch(`${localhost}`, { method: 'get' });
    expect(getResponse.status).toEqual(200);
  });

  it('should get more than 0 posts', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text');

    expect(text.length).toBeGreaterThan(0);
  });

  it('should get posts with text', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text');

    text.forEach((t) => {
      expect(t).toBeTruthy();
      expect(/^\d*$/.test(t)).toBe(false);
    });
  });

  it('should get posts that each have a text property', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const posts = await getResponse.json();

    posts.forEach((p) => {
      expect(p.text).toBeDefined();
    });
  });

  it('should get posts that each have an id starting with 0', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const ids = jsonpath.query(await getResponse.json(), '$..id');

    ids.forEach((id) => {
      expect(id).toBeGreaterThanOrEqual(0);
    });
  });

  it('should get posts that contain hello', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text');

    text.forEach((t) => {
      expect(t).toContain('Hello');
    });
  });

  it('should get posts that do not contain bye', async () => {
    const getResponse = await fetch(`${localhost}posts/`, { method: 'get' });
    const text = jsonpath.query(await getResponse.json(), '$..text');

    text.forEach((t) => {
      expect(t.includes('bye')).toBe(false);
    });
  });

  it('should get 404 for non existent  post', async () => {
    const getResponse = await fetch(`${localhost}posts/-1`, { method: 'get' });

    expect(getResponse.status).toBe(404);
  });
});
