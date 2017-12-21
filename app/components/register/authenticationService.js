app.factory('authentication', ['$rootScope', '$location', '$firebaseAuth', '$firebaseObject', function($rootScope, $location, $firebaseAuth, $firebaseObject) {

    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser){
        if(authUser) {
            var userRef = ref.child('users').child(authUser.uid); //get reference to current user
            var userObj = $firebaseObject(userRef);
            $rootScope.currentUser = userObj;
        } else {
            $rootScope.currentUser = '';
        }
    })

    return {

        login: function(user) {
            auth.$signInWithEmailAndPassword(
                user.email,
                user.password
            ).then(function(user){
                $location.path('/patents');
            }).catch(function(error) {
                $rootScope.message = error.message;
            })
        },
        logout: function() {
            return auth.$signOut();
        },
        requireAuth: function() {
            return auth.$requireSignIn();
        },
        register: function(user) {
            auth.$createUserWithEmailAndPassword(
                user.email,
                user.password
            ).then(function(regUser){
                var regRef = ref.child('users').child(regUser.uid).set({
                    date: firebase.database.ServerValue.TIMESTAMP,
                    regUser: regUser.uid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                });
                $rootScope.message = 'Welcome ' + user.firstname + ', Thanks for registering!';
            }).catch(function(error){
                $rootScope.message = error.message;
            }) //$createUserWithEmailAndPassword

        }
    }
}]);