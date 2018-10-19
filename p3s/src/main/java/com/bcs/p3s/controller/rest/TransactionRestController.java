package com.bcs.p3s.controller.rest;
 
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PaymentUI;
import com.bcs.p3s.engine.GenericProcessingEngine;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
 
@RestController
public class TransactionRestController extends Universal {
 
    @Autowired
    TransactionService transactionService;  //Service which will do all data retrieval/manipulation work
 
    
    //------------------- Retrieve All Current Transactions (For this Business) --------------------------------------------------
     
    // Implements API section 3.1
    // v similar to below 3.2, but status must be neither of Completed nor Failed
    @RequestMapping(value = "/rest-current-transactions/", method = RequestMethod.GET)
    public ResponseEntity<List<PaymentUI>> listCurrentTransactionsForBusiness() {
    	String err = "TransactionRestController : /rest-current-transactions/ listCurrentTransactionsForBusiness() ";
		log().debug(err+"invoked.  ");
		List<PaymentUI> paymentUIs = null;

    	try {
    		paymentUIs = transactionService.listCurrentTransactionsForBusiness();
		} catch (Exception e) {
			fail("Exception in "+err,e);
		}
    	
		log().debug(err+"returning "+paymentUIs.size()+" transactions.");
        return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.OK);
    }

    
    //------------------- Retrieve all Historic Transactions (For this Business) --------------------------------------------------
    
    // Implements API section 3.2
    // v similar to above 3.1, but status must be Completed or Failed
    @RequestMapping(value = "/rest-historic-transactions/", method = RequestMethod.GET)
    public ResponseEntity<List<PaymentUI>> listHistoricTransactionsForBusiness() {
    	String err = "TransactionRestController : /rest-historic-transactions/ listHistoricTransactionsForBusiness() ";
    	log().debug(err+"invoked.  ");
		List<PaymentUI> paymentUIs = null;
		
		try {
			paymentUIs = transactionService.listHistoricTransactionsForBusiness();
		} catch (Exception e) {
			fail("Exception in "+err,e);
		}
    	
		log().debug(err+"returning "+paymentUIs.size()+" transactions.");
        return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.OK);
    }

	
	//------------------- next ... a ARE THERE ANY MORE ???  --------------------------------------------------------

    
}