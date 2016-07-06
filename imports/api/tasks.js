import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String)

    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, checked) {
    check(taskId, String);
    check(checked, Boolean);

    Tasks.update(taskId, { $set: { checked: checked } });
  }
});
