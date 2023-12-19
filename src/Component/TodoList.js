import React, { useState, useEffect } from "react";
import "./style.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editTaskId, setEditTaskId] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      )
      const todos = await response.json()
      setTasks(todos)
      setIsLoading(false)
    } catch (error) {
      console.log("Error fetching todos:", error)
      setIsLoading(false)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleAddTask = async () => {
    if (inputValue.trim() === "") {
      return
    }

    const newTask = {
      title: inputValue,
      completed: false,
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
      const addedTask = await response.json()
      setTasks((prevTasks) => [...prevTasks, addedTask])
      setInputValue("")
    
    } catch (error) {
      console.log("Error adding task:", error)
      
    }
  }

  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

  }

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId)
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title)
  }

  const handleUpdateTask = async () => {
    if (inputValue.trim() === "") {
      return
    }

    const updatedTask = {
      title: inputValue,
      completed: false,
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editTaskId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
      const updatedTaskData = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: updatedTaskData.title }
            : task
        )
      )
      setInputValue("")
      setEditTaskId(null)
     
    } catch (error) {
      console.log("Error updating task:", error)
     
    }
  }

  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    )
  }

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true
    } else if (filter === "completed") {
      return task.completed
    } else if (filter === "uncompleted") {
      return !task.completed
    }
    return true
  })

  if (isLoading) {
    return <div style={{display:"flex", alignItems:"center",justifyContent:"center", fontSize:"60px"}}>Loading...</div>
  }

  return (
    <div className="container">
     
      <div className="todo-app">
        <h1>Todo List</h1>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            id="btn"
            onClick={editTaskId ? handleUpdateTask : handleAddTask}
          >
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>

        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <span
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                >
                  <i className="fa fa-pencil-square-o"></i>
                </span>
                <span
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <i className="fa fa-trash-o"></i>
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="completed-task">
            <p>
              Completed:{" "}
              <span id="c-count">
                {tasks.filter((task) => task.completed).length}
              </span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
