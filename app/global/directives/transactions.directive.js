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

                TransactionService.fetchAllTransactions()
                .then(
                    function(response) {

                        var match = response.filter(function(el){ //find transations containign patent ID (Ccan be multiple)
                            return el.serviceUIs.find(function(item){
                                if(item.patentId) {
                                    return item.patentId == parseInt(id);
                                } else {
                                    return item.patentID == parseInt(id);                        
                                }
                            })
                        }).filter(function(el){ //find which transactionc contains the action type (requried for grants with accompanied renewal)
                            if(el.transStatusUI !== 'Completed') { //handles issue with a patent with a renewal history. directs the user to the 'in progress one', rather than completed one.                      
                                return el.serviceUIs.find(function(item){
                                    if(item.newType.toLowerCase() === type.toLowerCase()) { //if matched with directive attr value
                                        return item.patentId == parseInt(id);
                                    } 
                                })
                            }
                        })

                        if(match !== undefined || typeof match !== 'undefined') {
                            $state.go('transactions.modal.transaction-item',{transId: match[0].p3s_TransRef}) //if match, go current-transaction-item
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

export default angular.module('directives.transaction-link', [])
    .directive('transactionLink', transactionLink)
    .name;