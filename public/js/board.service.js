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
    sendStep : function(task, newStep) {
      return $http.post('/api/step', [task, newStep]);
    }
  };
}]);

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', '$mdToast', 'taskService', 'stepsService', function($scope, $mdMedia, $mdDialog, $mdToast, taskService, stepsService) {
  vm = this;
  console.log(taskService.getTasks());
  taskService.getTasks().then(function(newData) {
    vm.cards = newData.data;
    if (vm.cards.length === 0) {
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
      $mdToast.show(
        $mdToast.simple()
          .textContent('You have ' + vm.cards.length + ' tasks!')
          .position('bottom right')
          .parent(document.getElementById('toast'))
          .hideDelay(3000)
      );
    }
  });

  vm.addNewcardStep = function(task) {
    stepsService.sendStep(task,vm.addStep);
    vm.addStep = null;
  };

  vm.deleteTask = function(task) {
    console.log('Task to delete: ' + task);
    taskService.deleteTask(task);
  };

  vm.newTask = function showDialog($event) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      templateUrl: '/angular/template/newTask.html',
      controller: DialogController
    });
  };


  function DialogController($scope, $mdDialog) {
    $scope.closeDialog = function() {
      console.log('Close Dialoge');
      $mdDialog.hide();
    };
  }
}]);

app.controller('newTaskController', ['$scope', 'taskService', 'stepsService', '$mdDialog', function($scope, taskService, stepsService, $mdDialog) {
  vm = this;
  vm.steps = [];
  vm.addNewStep = function() {
    var newTask = new Promise (function(resolve, reject) {
      vm.newTask = String(vm.steps.length + 1);
      var newStep = {};
      newStep.id = 'step' + vm.newTask;
      newStep.label = 'Step ' + vm.newTask;
      vm.steps.push(newStep);
      resolve('Success!');
    });

    newTask.then(
      function(value) {
        if (value === 'Success!') {
          var input = document.getElementById('task-form').getElementsByTagName('input');
          input[input.length - 1].focus();
        }
        else {
          console(value);
        }
      });
    };
  vm.submitTask = function() {
    console.log('Submitting task');
    var formTitle = document.getElementById('task-name').value;
    var formDescription = document.getElementById('task-description').value;
    var formStep = document.getElementsByClassName('send-step');
    var sendSteps = [];
    console.log(vm.cards);

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
      console.log(sendData);
      taskService.sendTask(sendData);
      $mdDialog.hide();
    });
    };
  }
]);