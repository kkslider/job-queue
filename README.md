## What is this?

This project is an implementation of a job queue using Kue with Node.js. Data is saved in Redis. 

## How do I run this?

First, install the Node dependencies by running `npm install`. Then you can run `npm start` to boot up the server. You must have Redis installed and running (`redis-server` for Mac). Once they are up, you can make calls to the API.

## What is the API?

The API allows users to create a job consisting of a call to save a URL, and then a call to get the job details, including the HTML for the URL. It consists of two routes: a POST call to */urls* and a GET call to */urls/:id*, with *id* being the job id provided in the response from the POST call. Here is an example:

### POST to /urls
    POST /urls HTTP/1.1  
    Host: localhost:3000  
    Content-Type: application/json  
    Cache-Control: no-cache  

    {  
        "url": "https://www.google.com"  
    }  

The response body from the server will contain the id of the newly created job:  

    {
        "jobId": 80
    }  

### GET to /urls/id

    GET /urls/80 HTTP/1.1
    Host: localhost:3000
    Cache-Control: no-cache

The response body from the server will contain the `state` of the job and other job information, including the html of the URL if the job is complete (truncated here):  

    {
        "html": "<!doctype html><html itemscope=\"\" itemtype=\"http://schema.org/WebPage\" lang=\"en\"><head><meta content=\"Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.\" name=\"description\"><meta content=\"noodp\" name=\"robots\"><meta content=\"text/html; charset=UTF-8\" http-equiv=\"Content-Type\"></body></html>",
        "state": "complete",
        "url": "https://www.google.com",
        "jobId": "80"
    }

## Is there a UI to view all my jobs?
Kue provides a small Express application to view jobs filtered by status. To access it, run `node_modules/kue/bin/kue-dashboard -p 3050 -r redis://127.0.0.1:6379` and direct your browser to `http://localhost:3050`.
## Are there tests?

A test case has been written for each HTTP call. `Supertest` and `Tape` are used for API testing and assertions, respectively. To run the tests, simply run `npm test`. 
