const express = require('express'); 
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookapiUrl = 'https://zayarl513-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/';


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (isValid(username)) {
        res.send("username & password are not provided.")
    }

    users.push({
        "username": username,
        "password": password
    });
    res.send("The user" + (' ') + (req.query.username) + " Has been registered!")
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookList = [];

    for (const key in books) {
        bookList.push(books[key]);
    }
    res.send(JSON.stringify(bookList, null, 4));
});

async function getBooks() {
    try {
        const response = await axios.get(bookapiUrl);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

async function getBooksByISBN(isbn) {
    try {
        const response = await axios.get(bookapiUrl + 'isbn/' + isbn);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filterBooks = [];

    for (const key in books) {
        if (books[key].author === author) {
            filterBooks.push(books[key]);
        }
    }
    res.send(filterBooks);
});

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(bookapiUrl + 'author/' + author);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filterBooks = [];

    for (const key in books) {
        if (books[key].title === title) {
            filterBooks.push(books[key]);
        }
    }
    res.send(filterBooks);
});

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(bookapiUrl + 'title/' + title);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
