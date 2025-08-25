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

// middleware
app.use(express.urlencoded({ extended: true })); // to parse/extract incoming/request form data

// routes
app.get("/", (req, res) => {
  // render posts
  connection.query("SELECT * FROM posts  limit 6", (dberr, results) => {
    if (dberr) {
      return res.status(500).send("Error retrieving posts" + dberr);
    }
    console.log(results);
    res.render("index.ejs", { posts: results });
  });
});

app.post("/newpost", (req, res) => {
  // sql insert into
  console.log(req.body.content);
  connection.query(`INSERT INTO posts(content,postowner) VALUES("${req.body.content}",2)`, (dberr)=>{
    if (dberr) {
      return res.status(500).send("Error storing post" + dberr);
    }
    res.redirect("/");
  })
});

// try adding a new user fro a form submision --- create newuser.js file, newuser get route and a newuser post route

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
