export const unsorted = `
    Test that it should be sorted
    Expect HTTP request
        method: get
        url: http://localhost:3000/books?sort=unsorted
    To match JSON rules
        "$..releaseDate": is sorted asc
`;

export const sortedAsc = `
    Test that it should be sorted
    Expect HTTP request
        method: get
        url: http://localhost:3000/books?sort=asc
    To match JSON rules
        "$..releaseDate": is sorted asc
`;

export const sortedDesc = `
    Test that it should be sorted
    Expect HTTP request
        method: get
        url: http://localhost:3000/books?sort=desc
    To match JSON rules
        "$..releaseDate": is sorted desc
`;
