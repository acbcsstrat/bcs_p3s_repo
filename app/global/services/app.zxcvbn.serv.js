export default angular.module('services.zxcvbn', []).factory('zxcvbn', zxcvbn).name;

function zxcvb() {

    return {
        score: function() {
            var compute = zxcvbn.apply(null, arguments);
            return compute && compute.score;
        }
    };
    
}

