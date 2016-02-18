var updateTasks = false;
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
      return $http.post('/api/task/', [task]);
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

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', '$mdToast', 'taskService', 'stepsService', function($scope, $mdMedia, $mdDialog, $mdToast, taskService, stepsService) {
  vm = this;

  vm.addCardStep = function(taskID) {
    stepsService.sendStep(taskID,vm.addStep).then(function(newData) {
      vm.tasks = newData.data;
    });
    vm.addStep = null;
  };

  vm.toggleCheck = function(taskID,stepID) {
    stepsService.toggleCheck(taskID,stepID).then(function(newData) {
      vm.tasks = newData.data;
    });
  };

  vm.deleteTask = function(task) {
    taskService.deleteTask(task).then(function(newData) {
      vm.tasks = newData.data;
      console.log(newData.data);
    });
  };

  vm.submitTask = function() {
    console.log('Submitting task');
    console.log(updateTasks);
    updateTasks = true;
    var formTitle = document.getElementById('task-name').value;
    var formDescription = document.getElementById('task-description').value;
    var formStep = document.getElementsByClassName('send-step');
    var sendSteps = [];
    var promise = new Promise (function(resolve, reject) {
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
      sendData.description = formDescription;
      sendData.steps = sendSteps;
      console.log(vm.tasks);
      //vm.tasks[vm.tasks.length] = { "task": formTitle, "description": formDescription, "steps": sendSteps };
      taskService.sendTask(sendData).then(function(newData) {
        console.log(vm.tasks);
        console.log(updateTasks);
        vm.tasks = newData.data;
        console.log(newData.data);
      });
      var taskDialog = document.getElementById('new-task');
      taskDialog.setAttribute("class", "hide-new-task");
    });
  };

  vm.EditTask = function() {

  };

  vm.NewTask = function() {
    vm.steps = [];
    var input = document.getElementById('new-task').getElementsByTagName('input');
    for (var i = 0; input.length > i; i++) {
      input[i].value = null;
    }
    document.getElementsByTagName('textarea')[0].value = null;
    var taskDialog = document.getElementById('new-task');
    taskDialog.setAttribute("class", "show-new-task md-dialog-container md-dialog-backdrop md-opaque ng-scope");
  };

  vm.closeDialog = function() {
    console.log('Close Dialoge');
    taskService.getTasks().then(function(newData) {
      vm.tasks = newData.data;
      console.log(vm.tasks);
      $mdToast.show(
        $mdToast.simple()
          .textContent('You have ' + vm.tasks.length + ' tasks!')
          .position('bottom right')
          .parent(document.getElementById('toast'))
          .hideDelay(3000)
      );
    });
    var taskDialog = document.getElementById('new-task');
    taskDialog.setAttribute("class", "hide-new-task");
  };

  vm.steps = [];
//Old controller
  vm.addNewStep = function(tab) {
    var newTask = new Promise (function(resolve, reject) {
      vm.newTask = String(vm.steps.length + 1);
      var newStep = {};
      newStep.id = 'step' + vm.newTask;
      newStep.label = 'Step ' + vm.newTask;
      vm.steps.push(newStep);
      resolve();
    });

    newTask.then(
      function(value) {
        console.log('Attempting adding step');
        var input = document.getElementById('new-task').getElementsByTagName('input');
        if (tab === "tab") {
          input[input.length - 2].focus();
        }
        else {
          if (tab === "enter") {
            console.log('Detected enter key');
          }
          else {
            input[input.length - 1].focus();
          }
        }
      });
    };

  vm.initCheck = function() {
    taskService.getTasks().then(function(newData) {
      vm.tasks = newData.data;
      if (vm.tasks.length === 0) {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('No Tasks!')
          .textContent('It Looks Like You Have No Tasks, Go Ahead And Make One!')
          .ariaLabel('No Tasks, make a new one!')
          .ok('Ok Cool!')
        );
      }
      else {
        console.log(vm.tasks);
        $mdToast.show(
          $mdToast.simple()
            .textContent('You have ' + vm.tasks.length + ' tasks!')
            .position('bottom right')
            .parent(document.getElementById('toast'))
            .hideDelay(3000)
        );
      }
    });
  };
}]);

