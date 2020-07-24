export const usingValues = `
  Test that it should save a post
  Using values
    @postText: Hello world
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/123
  To respond with status code 200
  To match JSON rules
    "$..text": @postText  
  `;

export const usingRanomdValues = `
  Test that it should save a post
  Using values
    @num: random number up to 10
    @postText: random string length 10
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/123
  To respond with status code 200
  To match JSON rules
    "$..id": @num
    "$..text": @postText  
  `;

export const usingRandomValuesTooManyArgs = `
  Test that it should save a post
  Using values
    @num: random number up to 10 12
    @postText: random string length 10 12
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/123
  To respond with status code 200
  To match JSON rules
    "$..id": @num
    "$..text": @postText  
  `;
