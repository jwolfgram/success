var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  return {
    getTasks : function() {
      return $http.get('/api/task/');
    },
    deleteTask : function(task) {
      return $http.post('/api/task/delete', [task]);
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

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', 'taskService', 'stepsService', function($scope, $mdMedia, $mdDialog, taskService, stepsService) {
  vm = this;
  vm.addNewcardStep = function(task) {
    stepsService.sendStep(task,vm.addStep).then(function(newData) {
      vm.card = newData.data;
    });
    vm.addStep = null;
  };

  vm.deleteTask = function(task) {
    console.log('Task to delete: ' + task);
    taskService.deleteTask(task).then(function(newData) {
      vm.card = newData.data;
    });
  };

  taskService.getTasks().then(function(resp) {
    vm.card = resp.data;
  });


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

app.controller('newTaskController', ['$scope', 'taskService', 'stepsService', function($scope, taskService, stepsService) {
  vm = this;
  vm.steps = [];
  vm.addNewStep = function() {
    var newTask = new Promise (function(resolve, reject) {
      vm.newTask = String(vm.steps.length + 1);
      var newStep = {};
      newStep.id = 'step' + vm.newTask;
      newStep.label = 'Step ' + vm.newTask;
      vm.steps.push(newStep);
      resolve("Success!");
    });

    newTask.then(
      function(value) {
        if (value === 'Success!') {
          var input = document.getElementById('task-form').getElementsByTagName("input");
          input[input.length - 1].focus();
        }
        else {
          console(value);
        }
      });
    };
  vm.submitTask = function() {
    console.log('Submitting task');
    var form = document.getElementById("task-form");
    var promise = new Promise (function(resolve, reject) {
      form.setAttribute("action", "/api/task");
      resolve("Success!");
    });
    promise.then(function(value) {
      form.submit();
      $mdDialog.hide();
    });
    };
  }
]);