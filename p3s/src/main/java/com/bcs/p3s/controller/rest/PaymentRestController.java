package com.bcs.p3s.controller.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.service.PaymentService;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
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
			
			basketContents = paymentService.showBasketContents(patentsInBasket);
			   	

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

    

    //------------------- Checkout – Bank Transfer prior to Commit --------------------------------------------------

    // Implements API section 4.2
    // Provide details for display in the about-to-Commit-to-bank-transfer page
    @RequestMapping(value = "/rest-prepare-banktransfer/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPreCommitDetails> showBankTransferPreCommitDetails(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() invoked.  ");

    	if ( ! (obby instanceof String)) throw new P3SRuntimeException("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() NOT passed String");
    	
    	BankTransferPreCommitDetails bankTransferPreCommitDetails;
    	try {
    		
			ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
			List<Long> patentsInBasket = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs( (String) obby);
			
			DummyDataEngine dummy = new DummyDataEngine();
			BigDecimal expectedCost = dummy.inventExpectedCost();
			
			bankTransferPreCommitDetails = paymentService.showBankTransferPreCommitDetails(patentsInBasket, expectedCost);

    	} catch (Exception e) {
			System.out.println("PaymentRestController showBankTransferPreCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION ");
			System.out.println(e.getMessage());
			e.printStackTrace();
			
			bankTransferPreCommitDetails = new BankTransferPreCommitDetails(); // to avoid compile error!
		}

  	
		log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() returning. Content follows (unless null)");
		if (bankTransferPreCommitDetails!=null) log().debug(bankTransferPreCommitDetails.toString());
		return new ResponseEntity<BankTransferPreCommitDetails>(bankTransferPreCommitDetails, HttpStatus.OK);
    }

    
    // Below is a temporary GET variant of the above POSt method: for development and testing purposes only // acToDo 
    @RequestMapping(value = "/rest-prepare-banktransfer/", method = RequestMethod.GET)
    public ResponseEntity<BankTransferPreCommitDetails> showBankTransferPreCommitDetailsAsGET() {

    	log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetailsAsGET() invoked.  ");

    	return showBankTransferPreCommitDetails("1, 2 ");
    }

    
    
    
    //------------------- Checkout – Bank Transfer prior to Commit --------------------------------------------------

    // Implements API section 4.3
    // Provide details for display in the have-just-Commited-to-bank-transfer page
    @RequestMapping(value = "/rest-committed-banktransfer/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPostCommitDetails> showBankTransferPostCommitDetails(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() invoked.  ");

    	if ( ! (obby instanceof String)) throw new P3SRuntimeException("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() NOT passed String");
    	
    	BankTransferPostCommitDetails bankTransferPostCommitDetails;
    	try {
    		
			ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
			List<Long> patentsInBasket = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs( (String) obby);
			
			DummyDataEngine dummy = new DummyDataEngine();
			BigDecimal expectedCost = dummy.inventExpectedCost();
			
			bankTransferPostCommitDetails = paymentService.showBankTransferPostCommitDetails(patentsInBasket, expectedCost 
					, dummy.genericDummyBillingAddressLine() 
					, dummy.genericDummyBillingAddressLine() 
					, dummy.genericDummyBillingAddressLine() 
					, dummy.genericDummyBillingAddressZip()  
			); 

			
    	} catch (Exception e) {
			System.out.println("PaymentRestController showBankTransferPostCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION ");
			System.out.println(e.getMessage());
			e.printStackTrace();
			
			bankTransferPostCommitDetails = new BankTransferPostCommitDetails(); // to avoid compile error!
		}

  	
		log().debug("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() returning. Content follows (unless null)");
		if (bankTransferPostCommitDetails!=null) log().debug(bankTransferPostCommitDetails.toString());
		return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.OK);
    }

    
    // Below is a temporary GET variant of the above POSt method: for development and testing purposes only // acToDo 
    @RequestMapping(value = "/rest-committed-banktransfer/", method = RequestMethod.GET)
    public ResponseEntity<BankTransferPostCommitDetails> showBankTransferPostCommitDetailsAsGET() {

    	log().debug("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetailsAsGET() invoked.  ");

    	return showBankTransferPostCommitDetails("1, 2 ");
    }

    
    
    
	//------------------- next ... a ARE THERE ANY MORE ???  --------------------------------------------------------


}
