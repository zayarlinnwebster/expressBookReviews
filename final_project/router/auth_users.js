const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    for (let user of users) {
        if (user.username === username) {
            return true;
        }
    }

    return false;
}

const authenticatedUser = (username, password) => { //returns boolean
    for (let user of users) {
        if (user.username === username && user.password === password) {
            return true;
        }
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);

    if (!username || !password) {
        return res.status(404).json({ message: "Body Empty" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "username and password are incorrect" });
    }

    let accessToken = jwt.sign({
        data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.username;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!isValid(username)) {
        return res.status(403).json({ message: "Username is not valid." })
    }

    books[isbn].reviews[username] = review;

    return res.status(200).send("Book review posted successfully.");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.username;
    const isbn = req.params.isbn;

    if (!isValid(username)) {
        return res.status(403).json({ message: "Username is not valid." })
    }

    delete books[isbn].reviews[username]

    return res.status(200).send("Book review deleted successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
