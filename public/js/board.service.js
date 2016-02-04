var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  return {
    getTasks : function() {
      return $http.get('/api/task');
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
  vm.addNewcardStep = function() {
    vm.card.step[0].step.step.push = {checked: false, step: String(vm.card.step.step.length+1)}; //in a sub array... hhmm
    console.log(vm.addStep); //Send vm.addStep to $http nodejs
    vm.card.step.push(vm.addStep);
    vm.addStep = null;
  };

  taskService.getTasks().then(function(resp) {
    console.log(resp.data); //Fix this
    vm.card = resp.data;
    console.log(vm.card[0].step.step);
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
    vm.newTask = String(vm.steps.length+1);
    console.log(vm.newTask);
    var newStep = {};
    newStep.id = 'step' + vm.newTask;
    newStep.label = 'Step ' + vm.newTask;
    vm.steps.push(newStep);
  };
}]);