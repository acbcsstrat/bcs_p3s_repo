angular.module('ppApp').directive('transactionLink', function() {


//$compile can match directives based on element names (E), attributes (A), class names (C), and comments (M).

    return {

        restrict: 'E',
        scope: {
            patentId: '@', //if the attribute name was patentId, you can use =, equivlaent of =patentId,
            ngModel: '='
        },
        transclude: true, //gives access to the outside scope of this directive Best Practice: only use transclude: true when you want to create a directive that wraps arbitrary content.
        templateUrl: 'app/templates/directives/transaction-link.tpl.htm',
        controller: ['$scope', function($scope) {

            $scope.hello = 'this';

        }],
        link: function(scope, element, attrs, ctrl) {

            console.log('element', element)
            console.log('scope', scope)
            console.log('attr: ', attrs.patentId)
            console.log('ctrl: ', scope.hello)            

            // element.on('$destroy', function() { //used to destroy servieces if element is removed from DOM. Stops memory leaks

            // })

        }

    }

})
// <transaction-link>
//     id //inititated from view
//     currentTransactions //initiated from controller

//     function fetchItemTransaction(id) {
//         currentTransactionsService.fetchCurrentTransactions()
//         .then(
//             function(response) {
//                 response.forEach(function(data) {
                    
//                     var transaction = data.renewalUIs.find(function(data, i) {
//                         return data.patentUI.id == id;
//                     })

//                     if(transaction) {
//                         $state.go('current-transactions.current-transaction-item',{transId: transaction}) //if match, go current-transaction-item
//                         .then(
//                             function(response){
//                                 $timeout(function() {
//                                     $location.hash('currTransAnchor'); 
//                                     $anchorScroll();  //scroll to anchor href
//                                 }, 300);
//                             },
//                             function(errResponse){
//                                 console.log(errResponse);
//                             }
//                         );
//                     }
//                 });
//             },
//             function(errResponse) {
//                 console.log(errResponse);
//             }
//         );
//     };    