import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "High",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addTask = () => {
    if (!formData.title || !formData.description || !formData.dueDate) return;
    const newTask = {
      id: Date.now(),
      ...formData,
    };
    setTasks([...tasks, newTask]);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "High",
    });
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const editTask = (task) => {
    setEditingTaskId(task.id);
    setFormData(task);
  };

  const updateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...formData } : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "High",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const includesSearchTerm =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "All" || task.priority === filterPriority;
    return includesSearchTerm && matchesPriority;
  });

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="taskForm">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {editingTaskId ? (
          <>
            <button onClick={updateTask}>Update</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>
      <div className="filterForm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="taskList">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            {editingTaskId === task.id ? (
              <>
                <button onClick={updateTask}>Save</button>{" "}
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => editTask(task)}>Edit</button>{" "}
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
