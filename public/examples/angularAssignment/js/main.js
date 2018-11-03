let app = angular.module('myApp', ["ngRoute"]);

app.config(($routeProvider) => {
    $routeProvider
        .when("/", {
            templateUrl: "main.html",
            activetab: 'main'
        })
        .when("/codeExplanation", {
            templateUrl: "codeExplanation.html",
            activetab: 'codeExplanation',
        })
        .when("/contact", {
            templateUrl: "contact.html",
            activetab: 'contact'
        });
});

app.controller('mainController', ["$scope", "$rootScope", "$route", "$http", ($scope, $rootScope, $route, $http) => {
    $rootScope.$route = $route;
    /*fake data using online resource*/
    $http.get('//jsonplaceholder.typicode.com/posts').then((data) => {
        $scope.items = data.data;
    }).catch((error) => {
        // Catch and handle exceptions from success/error/finally functions
    });
}]);

app.controller('codeExplanationController', ["$scope", "$rootScope", "$route", ($scope, $rootScope, $route) => {
    $rootScope.$route = $route;
}]);

app.controller('contactController', ["$scope", "$rootScope", "$route", ($scope, $rootScope, $route) => {
    $rootScope.$route = $route;
}]);