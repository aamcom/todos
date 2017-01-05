import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert' (text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove' (taskId,taskOwner) {
    check(taskId, String);
    console.log(Meteor.userId(),taskOwner)
    if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized --> User pas logué');
    }
    else if (Meteor.userId() != taskOwner){
        //throw new Meteor.Error('not-authorized --> User different');
        console.log('not-authorized --> User different');
        return false;
    }
    else {
        Tasks.remove(taskId);
    }
  },
  'tasks.setChecked' (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
});