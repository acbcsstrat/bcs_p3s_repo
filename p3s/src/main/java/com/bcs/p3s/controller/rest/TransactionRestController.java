package com.bcs.p3s.controller.rest;
 
import java.util.Date;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.PaymentUI;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class TransactionRestController extends Universal {
 
    @Autowired
    TransactionService transactionService;  //Service which will do all data retrieval/manipulation work
 
    
    //------------------- Retrieve All Current Transactions (For this Business) --------------------------------------------------
     
    // Implements API section 3.1
    // v similar to below 3.2, but status must be neither of Completed nor Failed
    @RequestMapping(value = "/rest-current-transactions/", method = RequestMethod.GET)
    public ResponseEntity<List<PaymentUI>> listCurrentTransactionsForBusiness() {
    	long starttime = (new Date()).getTime();
    	String err = "TransactionRestController : /rest-current-transactions/ listCurrentTransactionsForBusiness() ";
		log().debug(err+"invoked.  ");
		List<PaymentUI> paymentUIs = null;
		int numTxns = -1;

    	try {
    		paymentUIs = transactionService.listCurrentTransactionsForBusiness();
    		numTxns = paymentUIs.size();
		} catch (Exception e) {
			logErrorAndContinue("Exception in "+err,e);
			return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    	
		log().debug(err+"returning "+numTxns+" transactions.");
    	log().debug(runtimeMsg(starttime, err));
        return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.OK);
    }

    
    //------------------- Retrieve all Historic Transactions (For this Business) --------------------------------------------------
    
    // Implements API section 3.2
    // v similar to above 3.1, but status must be Completed or Failed
    @RequestMapping(value = "/rest-historic-transactions/", method = RequestMethod.GET)
    public ResponseEntity<List<PaymentUI>> listHistoricTransactionsForBusiness() {
    	long starttime = (new Date()).getTime();
    	String err = "TransactionRestController : /rest-historic-transactions/ listHistoricTransactionsForBusiness() ";
    	log().debug(err+"invoked.  ");
		List<PaymentUI> paymentUIs = null;
		
		try {
			paymentUIs = transactionService.listHistoricTransactionsForBusiness();
		} catch (Exception e) {
			logErrorAndContinue("Exception in "+err,e);
			return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    	
		log().debug(err+"returning "+paymentUIs.size()+" transactions.");
    	log().debug(runtimeMsg(starttime, err));
        return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.OK);
    }

	
	//------------------- next ... a ARE THERE ANY MORE ???  --------------------------------------------------------

    
}