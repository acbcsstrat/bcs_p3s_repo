package com.bcs.p3s.controller.rest;
 
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
import com.bcs.p3s.engine.TemporaryProcessingEngine;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class TransactionRestController extends Universal {
 
    @Autowired
    TransactionService transactionService;  //Service which will do all data retrieval/manipulation work
 
    
    //------------------- Retrieve All Current Transactions (For this Business) --------------------------------------------------
     
    // Implements API section 3.1 - xxx

    
    //------------------- Retrieve all Historic Transactions (For this Business) --------------------------------------------------
    
    // Implements API section 3.2
    // v similar to above 3.1, but status must be Completed or Failed
    @RequestMapping(value = "/rest-historic-transactions/", method = RequestMethod.GET)
    public ResponseEntity<List<PaymentUI>> listAllPaymentUIsForBusiness() {
		log().debug("TransactionRestController : /rest-historic-transactions/ listAllPaymentUIsForBusiness() invoked.  ");

    	List<PaymentUI> paymentUIs = transactionService.listAllPaymentUIsForMyBusiness();
    	
		log().debug("TransactionRestController : /rest-historic-transactions/ listAllPatentUIsForBusiness() returning "+paymentUIs.size()+" transactions.");
        return new ResponseEntity<List<PaymentUI>>(paymentUIs, HttpStatus.OK);
    }

	
	//------------------- next ... a ARE THERE ANY MORE ???  --------------------------------------------------------

    
}