export const fairlyCompleteValid = `
  Test that it should return stuff when queried
  Using values
    @id: 10
    @id2: random number up to 100
    @txt: random string length 20
  After HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: post
    url: http://example.org/@id
    body: hello     
    Pass on "$..num" as _num
    Pass on "$..id" as _id
  Wait 5 seconds 
  After HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: post
    url: http://example.org/things/@id2
    body: hi 
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://example.org/@id    
    body:     
  To respond with status code 200 /** OK **/
  To match JSON rules
    "$..id": @id
    "$..title": each is a non empty string
    "$..num": each is > 10
    "$..books": count is "$..bookCount"
  To match header rules
    "Accept-Encoding":"*/*"
    "X-cache":true
  `;

export const fairlyCompleteInvalidLists = `
  Test that it should return stuff when queried
  Using values
    @id: 10
    @id2: random number up to 100
    @txt: random string length 20
  After HTTP request
    headers:
      "Accept-Encoding"
    method: post
    url: http://example.org/@id
    body: hello     
    Pass on "$..num" 
    Pass on "$..id"
  Wait 5 seconds 
  After HTTP request
    headers:
      "Accept-Encoding"
    method: post
    url: http://example.org/things/@id2
    body: hi 
  Expect HTTP request
    headers:
      "Accept-Encoding"
    method: get
    url: http://example.org/@id    
    body:     
  To respond with status code 200 /** OK **/
  To match JSON rules
    "$..id"
    
    "$..title"

    "$..num"

    "$..books"
  To match header rules
    "Accept-Encoding"
    "X-cache":true
  `;

export const saveAndCheckPost = `
    Test that it should save a post
    Using values
      @postText: Hello world
    After HTTP request
      method: post
      url: http://localhost:3000/posts
      body: @postText
      Pass on "$..id" as _id
    Wait 1 seconds
    Expect HTTP request
      headers:
        "Accept-Encoding":"*/*"
      method: get
      url: http://localhost:3000/posts/_id
    To respond with status code 200 /** OK **/
    To match JSON rules
      "$..id": _id
      "$..text": @postText
      ;
      ;
    `;

export const noRequests = `
    Test that it should save a post
    `;

export const invalidKvPairs = `
Test that it should save a post
Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/0
To match JSON rules
  "$..id":
         : @postText
    `;
