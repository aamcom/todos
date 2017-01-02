import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';
 
class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted = false;
 
    this.helpers({
      tasks() {
        const selector = {};

         // If hide completed is checked, filter tasks
       if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        // Show newest tasks at the top
        return Tasks.find(selector,{
          sort: {
            createdAt : -1,
            text : -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      totalCount() {
        return Tasks.find({}).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }

addTask(newTask) {
    // Insert a task into the collection
    Tasks.insert({
      text: newTask,
      createdAt: new Date,
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
 
    // Clear form
    this.newTask = '';
  }
  addMany() {
    var d1 = Date.parse(new Date());
    console.log ('date1=',d1);

    // Insert 50 tasks into the collection
    for(i=0;i<50;i++){
    var s= "voici la tache n°" + i + " avec un peu d'alea : " + Math.round(Math.random()*1000); 
    Tasks.insert({
      text: s,
      createdAt: new Date,
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
    }

    // Clear form
    var d2 = Date.parse(new Date());
    console.log ('date2=',d2);
    console.log ('durée=',d2-d1);
    
  }
  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      },
    });
  }
  removeTask(task) {
    Tasks.remove(task._id);
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope',TodosListCtrl]
  });