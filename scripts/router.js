/*var generateRandomId = function(){
    return Math.random().toString(36).substring(11);
}*/

angular.module('listapp', ['ListServices', 'UserServices', 'ngCookies']).
    config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: 'partials/main.ngt',
            controller: 'MainController'
        }).
        when('/:listid', {
            templateUrl: 'partials/list.ngt',
            controller: 'ListController'
        }).
        otherwise({
            //redirectTo: '/'+generateRandomId()
            redirectTo: '/'
        });
});