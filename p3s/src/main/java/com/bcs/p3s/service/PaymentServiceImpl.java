package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.PaymentProcessingEngine;
import com.bcs.p3s.engine.PaymentTimingEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;

@Service("PaymentService")
public class PaymentServiceImpl extends ServiceAuthorisationTools implements PaymentService {

	@Autowired
	HttpSession session;

	protected String PREFIX = this.getClass().getName() + " : "; 

	
	// Start of - the methods which implement the prototypes in the Interface

    /** Implements API section 4.1 **/
	public BasketContents showBasketContents(List<Long> patentIds) {

		String err = PREFIX+"showBasketDetails() ";
		checkAreMyPatents(patentIds, err);
		log().debug(err+" invoked ");

		
		BasketContents basketContents = new BasketContents();
		
		try {
			populateBasketContents(basketContents, patentIds);
		}
		catch (Exception e) {
    		// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
    		System.out.println("PaymentServiceImpl showBasketContents() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new RuntimeException(e);
    	}
		return basketContents;
	}

	
	
	
    /** Implements API section 4.2 **/
	public BankTransferPreCommitDetails showBankTransferPreCommitDetails(List<Long> patentIds, BigDecimal totalCostUSDin) {

		String err = PREFIX+"showBankTransferPreCommitDetails() ";
		checkAreMyPatents(patentIds, err);
		checkNotNull(totalCostUSDin, err);
		log().debug(err+" invoked ");

		
		BankTransferPreCommitDetails bankTransferCheckoutPreCommit = new BankTransferPreCommitDetails();
		
		try {
			populateBankTransferPreCommitDetails(bankTransferCheckoutPreCommit, patentIds);

		
			// Check that expected price matches calculated
			BigDecimal expected = totalCostUSDin.setScale(2, BigDecimal.ROUND_CEILING);
			BigDecimal calculated = bankTransferCheckoutPreCommit.getTotalCostUSD().setScale(2, BigDecimal.ROUND_CEILING);
			if (expected.compareTo(calculated) != 0) {
				err += "Expected Total Price differs from calculated. Expected="+expected.toString()+"  calculated="+calculated.toString();
				logM().warn(err);
				logInternalError().warn(err);
				// Abort or Continue (=ignore). Choose (fro initial development) CONTINUE. so no exception   acToDo
			}
		}
		catch (Exception e) {
    		// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
    		System.out.println("PaymentServiceImpl showBankTransferPreCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new RuntimeException(e);
    	}
		return bankTransferCheckoutPreCommit;
	}

	
	

	
    /** Implements API section 4.3 **/
	public BankTransferPostCommitDetails showBankTransferPostCommitDetails(List<Long> patentIds, BigDecimal totalCostUSDin, 
			String billingStreet, String billingCity, String billingState, Long billingZip) {

		String err = PREFIX+"showBankTransferPostCommitDetails() ";
		checkAreMyPatents(patentIds, err);
		checkNotNull(totalCostUSDin, err);
		log().debug(err+" invoked ");
	
		
		BankTransferPostCommitDetails bankTransferPostCommitDetails = new BankTransferPostCommitDetails();
		
		try {
			populateBankTransferPostCommitDetails(bankTransferPostCommitDetails, patentIds);
	
		
			// Check that expected price matches calculated
			BigDecimal expected = totalCostUSDin.setScale(2, BigDecimal.ROUND_CEILING);
			BigDecimal calculated = bankTransferPostCommitDetails.getTotalCostUSD().setScale(2, BigDecimal.ROUND_CEILING);
			if (expected.compareTo(calculated) != 0) {
				err += "Expected Total Price differs from calculated. Expected="+expected.toString()+"  calculated="+calculated.toString();
				logM().warn(err);
				logInternalError().warn(err);
				// Abort or Continue (=ignore). Choose (fro initial development) CONTINUE. so no exception   acToDo
			}
		}
		catch (Exception e) {
			// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
			System.out.println("PaymentServiceImpl showBankTransferPostCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return bankTransferPostCommitDetails;
}


	// End of - the methods which implement the prototypes in the Interface

	
	
	
	
	
	
	
	// Start of - Support methods - NOT exposed through the interface

	protected void populateBasketContents(BasketContents basketContents, List<Long> patentIds) {

		basketContents.setOrderedPatentUIs(new ArrayList<PatentUI>());

		for (Long patid : patentIds) {
			Patent patent = Patent.findPatent(patid);
			if (patent==null) logInternalError().fatal("PaymentServiceImpl populateBasketContents (for showBasketContents) given invalid PatentID of "+patid);
			PatentUI pui = new PatentUI(patent);
			basketContents.getOrderedPatentUIs().add(pui);
		}

//	total cost uses INVENTED data - acToDo
		DummyDataEngine dummy = new DummyDataEngine();
		basketContents.setTotalCostUSD(dummy.inventTotalBasketCost(patentIds));

		
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
	    P3SUser p3sUser = pLoginSession.getUser();
	    Business business = pLoginSession.getBusiness();

	    basketContents.setFirstName(p3sUser.getFirstName());
	    basketContents.setLastName(p3sUser.getLastName());
	    
	    basketContents.setBillingStreet(business.getBillingStreet());
	    basketContents.setBillingCity(business.getBillingCity());
	    basketContents.setBillingState(business.getBillingState());
	    basketContents.setBillingZip(business.getBillingZip());

	    Date now = new Date();
	    basketContents.setDateNowLocalTime(now);
	    String nowUI = new DateUtil().dateToUSStringWithDayOfWeek(now);
	    basketContents.setDateNowLocalTimeUI(nowUI);
	}
	
	
	protected void populateBankTransferPreCommitDetails(BankTransferPreCommitDetails bankTransferPreCommitDetails, List<Long> patentIds) {

		bankTransferPreCommitDetails.setOrderedPatentUIs(new ArrayList<PatentUI>());

		for (Long patid : patentIds) {
			Patent patent = Patent.findPatent(patid);
			if (patent==null) logInternalError().fatal("PaymentServiceImpl populateBankTransferPreCommitDetails given invalid PatentID of "+patid);
			PatentUI pui = new PatentUI(patent);
			bankTransferPreCommitDetails.getOrderedPatentUIs().add(pui);
		}

////	total cost uses INVENTED data - acToDo - until the PatentUIs have price
		DummyDataEngine dummy = new DummyDataEngine();
		bankTransferPreCommitDetails.setTotalCostUSD(dummy.inventTotalBasketCost(patentIds));

		
	    Date now = new Date();
	    bankTransferPreCommitDetails.setDateNowLocalTime(now);
	    String nowUI = new DateUtil().dateToUSStringWithDayOfWeek(now);
	    bankTransferPreCommitDetails.setDateNowLocalTimeUI(nowUI);

	    PaymentTimingEngine timing = new PaymentTimingEngine();
	    Date endDate = timing.whenCustomerFundsMustHaveReachedOurUsAccount(now);
	    bankTransferPreCommitDetails.setTransTargetEndDate(endDate);
	    String endDateUI = new DateUtil().dateToUSStringWithDayOfWeekandTimeandZone(endDate);
	    bankTransferPreCommitDetails.setTransTargetEndDateUI(endDateUI);

	}
	
	

	protected void populateBankTransferPostCommitDetails(BankTransferPostCommitDetails bankTransferPostCommitDetails, List<Long> patentIds) {

		populateBankTransferPreCommitDetails(bankTransferPostCommitDetails, patentIds);

		PaymentProcessingEngine paymentProcessingEngine = new PaymentProcessingEngine();
		String p3sTransRef = paymentProcessingEngine.generateP3sTransRef();
		bankTransferPostCommitDetails.setP3sTransRef(p3sTransRef);

		DummyDataEngine dummy = new DummyDataEngine();
		BankTransferPaymentDetails bankTransferPaymentDetails = dummy.generateBankTransferPaymentDetails();
		bankTransferPostCommitDetails.setBankTransferPaymentDetails(bankTransferPaymentDetails);
		
		String proformaInvoiceUrl = dummy.gimmeAnyInvoiceUrl();
		bankTransferPostCommitDetails.setProformaInvoiceUrl(proformaInvoiceUrl);
		
		String warningMessage = dummy.gimmeEmptyPostPayWarningMessage();
		bankTransferPostCommitDetails.setWarningMessage(warningMessage);

	}
	
	

	// End of - Support methods - NOT exposed through the interface

}
