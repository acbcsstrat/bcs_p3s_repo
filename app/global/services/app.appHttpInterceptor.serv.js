export default angular.module('services.app-http-interceptor', []).factory('myHttpInterceptor', myHttpInterceptor).name;

myHttpInterceptor.$inject = []

function myHttpInterceptor() {

    return {
        response: function (response) {
            if(response.headers()['content-type'] === "application/json; charset=utf-8"){
                // Validate response, if not ok reject
                var data = examineJSONResponse(response); // assumes this function is available

                if(!data)
                    return $q.reject(response);
            }
            return response;
        },
        responseError: function (response) {
        }
    };

}