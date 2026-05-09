const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const username = req.body.username || req.query.username;
  const password = req.body.password || req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }

  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', async (req, res) => {
  const getBooks = new Promise((resolve) => resolve(books));
  return res.status(200).json(await getBooks);
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve) => resolve(books[isbn]));
  const book = await getBook;

  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve) => {
    resolve(Object.values(books).filter(book => book.author === author));
  });

  const result = await getBooksByAuthor;
  return res.status(200).json(result);
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve) => {
    resolve(Object.values(books).filter(book => book.title === title));
  });

  const result = await getBooksByTitle;
  return res.status(200).json(result);
});

public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const getReview = new Promise((resolve) => {
    resolve(books[isbn] ? books[isbn].reviews : null);
  });

  const reviews = await getReview;

  if (reviews) return res.status(200).json(reviews);
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
