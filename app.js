var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
var playlistUrl = 'https://api.spotify.com/v1/browse/featured-playlists'
var myApp = angular.module('myApp', ['firebase'])

var myCtrl = myApp.controller('myCtrl', function($scope, $http, $firebaseAuth, $firebaseObject) {

  var ref = new Firebase('https://tabsspotify.firebaseio.com/');

  var userRef = ref.child("users");

  $scope.users = $firebaseObject(ref);
  $scope.authObj = $firebaseAuth(ref);

  var authData = $scope.authObj.$getAuth();
  if (authData) {
    $scope.userId = authData.uid;
  }

  // Register function
  $scope.register = function() {
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password,
    })

    .then($scope.logIn)

    .then(function(authData) {
      $scope.userId = authData.uid;
      $scope.users[authData.uid] ={
        username: $scope.username,
        userImg: $scope.userImg,
      }
      $scope.users.$save()
    })

    .catch(function(error) {
      console.error("Error: ", error);
    });
  }

  $scope.signIn = function() {
    $scope.logIn().then(function(authData){
      $scope.userId = authData.uid;
    })
  }

  // LogIn function
  $scope.logIn = function() {
    console.log('log in')
    return $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    })
  }

  // LogOut function
  $scope.logOut = function() {
    $scope.authObj.$unauth()
    $scope.userId = false
  }

  $scope.audioObject = {}
  $scope.getSongs = function() {
    $http.get(baseUrl + $scope.track).success(function(response) {
      data = $scope.tracks = response.tracks.items
    })
  }

  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }
})


// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
