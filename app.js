const express = require("express");
const app = express();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "socialapp2",
  port: 3307,
});

// routes
app.get("/", (req, res) => {
  // render posts
  connection.query("SELECT * FROM posts limit 6", (dberr, results) => {
    if (dberr) {
      return res.status(500).send("Error retrieving posts" + dberr);
    }
    console.log(results);
    res.render("index.ejs", { posts: results });
  });
});

app.get("/users", (req, res) => {
  console.log(req.query.id);
  console.log(req.query.person);
  connection.query("SELECT * FROM users", (dberr, results) => {
    if (dberr) {
      return res.status(500).send("Error retrieving users" + dberr);
    }
    res.render("users.ejs", { users: results });
  });
});
// 404
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
// Start the app
app.listen(3003, () => console.log("App running on http://127.0.0.1:3003"));
