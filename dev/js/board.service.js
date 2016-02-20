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

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', '$mdToast', 'taskService', 'stepsService', '$location', '$anchorScroll', function($scope, $mdMedia, $mdDialog, $mdToast, taskService, stepsService, $location, $anchorScroll) {
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
      var remindDate = remindDate.toString();
      var remindTime = remindTime.toString();
      var date = remindDate.substring(0, 15);
      var time = remindTime.substring(15, remindTime.length);
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
        vm.tasks = newData.data;
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
        console.log('Attempting adding step');
        var input = document.getElementById('new-task').getElementsByTagName('input');
        console.log('keycode: ' + keyCode);
        if (keyCode === 9) {
          input[input.length - 4].focus();
          $location.hash('newAddStep');
          $anchorScroll();
        }
        if (keyCode === 13) {
          console.log('Detected enter key');
          vm.submitTask();
        }
        if (keyCode === "button") {
          input[input.length - 3].focus();
           $location.hash('newAddStep');
          $anchorScroll();
        }
      }
    );
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

