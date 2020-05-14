transactionLink.$inject = ['$anchorScroll','$state', '$location', 'TransactionService'];

function transactionLink($anchorScroll, $state, $location, TransactionService) {
    return {
        transclude: true,
        scope: {},
        template: require('html-loader!./html/transaction-link.tpl.htm'),
        link: function(scope, elem, attrs) {

            $(elem).click(function() {

                var id = attrs.transId;
                var type = attrs.transServicetype;

                TransactionService.fetchCurrentTransactions()
                .then(
                    function(response) {

                        var match = response.filter(function(el){
                            return el.serviceUIs.find(function(item){
                                if(item.patentUI) {
                                    return item.patentUI.id == id;
                                } else {
                                    return item.patentId == id;
                                }
                                
                            })
                        }).filter(function(item){
                            return item.serviceUIs[0].newType.toLowerCase() === type.toLowerCase();
                        })

                        if(match !== undefined || typeof match !== 'undefined') {
                            $state.go('transactions.modal.transaction-item',{transId: match[0].id}) //if match, go current-transaction-item
                            .then(
                                function(response){
                                    elem.on('$destroy', function(){
                                        $location.hash('currTransAnchor'); 
                                        $anchorScroll();  //scroll to anchor href
                                    })                                
                                },
                                function(errResponse){
                                    console.error('Error in transitioning : ', errResponse);
                                }
                            );
                        }

                    }
                );   
            })  

        }

    }
}

export default angular.module('directives.transaction-link')
    .directive('transactionLink', transactionLink)
    .name;