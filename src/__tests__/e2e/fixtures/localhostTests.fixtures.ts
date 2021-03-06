export const saveAndCheckPost = `
  Test that it should save a post
  Using values
    @postText: Hello world
  After HTTP request
    method: post
    url: http://localhost:3000/posts
    headers:
    "Content-Type": "application/txt; charset=utf-8"
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
  `;

export const requestNonexistentPassOn = `
  Test that it should save a post
  Using values
    @postText: Hello world
  After HTTP request
    method: post
    url: http://localhost:3000/posts    
    body: @postText
    Pass on "$..XXXXX" as _id
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/_id
  To respond with status code 200 /** OK **/
  `;

export const savePostCheckId = `
  Test that it should save a post and check id
  Using values
    @postText: Hello world
  Expect HTTP request
    method: post
    url: http://localhost:3000/posts
    body: @postText
  To match JSON rules
    "$..id": >= 0
  `;

export const savePostCheckIdLessThanZero = `
  Test that it should save a post and make sure id is less than 0
  Using values
    @postText: Hello world
  Expect HTTP request
    method: post
    url: http://localhost:3000/posts
    body: @postText
  To match JSON rules
    "$..id": < 0
  `;

export const requestNonexistentPost = `
  Test that it should get apost with id of -1
  Using values
    @postText: Hello world
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/-1
  To respond with status code 200 /** OK **/ 
  `;

export const missingHeader = `
  Test that it should save a post and cache it
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
  To match header rules
    "X-Cache":"true"
  `;

export const rightHeader = `
  Test that it should save a post and be powered by Express
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
  To match header rules
    "X-Powered-By":"Express"
  `;

export const wrongHeaderValue = `
  Test that it should save a post and be powered by XXXX
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
  To match header rules
    "X-Powered-By":"XXXX"
  `;

export const headerNotPresentFail = `
  Test that it should xxxx
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/0
  To match header rules
    "X-Powered-By": must not be present
  `;

export const headerNotPresentPass = `
  Test that it should xxxx
  Expect HTTP request
    headers:
      "Accept-Encoding":"*/*"
    method: get
    url: http://localhost:3000/posts/0
  To match header rules
    "X-Cached": must not be present
  `;

export const checkLiteral = `
  Test that it should check that post id is 0
  Using values
    @postText: Hello world
  Expect HTTP request
    method: post
    url: http://localhost:3000/posts
    body: @postText
  To match JSON rules
    "$..id": 0
  `;

export const wrongCheckAnyOf = `
  Test that it should check that post id is 1 - 5
  Using values
    @postText: Hello world
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0   
  To match JSON rules
    "$..id": is any of 1 2 3 4 5
  `;

export const rightCheckAnyOf = `
  Test that it should check post id 0 - 5
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0   
  To match JSON rules
    "$..id": is any of 1 2 3 4 5 0
    "$..text": is any of 1 2 "0th Post" "hi" 72
  `;

export const getNull = `
  Test that it should be null
  Expect HTTP request
    method: get
    url: http://localhost:3000/null   
  To match JSON rules
    "$..id": null
  `;

export const invalidUrl = `
  Test that it should check post id 0 - 5
  Expect HTTP request
    url: http:///  
    method: get
  To match JSON rules
    "$..id": is any of 1 2 3 4 5 0
  `;

export const noUrl = `
Test that it should check post id 0 - 5
Expect HTTP request
  method: get
To match JSON rules
  "$..id": is any of 1 2 3 4 5 0
`;

export const noMethod = `
Test that it should xxx
Expect HTTP request
  url: http://localhost:3000/
To respond with status code 200
`;

export const passOnNonExistentValue = `
  Test that it should xxx
  After HTTP request
  method: get
  url: http://localhost:3000/
  Pass on "$..id" as _id
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/_id   
    To respond with status code 200
  `;

export const JsonRuleCheckWhenResponseIsNotJson = `
  Test that it should xxx
  Expect HTTP request
    method: get
    url: http://localhost:3000/  
  To match JSON rules
    "$..id": is any of 1 2 3 4 5 0
  `;

export const hasEachRootQueryFail = `
  Test that it should xxx
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts 
  To match JSON rules
    "$": each has XXX
  `;

export const hasEachRootQueryPass = `
  Test that it should xxx
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts 
  To match JSON rules
    "$": each has text
  `;

export const countPass = `
  Test that it should be null
Expect HTTP request
  method: get
  url: http://localhost:3000/null   
To match JSON rules
  "$..text": count = 0
  "$..text": count < 1
  "$..text": count <= 1
  "$..text": count > -1
  "$..text": count >= 0
`;

export const countFail = `
  Test that it should be null
Expect HTTP request
  method: get
  url: http://localhost:3000/null   
To match JSON rules
  "$..text": count = 0
  "$..text": count < 1
  "$..text": count <= 1
  "$..text": count > -1
  "$..text": count >= 50
`;

export const nonExistentJsonPath = `
  Test that it should xxx 
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/   
  To match JSON rules
    "$..AAAAA": 10
  `;

export const nonExistentJsonPathRule = `
  Test that it should xxx 
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/   
  To match JSON rules
    "$..AAAAA": > 10
  `;

export const limitedPropsPass = `
  Test that it should have correct props
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0   
  To match JSON rules
    "$": properties limited to id text
  `;

export const limitedPropsFail = `
  Test that it should have correct props
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0   
  To match JSON rules
    "$": properties limited to text
  `;

export const allRulesPass = `
  Test that it should have every rule pass
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0  
  To match JSON rules
    "$..id": < 10
    "$..id": <= 10
    "$..id": > -1
    "$..id": >= 0
    "$..id": count < 10
    "$..id": count <= 10
    "$..id": count = 1
    "$..id": count > 0
    "$..id": count >= 0
    "$": each has id
    "$..id": is a number
    "$..id": is any of 0 1 2 3
    "$..id": is not 9999
    "$..text": is text
    "$..text": is text containing 0
    "$..text": is text not containing AAAAA
    "$..text": matches .+
    "$": properties limited to id text
  `;

export const allRulesFail = `
  Test that it should have every rule fail
  Expect HTTP request
    method: get
    url: http://localhost:3000/posts/0  
  To match JSON rules
    "$..id": < 0
    "$..id": <= -1
    "$..id": > 0
    "$..id": >= 1
    "$..id": count < 1
    "$..id": count <= 0
    "$..id": count = 10
    "$..id": count > 10
    "$..id": count >= 10
    "$": each has phone
    "$..text": is a number
    "$..id": is any of hello goodbye
    "$..id": is not 0
    "$..id": is text
    "$..text": is text containing AAAAA
    "$..text": is text not containing 0
    "$..text": matches pie
    "$": properties limited to id
  `;

export const getXmlPass = `
  Test that it should be a Cessna
  Expect HTTP request
    method: get
    url: http://localhost:3000/xml
  To match JSON rules
    "$..make": Cessna
  `;

export const getXmlFail = `
  Test that it should not be a Cessna
  Expect HTTP request
    method: get
    url: http://localhost:3000/xml
  To match JSON rules
    "$..make": Not Cessna
  `;

export const loginAndGetUserData = `  
  Test that it should get users name
  After HTTP request
    method: POST
    url: http://localhost:3000/login
    body: {"username":"john_auth", "password":"p@ssw0rd11"}
  Pass on "$..token" as _token
  Expect HTTP request
    method: GET
    url: http://localhost:3000/user/profile
  headers:
    "Authentication": Bearer _token
  To match JSON rules
    "$..real_name": John A. Authman
`;
