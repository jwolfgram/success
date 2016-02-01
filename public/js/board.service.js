var app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.factory('taskService', ['$http',function($http) {
  return {
    getTasks : function() {
      return $http.get('/api/todos');
    },
    createTask : function(todoData) {
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

app.controller('cardController', function($scope, $mdMedia, $mdDialog, taskService, stepsService) {
  vm = this;
  vm.title = 'Title';
  vm.subtitle = 'Subtitle';
  vm.checklist = ['Step 1'];
  /*
  stepsService.data().then(function(resp) {
    vm.request = resp.data;
  });
*/
  $scope.cardsteps = ['Step 1'];
  $scope.addNewcardStep = function() {
    console.log($scope.cardsteps);
    var newItemNo = $scope.cardsteps.length+1;
    $scope.cardsteps.push(vm.addStep);
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

});

app.controller('newTaskController', function($scope, taskService, stepsService) {
  vm = this;
  $scope.steps = ['Step 1'];
  $scope.addNewStep = function() {
    console.log('Button clicked');
    console.log(vm.title);
    console.log($scope.steps);
    var newItemNo = $scope.steps.length+1;
    $scope.steps.push('Step '+newItemNo);
  };
});