
angular.module('app', [
, 'ngAnimate', 'ngSanitize'
,  'mgcrea.ngStrap'
, 'restangular', 'ngStorage'
])

.run(function() {})

.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
})

;
