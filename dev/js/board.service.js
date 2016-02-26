var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  this.test = "Testing works";
  return {
    getTasks : function() {
      return $http.get('/api/task/');
    },
    deleteTask : function(task) {
      return $http.post('/api/task/delete', [task]);
    },
    sendTask : function(task) {
      return $http.post('/api/task/', ['newTask',task]);
    },
    sendDue : function(task,due) {
      return $http.post('/api/task/', ['updateDue',task,due]);
    },
    sendRemind : function(task,reminder) {
      return $http.post('/api/task/', ['updateRemind',task,reminder]);
    }
  };
}]);

app.factory('stepsService', ['$http',function($http) {
  return {
    sendStep : function(taskID, stepName) {
      return $http.post('/api/step', ['new' ,taskID, stepName]);
    },
    toggleCheck : function(taskID, stepID) {
      return $http.post('/api/step', ['checkbox' ,taskID, stepID]);
    }
  };
}]);

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', '$mdToast', 'taskService', 'stepsService', '$location', '$anchorScroll', function($scope, $mdMedia, $mdDialog, $mdToast, taskService, stepsService, $location, $anchorScroll) {
  vm = this;

  vm.addCardStep = function(taskID) {
    stepsService.sendStep(taskID,vm.addStep).then(function(newData) {
      vm.tasks = newData.data;
    });
    vm.addStep = null;
  };

  vm.update = function(update,taskID,item) {
    var promise = new Promise (function(resolve, reject) {
      if (update === "taskCheck") {
        stepsService.toggleCheck(taskID,item).then(function(newData) {
          vm.tasks = newData.data;
        });
      }
      if (update === "dueDate") {
        taskService.sendDue(taskID,vm.cardDueDate[item]).then(function(newData) {
          vm.tasks = newData.data;
        });
      }
      if (update === "remindDate") {
        var remindDate = vm.cardRemindDate[item];
        var remindTime = vm.cardRemindTime[item];
        var remindDate = remindDate.toString();
        var remindTime = remindTime.toString();
        var date = remindDate.substring(0, 15);
        var time = remindTime.substring(15, remindTime.length);
        remindSend = new Date(date + time);
        taskService.sendRemind(taskID,remindSend).then(function(newData) {
          vm.tasks = newData.data;
        });
      }
      resolve();
    });
    promise.then(function(value) {
      vm.fetch();
    });
  };

  vm.deleteTask = function(id) {
    taskService.deleteTask(id).then(function(newData) {
      vm.tasks = newData.data;
      console.log(newData.data);
    });
  };

  vm.submitTask = function() {
    var remindSend;
    var formTitle = document.getElementById('task-name').value;
    var formStep = document.getElementsByClassName('send-step');
    var sendSteps = [];

    var promise = new Promise (function(resolve, reject) {
      var remindDate = vm.remindDate;
      var remindTime = vm.remindTime;
      if(remindDate !== undefined) {
        var remindDate = remindDate.toString();
        var date = remindDate.substring(0, 15);
      }
      if(remindTime !== undefined) {
        var remindTime = remindTime.toString();
        var time = remindTime.substring(15, remindTime.length);
      }
      remindSend = new Date(date + time);
      console.log(vm.dueDate);
      console.log(remindSend);
      for (var i = formStep.length; i--;) {
        if(formStep[i].value.length > 0) {
          sendSteps.unshift({'step': formStep[i].value, 'checked': false});
        }
      }
      resolve('Success!');
    });
    promise.then(function(value) {
      var sendData = {};
      sendData.task = formTitle;
      sendData.steps = sendSteps;
      sendData.due = vm.dueDate;
      sendData.remind = remindSend;
      taskService.sendTask(sendData).then(function(newData) {
        vm.fetch();
      });
      var taskDialog = document.getElementById('new-task');
      taskDialog.setAttribute("class", "hide-new-task");
    });
  };

  vm.EditTask = function() {
    //Stuff for edit task overlay
  };

  vm.NewTask = function() {
    vm.steps = [];
    var input = document.getElementById('new-task').getElementsByTagName('input');
    for (var i = 0; input.length > i; i++) {
      input[i].value = null;
    }
    var taskDialog = document.getElementById('new-task');
    taskDialog.setAttribute("class", "show-new-task md-dialog-container md-dialog-backdrop md-opaque ng-scope");
  };

  vm.closeDialog = function() {
    console.log('Close Dialoge');
    taskService.getTasks().then(function(newData) {
      vm.tasks = newData.data;
      console.log(vm.tasks);
    });
    var taskDialog = document.getElementById('new-task');
    taskDialog.setAttribute("class", "hide-new-task");
  };

  vm.steps = [];
//Old controller
  vm.addNewStep = function(keyCode) {
    var newTask = new Promise (function(resolve, reject) {
      if (keyCode === 9 || keyCode === "button" || keyCode === 13) {
        if (keyCode === 9 || keyCode === "button") {
          vm.newTask = String(vm.steps.length + 1);
          var newStep = {};
          newStep.id = 'step' + vm.newTask;
          newStep.label = 'Step ' + vm.newTask;
          vm.steps.push(newStep); 
        }
        resolve();
      }
    });
    newTask.then(
      function(value) {
        var input = document.getElementsByClassName('send-step');
        if (keyCode === 9) {
          input[input.length - 2].focus();
          $location.hash('newAddStep');
          $anchorScroll();
          $location.hash('');
        }
        if (keyCode === 13) {
          vm.submitTask();
        }
        if (keyCode === "button") {
          input[input.length - 1].focus();
          $location.hash('newAddStep');
          $anchorScroll();
          $location.hash('');
        }
      }
    );
  };

  vm.fetch = function() {
    taskService.getTasks().then(function(newData) {
      vm.tasks = newData.data;
      vm.cardDueDate = [];
      vm.cardRemindDate = [];
      vm.cardRemindTime = [];
      for (var i = 0; i <= vm.tasks.length-1; i++) {
        var task = vm.tasks[i]; //Defines the task we are working with
        var dueDate = new Date(task.due);
        var remindDate = new Date(task.remind);
        vm.cardDueDate[i] = dueDate;
        vm.cardRemindDate[i] = remindDate;
        vm.cardRemindTime[i] = remindDate;
      }
    });
  };
}]);

