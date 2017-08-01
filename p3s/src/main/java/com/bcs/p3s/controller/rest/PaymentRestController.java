package com.bcs.p3s.controller.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.engine.TemporaryProcessingEngine;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PaymentService;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BasketContents;


/*
 * This Controller supports actual Payments (i.e. Bank Transfer ..)
 * Not to be confused with the 'Payment' java object, which is really a 'Transaction'
 */

@RestController
public class PaymentRestController extends Universal {

    @Autowired
    PaymentService paymentService;  //Service which will do all data retrieval/manipulation work

    //------------------- Price up Basket contents --------------------------------------------------

    // Implements API section 4.1
    // Provide details for display in the Show Basket page
    @RequestMapping(value = "/rest-basket/", method = RequestMethod.POST)
    public ResponseEntity<BasketContents> showBasketContents(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-basket/ showBasketContents() invoked.  ");

    	if ( ! (obby instanceof String)) throw new P3SRuntimeException("PaymentRestController : /rest-basket/ showBasketContents() NOT passed String");
    	
    	BasketContents basketContents;
    	try {
	
			ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
			List<Long> patentsInBasket = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs( (String) obby);
			
			basketContents = paymentService.showBasketDetails(patentsInBasket);
		   	
		} catch (Exception e) {
			System.out.println("PaymentRestController showBasketContents() SUFFERED WATCHDOG WRAPPER EXCEPTION ");
			System.out.println(e.getMessage());
			e.printStackTrace();
			
			basketContents = new BasketContents(); // to avoid compile error!
		}

  	
		log().debug("PaymentRestController : /rest-basket/ showBasketContents() returning. Content follows (unless null)");
		if (basketContents!=null) log().debug(basketContents.toString());
		return new ResponseEntity<BasketContents>(basketContents, HttpStatus.OK);
    }

    
    // Below is a temporary GET variant of the above POSt method: for development and testing purposes only // acToDo 
    @RequestMapping(value = "/rest-basket/", method = RequestMethod.GET)
    public ResponseEntity<BasketContents> showBasketContentsAsGET() {

    	log().debug("PaymentRestController : /rest-basket/ showBasketContentsAsGET() invoked.  ");

    	return showBasketContents("1, 2 ");
    }

    
    //------------------- Retrieve all Historic Transactions (For this Business) --------------------------------------------------

	
	//------------------- next ... a ARE THERE ANY MORE ???  --------------------------------------------------------


}
