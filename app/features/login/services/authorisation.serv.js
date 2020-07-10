export default angular.module('services.authorisation', []).service('AuthorisationService', AuthorisationService).name;

AuthorisationService.$inject = ['$state']

function AuthorisationService($state) {

  this.authorised = false;
  this.memorizedState = null;

  var
  clear = function() {
    this.authorised = false;
    this.memorizedState = null;
  },

  go = function(fallback) {
    this.authorised = true;
    var targetState = this.memorizedState ? this.memorizedState : fallback;
    $state.go(targetState);
  };

  return {
    authorised: this.authorised,
    memorizedState: this.memorizedState,
    clear: clear,
    go: go
  };


}