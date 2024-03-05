  const express=require("express");
  const cors=require("cors");
  const  mysql=require("mysql");
  const app =express();
  app.use(cors());
  app.use(express.json());

  const db=mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database:"todo_db"
  })
  app.post('/add-task', (req, res) => {
    const { text, startTime, endTime } = req.body;
    const sql = 'INSERT INTO tasks (task_text, startTime, endTime) VALUES (?, ?, ?)';

    db.query(sql, [text, startTime, endTime], (err, result) => {
      if (err) {
        console.error('Error inserting task:', err);
        return res.status(500).json({ error: 'Could not add task' });
      }

      const addedTask = { text, startTime, endTime, id: result.insertId };
      res.json(addedTask);
    });
  });
    app.patch('/update-task/:taskId', (req, res) => {
      const taskId = req.params.taskId;
      const updatedTaskText = req.body.text;
      const updatedTaskCompletion = req.body.completed;
    
      if (!updatedTaskText) {
        return res.status(400).json({ error: 'Task text must not be empty' });
      }
      const sql = `UPDATE tasks SET task_text = ?, completed = ? WHERE id = ?`;
      db.query(sql, [updatedTaskText, updatedTaskCompletion, taskId], (err, result) => {
        if (err) {
          console.error("Error updating task:", err);
          return res.status(500).json({ error: "Could not update task", details: err.message });
        }
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Task not found" });
        }
    
        res.status(200).json({ message: "Task updated successfully" });
      });
    });
    const addTask = () => {
      if (newTask.trim() !== '') {
        const taskData = {
          text: newTask,
        };
        fetch('http://localhost:8081/add-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Task added:', data);
            setNewTask('');
          })
          .catch((error) => console.error('Error adding task:', error));
      }
    };
    app.patch('/update-task/:taskId', (req, res) => {
      const taskId = req.params.taskId;
      console.log('taskId:', taskId)
      console.log('req.body:',req.body)
      
      const updatedTaskText = req.body.text;
    
      if (!updatedTaskText) {
        return res.status(400).json({ error: 'Task text must not be empty' });
      }
    
      const sql = `UPDATE tasks SET task_text = '${updatedTaskText}' WHERE id = ${taskId}`;
      db.query(sql, [updatedTaskText, taskId], (err, result) => {
        if (err) {
          console.error("Error updating task:", err);
          return res.status(500).json({ error: "Could not update task", details: err.message });
        }
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Task not found" });
        }
    
        res.status(200).json({ message: "Task updated successfully" });
      });
    });
    ///
    app.patch('/mark- all-completed', (req, res) => {
      const completed = req.body.completed;
      const sql = 'UPDATE tasks SET completed = ?';
      const sqlUpdateAllCompleted = 'UPDATE tasks SET all_completed = ?'; // Update the all_completed status
    
      db.beginTransaction(function (err) {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).json({ error: 'Could not update all tasks' });
        }
        // Update the completion status for all tasks
        db.query(sql, [completed], function (err, result) {
          if (err) {
            db.rollback(function () {
              console.error('Error updating all tasks:', err);
              return res.status(500).json({ error: 'Could not update all tasks' });
            });
          } else {
            db.query(sqlUpdateAllCompleted, [completed], function (err, result) {
              if (err) {
                db.rollback(function () {
                  console.error('Error updating all_completed status:', err);
                  return res.status(500).json({ error: 'Could not update all tasks' });
                });
              } else {
                db.commit(function (err) {
                  if (err) {
                    db.rollback(function () {
                      console.error('Error committing transaction:', err);
                      return res.status(500).json({ error: 'Could not update all tasks' });
                    });
                  }
                  console.log('All tasks updated successfully');
                  res.status(200).json({ message: 'All tasks updated successfully' });
                });
              }
            });
          }
        });
      });
    });
    ///
    app.patch('/update-completion/:taskId', (req, res) => {
      const taskId = req.params.taskId;
      const isCompleted = req.body.completed; // true or false
    
      const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
      db.query(sql, [isCompleted, taskId], (err, result) => {
        if (err) {
          console.error('Error updating task completion status:', err);
          return res.status(500).json({ error: 'Could not update task completion status' });
        }
    
        res.status(200).json({ message: 'Task completion status updated successfully' });
      });
    });
    
    app.delete('/delete-task/:taskId', (req, res) => {
      const taskId = req.params.taskId;
      
      const sql = `DELETE FROM tasks WHERE id = ${taskId}`;
      
      db.query(sql, (err, result) => {
        if (err) {
          console.error('Error deleting task:', err);
          return res.status(500).json({ error: 'Could not delete task', details: err.message });
        }
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }
    
        res.status(200).json({ message: 'Task deleted successfully' });
      });
    });
//
  db.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err);
      } else {
        console.log('Database connected successfully');
      }
    });
    
  app.get("/",(req, res)=>{
      const sql= "SELECT * FROM tasks";
      console.log('res:',res);
      console.log('req:',req);

      db.query(sql,(err,data)=> {
          if(err)return res.json("Error");
          return  res.json(data);
      })
  })

  app.listen(8081, ()=>{
      console.log("listening");
  })
  app.put('/update-task/:taskId', (req, res) => {
      const taskId = req.params.taskId;
      const updatedTaskText = req.body.text;
  })
  app.use(cors({
    origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
    credentials: true, // If your app uses cookies or sessions
  }));

  app.patch('/update-all-completion', (req, res) => {
  const isCompleted = req.body.completed;

  // Fetch all tasks
  const getAllTasksQuery = 'SELECT * FROM tasks';

  db.query(getAllTasksQuery, (err, tasks) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Could not fetch tasks' });
    }

    // Check if any task is incomplete
    const anyIncomplete = tasks.some(task => task.completed === 0); // Assuming 1 for completed, 0 for incomplete

    // Update all tasks' completion status
    const updateAllTasksQuery = 'UPDATE tasks SET completed = ?';

    db.query(updateAllTasksQuery, [isCompleted], (err, updateResult) => {
      if (err) {
        console.error('Error updating tasks:', err);
        return res.status(500).json({ error: 'Could not update tasks' });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: 'No tasks updated' });
      }

      // Update the "all_completed" status based on the check
      const updateAllCompletedQuery = 'UPDATE tasks SET all_completed = ?'; // Update the all_completed field

      db.query(updateAllCompletedQuery, [anyIncomplete ? 0 : 1], (err, updateCompletedResult) => {
        if (err) {
          console.error('Error updating all_completed status:', err);
          return res.status(500).json({ error: 'Could not update all_completed status' });
        }

        res.status(200).json({ message: 'All tasks updated successfully' });
      });
    });
  });
});
