var mainApp = angular.module('MainApp',[]);

mainApp.controller('MainCtrl', function($scope) {
  $scope.ChromeSerial = {
    bitrate: 9600,
    readBuffer: ""
  };

  $scope.ConnectTo = function () {
    chrome.serial.connect("COM6", {bitrate: $scope.ChromeSerial.bitrate}, function(connectionInfo) {
      $scope.ChromeSerial.connectionId = connectionInfo.connectionId;
      $scope.$apply();
    });
  };

  chrome.serial.getDevices(function(Ports) {
    $scope.ChromeSerial.Ports = Ports;
    $scope.$apply();
  });

  chrome.serial.onReceive.addListener(function(info) {
    if (info.connectionId == $scope.ChromeSerial.connectionId) {
      var bufView = new Uint8Array(info.data);
      var unis = [];
      for (var i = 0; i < bufView.length; i++) {
        unis.push(bufView[i]);
      }
      var str = String.fromCharCode.apply(null, unis);
      if (str[str.length - 1] === '\r') {
        $scope.ChromeSerial.readBuffer += str.substring(0, str.length - 1);
        $scope.ChromeSerial.readNow = $scope.ChromeSerial.readBuffer;
        $scope.ChromeSerial.readBuffer = "";
      } else {
        $scope.ChromeSerial.readBuffer += str;
      }
      $scope.$apply();
    }
  });

});
