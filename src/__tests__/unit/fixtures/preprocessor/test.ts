export const test = `Test that it should get data
Expect HTTP request
    url: http://localhost:3000/
    method: POST
    body from fixture: newpost
To respond with status code 200`;

export const multipleUseOfFixture = `Test that it should get data
Expect HTTP request
    url: http://localhost:3000/
    method: POST
    body from fixture: newpost
To respond with status code 200

Test that it should get data
Expect HTTP request
    url: http://localhost:3000/
    method: POST
    body from fixture: newpost
To respond with status code 200

Test that it should get data
Expect HTTP request
    url: http://localhost:3000/
    method: POST
    body from fixture: newpost
To respond with status code 200
`;
