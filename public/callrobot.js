/*function Hello($scope, $http) {
    $http.get('http://rest-service.guides.spring.io/greeting').
        success(function(data) {
            $scope.greeting = data;
        });


function SendRobotCommand($scope, $http) {
    $http.get('http://localhost:3000/api/command?command=turn%20100%201').
        success(function(data) {
            $scope.greeting = data;
            console.log('in success');
            console.log(data);
        });
}*/

//http://fierce-beach-8075.herokuapp.com/api/command?command=test
function SendRobotCommand2($scope, $http) {
  $http({method: 'GET', url: 'http://fierce-beach-8075.herokuapp.com/api/command?command=turn%20100%201'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.greeting = data;
      console.log('success');
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.greeting = data;
      console.log('fail');
    });
}















