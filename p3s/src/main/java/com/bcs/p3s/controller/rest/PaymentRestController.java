package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.service.PaymentService;
import com.bcs.p3s.util.lang.P3SPriceException;
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

    // tmp workaround for dev testing when FE code not available
    @RequestMapping(value = "/rest-basket-tmpHtmlFormTester/", method = RequestMethod.POST)
    public ResponseEntity<BasketContents> showBasketContentstmpHtmlFormTester(@RequestParam("patentIds") String csv) {
    	log().debug("PaymentRestController : /rest-basket-tmpHtmlFormTester/ showBasketContentstmpHtmlFormTester("+csv+") invoked.  ");
    	List<String> items = Arrays.asList(csv.split("\\s*,\\s*"));
    	List<Integer> longList = new ArrayList<Integer>();
		for (String str : items) {
			Integer iii = new Integer(str.trim());
			longList.add(iii);
		}
    	LinkedHashMap<String,Object> obby = new LinkedHashMap<String,Object>();
    	obby.put("elements", longList);
    	return showBasketContents(obby);  // call the REAL controller method (just below), now we've assembled params as required 
    }

    	
    	
    // Implements API section 4.1
    // Provide details for display in the Show Basket page
    @RequestMapping(value = "/rest-basket/", method = RequestMethod.POST)
    public ResponseEntity<BasketContents> showBasketContents(@RequestBody Object obby) {

    	log().debug("PaymentRestController : /rest-basket/ showBasketContents() invoked.  ");
    	
    	if ( ! (obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("PaymentRestController : /rest-basket/ showBasketContents() NOT passed LinkedHashMap<?, ?>");
    	
    	BasketContents basketContents = null;
    	boolean err = false;
    	
    	try {

    		//In due course, an extractor (like below) should be used here. meanwhile, use DummyDataEngine & classes from com.bcs.p3s.engine.dummyclasses
			ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
			//List<Long> patentsInBasket = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs((LinkedHashMap<String,Object>) obby);
			List<Long> patentsInBasket = extractor.extractBasketRequestPatentIds(obby);
			
			
			basketContents = paymentService.showBasketContents(patentsInBasket);

		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			
			basketContents = new BasketContents(); // to avoid compile error!
			err = true;
		}

		log().debug("doubleProcFee9 debug follows");
		log().debug("totProcfee = "+basketContents.getTotalProcessingFeesUSD());
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
    		
    		log().debug("acTodo z2.1 monitor (paymentService==null) is "+(paymentService==null));
    		log().debug("Check for below. (basketContents==null) is "+(basketContents==null));
    		log().debug("Displaying Checkout Page: former FE bug. ((basketContents.getExpectedCost())==null) is "+((basketContents.getExpectedCost())==null));
			bankTransferPreCommitDetails = paymentService.showBankTransferPreCommitDetails(basketContents);

    	} catch (Exception e) {
    		StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			
			//bankTransferPreCommitDetails = new BankTransferPreCommitDetails(); // to avoid compile error!
			bankTransferPreCommitDetails = null;
		}

  	
		log().debug("PaymentRestController : /rest-prepare-banktransfer/ showBankTransferPreCommitDetails() returning. Content follows (unless null)");
		if (bankTransferPreCommitDetails==null) {
			log().error("Error retrieving Pre Commit details.");
			return new ResponseEntity<BankTransferPreCommitDetails>(bankTransferPreCommitDetails, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		else{
			log().debug(bankTransferPreCommitDetails.toString());
			return new ResponseEntity<BankTransferPreCommitDetails>(bankTransferPreCommitDetails, HttpStatus.OK);
		}
			
    }

       
    //------------------- Checkout - Bank Transfer prior to Commit --------------------------------------------------

    // tmp workaround for dev testing when FE code not available
    @RequestMapping(value = "/rest-committed-banktransfer-tmpHtmlFormTester/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPostCommitDetails> showBankTransferPostCommitDetailstmpHtmlFormTester(@RequestParam("patentIds") String csv
    		, @RequestParam("totCost") String strTotCost) {
    	log().debug("PaymentRestController : /rest-committed-banktransfer-tmpHtmlFormTester/ showBankTransferPostCommitDetailstmpHtmlFormTester("+csv+") invoked.  ");
    	List<String> items = Arrays.asList(csv.split("\\s*,\\s*"));
    	List<Integer> longList = new ArrayList<Integer>();
    	LinkedHashMap<String,Object> obby = new LinkedHashMap<String,Object>();
		for (String str : items) { longList.add(new Integer(str)); }
    	obby.put("patent_ids", longList);
    	obby.put("totalCostUSD", new Double(strTotCost));
    	obby.put("isBillingAddressSame", "false"); // suspect this is ignored
    	obby.put("billingStreet", "Threadneedle Street");
    	obby.put("billingCity", "London");
    	obby.put("billingState", "CA");
    	obby.put("billingZip", "54321");
    	return showBankTransferPostCommitDetails(obby);  // call the REAL controller method (just below), now we've assembled params as required 
    }

    	
    // Implements API section 4.3
    // Provide details for display in the have-just-Commited-to-bank-transfer page
    // BankTransferPostCommitDetails name as because the user just commit to the payment even though at back end it is not yet committed
    @RequestMapping(value = "/rest-committed-banktransfer/", method = RequestMethod.POST)
    public ResponseEntity<BankTransferPostCommitDetails> showBankTransferPostCommitDetails(@RequestBody Object obby) {
    	long starttime = (new Date()).getTime();
  	
    	String msg = "PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() ";
    	log().debug(msg+"invoked.  ");
    	String warningMessage = null;
    	
    	if ( ! (obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("PaymentRestController : /rest-committed-banktransfer/ showBankTransferPostCommitDetails() NOT passed String");
    	
    	InBasket basketContents = new InBasket();
    	BankTransferPostCommitDetails bankTransferPostCommitDetails = null;
    	try {
    		
    		basketContents = new ExtractSubmittedDataEngine().getBasketContentsPreCommitForm(obby);
    		
			bankTransferPostCommitDetails = paymentService.showBankTransferPostCommitDetails(basketContents);

    	} catch (P3SPriceException pricing) {
    		logErrorAndContinue(msg+"Suffered PRICING EXCEPTION ",pricing);
    		return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.CONFLICT);
    	} catch (Exception e) {
    		logErrorAndContinue(msg+"Suffered UNEXPECTED EXCEPTION ",e);
			return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    	}

		log().debug("COMMITment call /rest-committed-banktransfer/ appears to have succeeded. bankTransferPostCommitDetails.toString() follows: \n"+bankTransferPostCommitDetails.toString());
		log().debug("END of toString of bankTransferPostCommitDetails");
		log().debug("COMMITment call /rest-committed-banktransfer/ Completed");

    	log().debug(runtimeMsg(starttime, msg));
		return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.OK);
    }

}
