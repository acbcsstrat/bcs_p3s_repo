app.component('basket', {
	templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
	controller: ['basketService', 'ngCart', function(basketService, ngCart) {

		var vm = this;

		fetchBasketItems();

		function fetchBasketItems() {

			basketService.fetchBasketItems()
			.then(
				function(response){
			
					vm.billingDetails = response;

					const patentData = response.orderedPatentUIs;

					vm.basketContent = []

					patentData.forEach(function(data) {
						vm.basketContent.push(data);
					})
				},
				function(errResponse){
					console.log(response)
				}
			);
		}

		ngCart.setTaxRate(10);
    	ngCart.setShipping(10); 

	}
]})


