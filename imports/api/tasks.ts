import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { Meteor } from 'meteor/meteor';

export interface Task {
  _id?: string;
  title: string;
  createdAt: Date;
  status: "PENDING" | "COMPLETED";
}

export const TasksCollection = new Mongo.Collection<Task>("tasks");

Meteor.methods({
  "tasks.insert"({ title, status }: { title: string; status: Task["status"] }) {
    check(title, String);
    check(status, String);
    
    if (typeof title !== "string" || title.length === 0 || !/^[^\s].*[^\s]$/.test(title)) {
      throw new Meteor.Error("Invalid title");
    }

    const existingTask = TasksCollection.findOne({ title });

    if (existingTask) {
      throw new Meteor.Error("Task already exists");
    }

    const task: Task = {
      title,
      createdAt: new Date(),
      status,
    };

    TasksCollection.insert(task);
  },

  "tasks.fetch"() {
    const tasks = TasksCollection.find().fetch();
    return tasks.filter(
      (task) => task.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
  },

  "tasks.delete"(taskId: string) {
    check(taskId, String);
    TasksCollection.remove(taskId);
  }
});
