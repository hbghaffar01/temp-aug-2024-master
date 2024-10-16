import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { TasksCollection } from "./tasks";
import { Task } from "./tasks";

Meteor.methods({
  "tasks.insert"({ title, status }: { title: string; status: Task["status"] }) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new Meteor.Error(
        "Invalid title",
        "Title cannot be empty or spaces only."
      );
    }

    const existingTask = TasksCollection.findOne({ title });
    if (existingTask) {
      throw new Meteor.Error("Task already exists");
    }

    const task: Task = {
      title: title.trim(),
      createdAt: new Date(),
      status,
    };
    TasksCollection.insert(task);

    if (status === "PENDING") {
      Meteor.call("automation.trigger", "Task Created with PENDING status");
    }
  },

  "tasks.fetch"() {
    return TasksCollection.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).fetch();
  },

  "tasks.delete"(taskId: string) {
    check(taskId, String);
    TasksCollection.remove(taskId);

    Meteor.call("automation.trigger", `Task with ID ${taskId} deleted`);
  },

  "automation.trigger"(message: string) {
    console.log("Automation Triggered:", message);
  },
});
