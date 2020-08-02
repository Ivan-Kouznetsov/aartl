# Agnostic API Reliability Testing Language

## Benchmark Branch

Agnostic API Reliability Testing Language (AARTL) is a platform-agnostic declarative domain-specific language for testing HTTP servers using the server’s API, it is implemented in TypeScript as a **dependency-free** Node.js application and can run on all major operating systems (Windows, macOS, Linux-based OSs and FreeBSD), it can also run on GraalVM, and can test servers irrespective of the platform used by the server. An AARTL test is a human-readable declaration of the expected response from a server endpoint given one or more requests.

## What this benchmark is

This benchmark considers the following scenario:

1. You are testing a server which depends on a number of upstream services
2. Separately the services and your server seems to work as expected
3. You suspect based on earlier observations that the combination of your server and the upstream services is "flaky" and need to compute end to end failure rates by running the same test suite many times
4. You have a choice of using Jest (a popular test framework which is not intended for this specific sort of testing) or AARTL (which is).

## What this benchmark is not

1. Comparison of the overall quality of the test frameworks

## Details

Computer used:
AMD A10-6700 APU 3.7GHz 16GB RAM, 64-bit Windows 8.1, Node 14.7.0

Jest tests written in: JavaScript
Http library used by Jest tests: node-fetch

Tests:

- should save a post
- should get 0th post
- should get 200 status code
- should get more than 0 posts
- should get posts with text
- should get posts that each have a text property
- should get posts that each have an id starting with 0
- should get posts that contain hello
- should get posts that do not contain bye
- should get 404 for non existent post

Commands used to run the test suite 10 times:

For Jest: for i in {1..10}; do node "node_modules/jest/bin/jest.js" "src/\_\_tests\_\_/bench/posts.spec.js" -t "Jest tests"; done
For AARTL: node dist/aartl.js -f posts.aartl -n 10

# Results

## Jest

real 0m47.317s  
user 0m0.045s  
sys 0m0.090s

## AARTL

real 0m1.749s (**27 times faster**)  
user 0m0.000s  
sys 0m0.046s
