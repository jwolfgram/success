var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  return {
    getTasks : function() {
      return $http.get('/api/task');
    },
    sendTask : function(taskData) {
      return $http.post('/api/task', taskData);
    },
    deleteTask : function(id) {
      return $http.delete('/api/todos/' + id);
    }
  };
}]);


app.factory('stepsService', ['$http',function($http) {
  return {
    getSteps : function() {
      return $http.get('/api/todos');
    },
    sendStep : function(todoData) {
      return $http.post('/api/todos', todoData);
    },
    deleteStep : function(id) {
      return $http.delete('/api/todos/' + id);
    }
  };
}]);

app.controller('cardController', ['$scope', '$mdMedia', '$mdDialog', 'taskService', 'stepsService', function($scope, $mdMedia, $mdDialog, taskService, stepsService) {
  vm = this;
  vm.title = 'Title';
  vm.subtitle = 'Subtitle';
  vm.stepArray = [];
  vm.addNewcardStep = function() {
    vm.newStep = String(vm.stepArray.length+1);
    console.log(vm.addStep); //Send vm.addStep to $http nodejs
    vm.stepArray.push(vm.addStep);
    vm.addStep = null;
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
      $mdDialog.hide();
    };
    $scope.submitTask = function() {
      $mdDialog.hide();
    };
  }

}]);

app.controller('newTaskController', ['$scope', 'taskService', 'stepsService', function($scope, taskService, stepsService) {
  vm = this;
  vm.steps = [];


  vm.sendTask = function() {
    console.log('Attempting to send data...');
    console.log(vm.taskName);
    taskService.sendTask({"name": vm.taskName, "note": vm.taskNote}); //SENDING NEW TASK!!!!
  };



  vm.addNewStep = function() {
    console.log('Button clicked');
    console.log(vm.steps);
    var newItemNo = vm.steps.length+1;
    vm.steps.push('Step '+newItemNo);
  };
}]);