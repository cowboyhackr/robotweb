function Hello($scope, $http) {
    $http.get('http://rest-service.guides.spring.io/greeting').
        success(function(data) {
            $scope.greeting = data;
        });


function SendRobotCommand($scope, $http) {
    $http.get('http://localhost:3000/api/command?command=what').
        success(function(data) {
            $scope.greeting = data;
            console.log('in success');
            console.log(data);
        });
}