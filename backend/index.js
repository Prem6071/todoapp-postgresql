const express = require("express");
const app = express();
const cors = require("cors");
const Pool = require("pg").Pool;

//middleware
app.use(cors());
app.use(express.json()); //req.body


//connection
const pool = new Pool({
  user: "postgres",
  password: "**password**",
  host: "localhost",
  port: 5432,
  database: "todoapp"
});


//ROUTES//

//create a todo

app.post("/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = await pool.query(
      "INSERT INTO todolist (task) VALUES($1) RETURNING *",
      [task]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await pool.query("SELECT * FROM todolist");
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query("SELECT * FROM todolist WHERE task_id = $1", [
      id
    ]);

    res.json(task.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const updateTask = await pool.query(
      "UPDATE todolist SET task = $1 WHERE task_id = $2",
      [task, id]
    );

    res.json("Task updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await pool.query("DELETE FROM todolist WHERE task_id = $1", [
      id
    ]);
    res.json("Task deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


app.listen(5000, () => {
  console.log("Server has started on port 5000");
});