var app = angular.module('validationApp', ['ngMaterial', 'ngMessages']);

app.controller('signupController', function() {
  vm = this;
  vm.hello = 'hello';
  //Password expression. Password must be between 4 and 8 digits long and include at least one numeric digit.
});