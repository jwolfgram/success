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
  vm.checklist = ['First task',2,3,4,5];
  /*
  stepsService.data().then(function(resp) {
    vm.request = resp.data;
  });
*/

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