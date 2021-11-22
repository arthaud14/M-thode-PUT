const connection = require("./db-config");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + connection.threadId);
  }
});
app.use(express.json());

app.get("/api/movies", (req, res) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];
  if(req.query.color) {
    sql += "WHERE color = ?";
    sqlValues.push(req.query.color);
  }
  if(req.query.color) {
    if(req.query.color) sql += 'AND duration <= ? ;';
    else sql += "WHERE duration <= ?";
    
    sqlValues.push(red.query.max_duration);
  }
  connection.query(sql, sqlValues, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "SELECT * FROM movies WHERE id = ?",
    [movieId],
    (err, results) => {
      if(err) {
        res.status(500).send("Error retrieving movie from database");
      } else {
        if(results.length) res.json(results[0]);
        else res.status(404).send('Movie not found');
      }
    }
  );
});

app.get("/api/users", (req, res) => {
  let sql = "SELECT * FROM users";
  const sqlValues = [];
  if(req.query.language) {
    sql += "WHERE language = ?";
    sqlValues.push(req.query.language);
  }
  connection.query(sql, sqlValues, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving user from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('User not found');
      }
    }
  );
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the movie");
      } else {
        const id = result.insertId;
        const creatMovie = { id, title, director, year, color, duration };
        res.status(201).send("Movie successfully saved");
      }
    }
  );
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the user");
      } else {
        const id = result.insertId;
        const createdUser = { id, firstname, lastname, email };
        res.status(201).send("User successfully saved");
      }
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [userId],
    (err, selectResults) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        const userFromDb = selectResults[0];
        if (userFromDb) {
          const userPropsToUpdate = req.body;
          connection.query(
            'UPDATE users SET ? WHERE id = ?',
            (err) => {
              if (err) {
                console.log(err);
                res.status(500).send('Error updating a user');
              } else {
                const updated = {...userFromDb, ...userPropsToUpdate};
                res.status(200).json(updated);
            }
            }
            );
          } else {
            res.status(404).send(`User with id ${userId} not found.`);
          }
      }
    }
  );
});

app.put('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const db = connection.promise();
  let existingMovie = null;
  db.query('SELECT * FROM movies WHERE id = ?', [movieId])
    .then(([results]) => {
      existingMovie = results[0];
      if (!existingMovie) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE movies SET ? WHERE id = ?', [req.body, movieId]);
    })
    .then(() => {
      res.status(200).json({ ...existingMovie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Movie with id ${movieId} not found.`);
      else res.status(500).send('Error updating a movie.');
    });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting an user");
      } else {
        if (result.affectedRows) res.status(200).send("User deleted");
        else res.status(404).send("User not found");
      }
    }
  );
});

app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "DELETE FROM movies WHERE id = ?",
    [movieId],
    (err, result) => {
      if (err) {
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
