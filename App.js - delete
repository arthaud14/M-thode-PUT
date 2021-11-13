// Setup the environement variables form a .env file
const connection = require("./db-config");

// Import expres
const express = require("express");

// We store all express methods in a variable called app
const app = express();

// If an environment variable named PORT exists, we take it in order to let the user change the port without chaning the source code. Otherwise we give a default value of 3000
const port = process.env.PORT || 3000;

// We listen to incoming request on the port defined above

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + connection.threadId);
  }
});
app.use(express.json());

connection.query("SELECT * FROM movies", (err, result) => {
  // Do something when mysql is done executing the query
  console.log(err, result);
});

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * FROM movies", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM movies", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving the movie");
      } else {
        res.status(201).send("Movie successfully saved");
      }
    }
  );
});

app.post('/api/users', (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    'INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)',
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the user');
      } else {
        res.status(201).send('User successfully saved');
      }
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userPropsToUpdate = req.body;
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [userPropsToUpdate, userId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully");
      }
    }
  );
});

app.put('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const moviePropsToUpdate = req.body;
  connection.query(
    'UPDATE movies SET ? WHERE id = ?',
    [moviePropsToUpdate, movieId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a movie');
      } else {
        res.status(200).send('Movie updated successfully 🎉');
      }
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error deleting an user');
      } else{
        res.status(200).send('User deleted !');
      }
    }
  );
});

app.delete('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "DELETE FROM movies WHERE id = ?",
    [movieId],
    (err, result) => {
      if(err) {
        console.log(err);
        res.status(500).send("Error deleting a movie");
      } else {
        if (result.affectedRows) res.status(200).send("Movie deleted");
        else res.status(404).send("Movie not found");
      }
      }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
