export const exampleSuite = `
Test that it should save a post
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id  
Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match JSON rules
  "$..id": _id
  "$..text": @postText

Test that it should save a post and check id
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": >= 0

Test that it should save a post and make sure id is less than 0
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": < 0

Test that it should get apost with id of -1
Using values
  @postText: Hello world
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/-1
To respond with status code 200 /** OK **/
To match JSON rules
  "$..id": < 0

Test that it should save a post and cache it
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Cache":"true"

Test that it should save a post and be powered by Express
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Powered-By":"Express"

Test that it should save a post and be powered by XXXX
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Powered-By":"XXXX"

Test that it should check that post id is 0
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": 0

Test that it should check that post id is 1 - 5
Using values
  @postText: Hello world
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/0   
To match JSON rules
  "$..id": is any of 1 2 3 4 5

Test that it should check post id 0 - 5
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/0   
To match JSON rules
  "$..id": is any of 1 2 3 4 5 0
  "$..text": is any of 1 2 "0th Post" "hi" 72

Test that it should be null
Expect HTTP request
  method: get
  url: http://localhost:3000/null   
To match JSON rules
  "$..id": null
`;

export const invalidExampleSuite = `
Test that it should save a post
Using values
  @postText: Hello world
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id 
Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match JSON rules
  "$..id": _id
  "$..text": @postText

Test that it should save a post and check id
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": >= 0

Test that it should save a post and make sure id is less than 0
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": < 0

Test that it should get apost with id of -1
Using values
  @postText: Hello world
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/-1
To respond with status code 200 /** OK **/
To match JSON rules
  "$..id": < 0

Test that it should save a post and cache it
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Cache":"true"

Test that it should save a post and be powered by Express
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Powered-By":"Express"

Test that it should save a post and be powered by XXXX
Using values
  @postText: Hello world
After HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
  Pass on "$..id" as _id

Expect HTTP request
  headers:
    "Accept-Encoding":"*/*"
  method: get
  url: http://localhost:3000/posts/_id
To respond with status code 200 /** OK **/
To match header rules
  "X-Powered-By":"XXXX"

Test that it should check that post id is 0
Using values
  @postText: Hello world
Expect HTTP request
  method: post
  url: http://localhost:3000/posts
  body: @postText
To match JSON rules
  "$..id": 0

Test that it should check that post id is 1 - 5
Using values
  @postText: Hello world
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/0   
To match JSON rules
  "$..id": is any of 1 2 3 4 5

Test that it should check post id 0 - 5
Expect HTTP request
  method: get
  url: http://localhost:3000/posts/0   
To match JSON rules
  "$..id": is any of 1 2 3 4 5 0
  "$..text": is any of 1 2 "0th Post" "hi" 72

Test that it should be null
Expect HTTP request
  method: get
  url: http://localhost:3000/null   
To match JSON rules
  "$..id": null
  "$..text": count = 0
  "$..text": count < 1
  "$..text": count <= 1
  "$..text": count > -1
  "$..text": count >= 0
`;
