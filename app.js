const express = require("express");
const session = require("express-session");
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
app.use(session({ secret: "djsdsd", resave: false, saveUninitialized: true })); // session  manager

// routes
app.get("/", (req, res) => {
  const sqlCode = `SELECT * FROM posts limit 6`;
  // render posts
  connection.query(sqlCode, (dberr, results) => {
    if (dberr) {
      return res.status(500).send("Error retrieving posts" + dberr);
    }
    console.log(results);
    res.render("index.ejs", { posts: results, user: req.session?.user });
  });
});

app.post("/newpost", (req, res) => {
  // sql insert into
  console.log(req.body.content);
  connection.query(
    `INSERT INTO posts(content,postowner) VALUES("${req.body.content}",2)`,
    (dberr) => {
      if (dberr) {
        return res.status(500).send("Error storing post" + dberr);
      }
      res.redirect("/");
    }
  );
});

// try adding a new user fro a form submision --- create newuser.js file, newuser get route and a newuser post route
app.get("/newuser", (req, res) => {
  res.render("newuser.ejs");
});
app.post("/newuser", (req, res) => {
  console.log(req.body);
  const { fullname, email, password } = req.body;
  connection.query(
    `INSERT INTO users(fullname,email,password) VALUES("${fullname}","${email}","${password}")`,
    (dberr) => {
      if (dberr) {
        return res.status(500).send("Error storing/creating new user" + dberr);
      }
      res.redirect("/users");
    }
  );
});

// create a different registration form, routes(/register) and table(clients) with more user information - firstname,lastname,email,phone,password, yob, gender, country, city

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

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const sqlStatement = `SELECT fullname,email,password FROM users WHERE email="${email}" AND password="${password}"`;
  console.log(sqlStatement);

  connection.query(sqlStatement, (dberr, results) => {
    if (dberr) {
      return res.status(500).send("Error logging in" + dberr);
    }
    console.log(results);
    if (results.length === 0) {
      return res.status(401).send("Invalid email or password");
    }
    // login successful
    req.session.user = results[0]; // store user info in session cookie
    res.send("Login successful. Welcome " + results[0].fullname);
  });
});

// 404
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
// Start the app
app.listen(3003, (err) => {
  if (err) {
    return console.log("Error starting the server" + err);
  }

  console.log("App running on http://127.0.0.1:3003");
});
