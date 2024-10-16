import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Task } from "/imports/api/tasks";
import { TaskItem } from "./components/task-item";

export const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Task["status"]>("PENDING");

  useEffect(() => {
    Meteor.call("tasks.fetch", (error: Error, result: Task[]) => {
      if (!error) {
        setTasks(result);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    Meteor.call("tasks.insert", { title, status }, (error: Error) => {
      if (!error) {
        setTitle("");
        Meteor.call("tasks.fetch", (error: Error, result: Task[]) => {
          if (!error) {
            setTasks(result);
          }
        });
      } else {
        alert(error.message);
      }
    });
  };

  return (
    <div>
      <h1>Task List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
};
