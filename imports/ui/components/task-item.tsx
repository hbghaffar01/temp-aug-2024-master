import React, { useEffect, useState } from "react";
import { Task } from "/imports/api/tasks";
import { Meteor } from "meteor/meteor";

export function TaskItem({ task }: { task: Task }) {
  const [displayStatus, setDisplayStatus] = useState(true);

  useEffect(() => {
    const handleResize = () => setDisplayStatus(window.innerWidth > 400);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = () => {
    Meteor.call("tasks.delete", task._id, (err) => {
      if (err) {
        alert("Error deleting task");
      }
    });
  };

  return (
    <li>
      {task.title} {displayStatus && <span>({task.status})</span>}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
