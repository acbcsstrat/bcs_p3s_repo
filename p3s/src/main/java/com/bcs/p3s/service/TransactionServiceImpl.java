package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PaymentUI;
import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.PatentExtendedData;

@Service("TransactionService")
public class TransactionServiceImpl extends ServiceAuthorisationTools implements TransactionService {

	protected String PREFIX = this.getClass().getName() + " : "; 


	// Start of - the methods which implement the prototypes in the Interface

	public List<PaymentUI> listCurrentTransactionsForBusiness() {

		String err = PREFIX+"listCurrentTransactionsForBusiness() ";
		checkNoActionRequired(err);
		log().debug(err+" invoked ");
    	
		List<PaymentUI> result = new ArrayList<PaymentUI>(); 
		List<PaymentUI> payuis = listAllTransactionsForMyBusiness();
		for (PaymentUI aPayUI : payuis) {
			if ( ! aPayUI.isHistoric()) {
				result.add(aPayUI);
			}
		}
		log().debug(err+" returns "+result.size()+" Transactions");
		return result; 
	}
	
	public List<PaymentUI> listHistoricTransactionsForBusiness() {

		String err = PREFIX+"listHistoricTransactionsForBusiness() ";
		checkNoActionRequired(err);
		log().debug(err+" invoked ");
    	
		List<PaymentUI> result = new ArrayList<PaymentUI>(); 
		List<PaymentUI> payuis = listAllTransactionsForMyBusiness();
		for (PaymentUI aPayUI : payuis) {
			if (aPayUI.isHistoric()) {
				result.add(aPayUI);
			}
		}
		log().debug(err+" returns "+result.size()+" Transactions");
		return result; 
	}

	
	// End of - the methods which implement the prototypes in the Interface

	// Start of - Support methods - NOT exposed through the interface

	protected List<PaymentUI> listAllTransactionsForMyBusiness() {  // Regardless of current or historic

		String err = PREFIX+"listAllTransactionsForMyBusiness() ";
		log().debug(err+" invoked ");

		List<Payment> payments = null;
		List<PatentExtendedData> sessionData = null;
    	if(session != null){
    		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
    		sessionData = pLoginSession.getExtendedPatentUI();
    		payments = Payment.findPaymentsByBusiness(pLoginSession.getBusiness());
	    	System.out.println("TransactionServiceImpl : listAllTransactionsForMyBusiness() ret Qty "+payments.size());
    	}
    	else logInternalError().fatal("TransactionServiceImpl : listAllTransactionsForMyBusiness() has empty session");

		List<PaymentUI> paymentUIs = new ArrayList<PaymentUI>();
		for (Payment transaction : payments) {
			PaymentUI payui = new PaymentUI(transaction,sessionData); 

			// inhibit Json serialisation of large, unwanted data
			payui.setRenewals(null);
			payui.setEpcts(null);

			paymentUIs.add(payui);
		}
		// AC 170726 - right now, unable to fully populate PatentUI - needs thos extra 4 fields - acToDo
		return paymentUIs; 
	}
	
	
	// End of - Support methods - NOT exposed through the interface

	
	
	protected List<Patent> listAllPatentsForMyBusiness() { 
    	
    /** MP170620 Code changes for implementing session starts **/	
    	List<Patent> patents = null;
    	if(session != null){
    		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
    	
    	 	
	    	TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(pLoginSession.getBusiness());
	    	patents = tq_patents.getResultList();
	    	
	    	System.out.println("PatentServiceImpl : listAllPatentsForMyBusiness() ret Qty "+patents.size());
        
    	}
    	else logInternalError().fatal("PatentServiceImpl : listAllPatentsForMyBusiness() has empty session");
    	
    /** MP170620 Code changes for implementing session ends **/	
    	
    	return patents;
	}
	

	

}
