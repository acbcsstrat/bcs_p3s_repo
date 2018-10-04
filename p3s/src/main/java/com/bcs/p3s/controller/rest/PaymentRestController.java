package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PaymentService;
import com.bcs.p3s.service.PaymentServiceImpl;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
import com.bcs.p3s.wrap.InBasket;


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
    	
    	if ( ! (obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("PaymentRestController : /rest-basket/ showBasketContents() NOT passed String");
    	
    	BasketContents basketContents = null;
    	boolean err = false;
    	
    	try {

    		//In due course, an extractor (like below) should be used here. meanwhile, use DummyDataEngine & classes from com.bcs.p3s.engine.dummyclasses
			ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
			List<Long> patentsInBasket = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs((LinkedHashMap<String,Object>) obby);

			basketContents = paymentService.showBasketContents(patentsInBasket);

		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			
			basketContents = new BasketContents(); // to avoid compile error!
			err = true;
		}

		log().debug("PaymentRestController : /rest-basket/ showBasketContents() returning. Content follows (err="+err+")");
    	if (err) 
    		return new ResponseEntity<BasketContents>(basketContents, HttpStatus.INTERNAL_SERVER_ERROR);
    	else
    		return new ResponseEntity<BasketContents>(basketContents, HttpStatus.OK);
    }

    
    //------------------- Checkout - Bank Transfer prior to Commit --------------------------------------------------

    // Implements API section 4.2
    // Provide details for display in the about-to-Commit-to-bank-transfer page
    //Sending IDs and totalUSDCost
    @RequestMapping(value = "/rest-prepare-banktransfer/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPreCommitDetails> showBankTransferPreCommitDetails(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() invoked.  ");

    	if ( ! (obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() NOT passed String");
    	
    	BankTransferPreCommitDetails bankTransferPreCommitDetails = null;
    	InBasket basketContents = new InBasket();
    	try {

    		/*DummyDataEngine dummy = new DummyDataEngine();
    		Api4dotXdataFromGETworkaround tmp = dummy.getApi42data( (String) obby );*/
    		
    		basketContents = new ExtractSubmittedDataEngine().getBasketContentsFromCheckOutForm(obby);
    		
    		//get the ids from the object
    		
    		
			bankTransferPreCommitDetails = paymentService.showBankTransferPreCommitDetails(basketContents);

    	} catch (Exception e) {
    		StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			
			bankTransferPreCommitDetails = new BankTransferPreCommitDetails(); // to avoid compile error!
		}

  	
		log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() returning. Content follows (unless null)");
		if (bankTransferPreCommitDetails!=null){
			log().debug(bankTransferPreCommitDetails.toString());
			return new ResponseEntity<BankTransferPreCommitDetails>(bankTransferPreCommitDetails, HttpStatus.OK);
		}
		
		else{
			log().debug("Error retrieving Pre Commit details.");
			log().error("Error retrieving Pre Commit details.");
			return new ResponseEntity<BankTransferPreCommitDetails>(bankTransferPreCommitDetails, HttpStatus.INTERNAL_SERVER_ERROR);
		}
			
    }

       
    //------------------- Checkout - Bank Transfer prior to Commit --------------------------------------------------

    // Implements API section 4.3
    // Provide details for display in the have-just-Commited-to-bank-transfer page
    // BankTransferPostCommitDetails name as because the user just commit to the payment even though at back end it is not yet committed
    @RequestMapping(value = "/rest-committed-banktransfer/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPostCommitDetails> showBankTransferPostCommitDetails(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() invoked.  ");

    	if ( ! (obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() NOT passed String");
    	
    	InBasket basketContents = new InBasket();
    	BankTransferPostCommitDetails bankTransferPostCommitDetails = null;
    	try {
    		
    		/*DummyDataEngine dummy = new DummyDataEngine();  // acTidy
    		Api4dotXdataFromGETworkaround tmp = dummy.getApi43data( (String) obby );
*/
    		basketContents = new ExtractSubmittedDataEngine().getBasketContentsPreCommitForm(obby);
    		
    		/**
    		 * Precheck before committing payment : to avoid duplicate payments for same patents from different users of same company
    		 * CHECK :- CHECK WHETHER ALL THE PATENTS ADDED TO THE BASKET IS HAVING A STATUS AS SHOW_PRICE
    		 */
    		List<Long> addedPatentIds = basketContents.getPatentIds();
    		if(!(addedPatentIds.isEmpty())){
    			for(Long eachId : addedPatentIds){
    				Patent patent = Patent.findPatent(eachId);
    				if(!(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(patent.getRenewalStatus()))){
    					log().debug("Patent[" +patent.getId() +"] added to basket has got a RENEWAL STATUS NOT EQUALS SHOW_PRICE. Abort the Payment request.");
    					return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.BAD_REQUEST);  // Pat to display respective error message
    				}
    			}
    		}
    		
			bankTransferPostCommitDetails = paymentService.showBankTransferPostCommitDetails(basketContents);
			
    	} catch (Exception e) {
    		fail("PaymentRestController showBankTransferPostCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION ",e);
			
			bankTransferPostCommitDetails = new BankTransferPostCommitDetails(); // to avoid compile error!
		}

		log().debug("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() returning. Content follows (unless bad)");
    	// Check WarningMessage (if present, is a failure)
    	if (bankTransferPostCommitDetails!=null && bankTransferPostCommitDetails.getWarningMessage()!=null) {
    		String warnMsg = bankTransferPostCommitDetails.getWarningMessage(); 
    		log().debug("Renewal Commit FAILED. WarningMessage is set. Is : "+warnMsg);
    		if (PaymentServiceImpl.PRICE_CHANGED.equals(warnMsg))
    			return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.CONFLICT);
    		else
    			return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
		if (bankTransferPostCommitDetails!=null){
			log().debug(bankTransferPostCommitDetails.toString());
			return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.OK);
		}
		else{
			log().debug("Error retrieving Post Commit Details.");
			log().error("Error retrieving details.");
			return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
    }
   
    

}
