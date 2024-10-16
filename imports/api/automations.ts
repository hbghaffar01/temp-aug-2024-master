import { Mongo } from "meteor/mongo";

export enum AutomationTrigger {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum AutomationEntity {
  TASK = "TASK",
  PROJECT = "PROJECT",
  USER = "USER",
}

export interface Automation {
  _id?: string;
  trigger: {
    type: AutomationTrigger;
    entity: AutomationEntity;
  };
  condition: {
    type: string;
    value: string;
  };
  action: {
    type: string;
    value: string;
  };
}

export const AutomationsCollection = new Mongo.Collection<Automation>("automations");

export function checkAndTriggerAutomations(trigger: AutomationTrigger, entity: AutomationEntity, conditionValue: string) {
  const automations = AutomationsCollection.find({
    "trigger.type": trigger,
    "trigger.entity": entity,
    "condition.value": conditionValue,
  }).fetch();

  for (const automation of automations) {
    console.log(`Automation render: ${automation.action.value}`);
  }
}
