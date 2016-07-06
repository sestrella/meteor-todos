import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  });
}

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

    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, checked) {
    check(taskId, String);
    check(checked, Boolean);

    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { checked: checked } });
  },

  'tasks.setPrivate'(taskId, private) {
    check(taskId, String);
    check(private, Boolean);

    const task = Tasks.findOne(taskId);

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: private } });
  }
});
