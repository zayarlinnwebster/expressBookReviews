const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookapiUrl = 'https://zayarl513-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/';

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

function getBooksByISBN(isbn) {
    const isbnNum = parseInt(isbn);

    return new Promise((resolve, reject) => {
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
}

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        const filterBooks = [];

        for (const key in books) {
            if (books[key].author === author) {
                filterBooks.push(books[key]);
            }
        }

        resolve(filterBooks);
    });
}

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const filterBooks = [];

        for (const key in books) {
            if (books[key].title === title) {
                filterBooks.push(books[key]);
            }
        }

        resolve(filterBooks);
    });
}

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
    getBooks().then((result) => res.send(JSON.stringify(result)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getBooksByISBN(req.params.isbn).then(
        (result) => res.send(result),
        (error) => res.status(error.status).json({ message: error.message })
    );
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    getBooksByAuthor(req.params.author).then(
        (result) => res.send(result),
    );
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    getBooksByTitle(req.params.title).then(
        (result) => res.send(result),
    );
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
