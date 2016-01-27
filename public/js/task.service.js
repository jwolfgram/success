var app = angular.module('app', []);

app.factory('recommendService', ['$http', function($http) {
  var result = function() {
    return $http({
     method: 'GET',
     url: '/data.json'
   })
  }
  return {
    data: function() {
      return result();
    }
  }
}]);

app.controller('taskController', function(recommendService) {
  vm = this;
  vm.hello = 'hello';
  recommendService.data().then(function(resp) {
    vm.request = resp.data;
  });
});