import { useState, useEffect } from 'react';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isEditing, setIsEditing] = useState('');
  const [editTask, setEditTask] = useState('');

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const body = { task };
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks");
        const jsonData = await response.json();
        setListItems(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    }
    getItemsList()
  }, []);

  const removeItem = async (id) => {
    try {
      const deleteTodo = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE"
      });
      setListItems(listItems.filter(item => item.task_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const editItem = async (e) => {
    e.preventDefault()
    try {
      const body = { editTask };
      const response = await fetch(`http://localhost:5000/tasks/${isEditing}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      window.location = "/";
      setEditTask('');
      setIsEditing('');
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderEditForm = () => (
    <form /*className=""*/ /*onSubmit={(e) => { editItem(e) }}*/ >
      <input type="text" placeholder="new task..." onChange={e => { setEditTask(e.target.value) }} value={editTask} />
      <span className="badge bg-primary rounded-pill ms-2" onClick={(e) => { editItem(e) }}> Save </span>
    </form>
  )

  return (
    <div>

      <header>
        <h1 className="text-center">To Do List App</h1>
        <p className="text-center">Save what you do for today!</p>
      </header>

      <br />

      <div className="container">
        <div className="mb-3">
          <label for="taskdetail" className="form-label">Enter your tasks for the day:</label>
          <form className="d-flex" onSubmit={e => addItem(e)}>
            <input type="text" className="form-control" id="taskdetail" placeholder="task to do..." onChange={e => { setItemText(e.target.value) }} value={itemText} />
            <input className="btn btn-primary" type="submit" value=" Add " />
          </form>
        </div>
      </div>

      <br />

      <div className="container">
        <ol className="list-group list-group-numbered">
          <div className="ms-2 me-auto">Tasks to do: </div>
          {
            listItems.map(item => (
              <li className="list-group-item d-flex justify-content-between align-items-start">
                {
                  isEditing === item.task_id
                    ? renderEditForm()
                    : <>
                      <div className="ms-2 me-auto">{item.task}</div>
                      <span className="badge bg-primary rounded-pill ms-2" onClick={() => { setIsEditing(item.task_id) }}> Edit </span>
                      <span className="badge bg-primary rounded-pill ms-2" onClick={() => { removeItem(item.task_id) }}> Remove </span>
                    </>
                }
              </li>
            ))
          }
        </ol>
      </div>

      <br />

      <footer>
        <p className="text-center">For IQVIA Assignment</p>
      </footer>

    </div>
  );
}

export default App;