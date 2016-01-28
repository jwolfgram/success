var app = angular.module('validationApp', []);

app.factory('recommendService', ['$http', function($http) {
  return '';
}]);

app.controller('signupController', function(recommendService) {
  vm = this;
  vm.hello = 'hello';
  //Password expression. Password must be between 4 and 8 digits long and include at least one numeric digit.
});