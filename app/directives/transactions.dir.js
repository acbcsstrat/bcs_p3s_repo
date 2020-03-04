angular.module('ppApp').directive('transactionLink', transactionLink);

transactionLink.$inject = ['$document', '$interval', '$anchorScroll','$state', '$location', 'currentTransactionsService'];

function transactionLink($document, $interval, $anchorScroll, $state, $location, currentTransactionsService) {
    return {
        transclude: true,
        scope: {},
        templateUrl: 'app/templates/directives/transaction-link.tpl.htm',
        link: function(scope, elem, attrs) {

            $(elem).click(function() {

                var id = attrs.transId;
                var type = attrs.transServicetype;

                currentTransactionsService.fetchCurrentTransactions()
                .then(
                    function(response) {

                        var match = response.filter(function(el){
                            return el.serviceUIs.find(function(item){
                                if(item.patentUI) {
                                    return item.patentUI.id == id;
                                }
                                return item.patentId == id;
                            })
                        }).filter(function(item){
                            return item.serviceUIs[0].newType.toLowerCase() === type;
                        })

                        if(match !== undefined || typeof match !== 'undefined') {
                            $state.go('current-transactions.current-transaction-item',{transId: match[0].id}) //if match, go current-transaction-item
                            .then(
                                function(response){
                                    elem.on('$destroy', function(){
                                        $location.hash('currTransAnchor'); 
                                        $anchorScroll();  //scroll to anchor href
                                    })                                
                                },
                                function(errResponse){
                                    console.error('Error in transition: ', errResponse);
                                }
                            );
                        }
                    }
                );   
            })

        }
    }
}
