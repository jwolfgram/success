var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  return {
    getTasks : function() {
      return $http.get('/api/task');
    },
    createTask : function(taskData) {
      return $http.post('/api/todos', todoData);
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
    createStep : function(todoData) {
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
  /*
  stepsService.data().then(function(resp) {
    vm.request = resp.data;
  });
*/
  vm.stepArray = [];
  vm.addNewcardStep = function() {
    console.log(vm.stepArray);
    var newItemNo = vm.stepArray.length+1;
    vm.stepArray.push(vm.addStep);
    vm.addStep = null;
  };


  vm.newTask = function showDialog($event) {
    var parentEl = angular.element(document.body);
    console.log($mdDialog);
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
  vm.addNewStep = function() {
    console.log('Button clicked');
    console.log(vm.title);
    console.log(vm.steps);
    var newItemNo = vm.steps.length+1;
    vm.steps.push('Step '+newItemNo);
  };

  vm.sendTask = function() {
    console.log('Form submitted... send to node for mongo!');
  };
}]);