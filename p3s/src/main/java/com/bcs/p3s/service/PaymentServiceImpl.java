package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.InvoiceProcessingEngine;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.PaymentProcessingEngine;
import com.bcs.p3s.engine.PaymentTimingEngine;
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
import com.bcs.p3s.wrap.InBasket;
import com.bcs.p3s.wrap.PatentExtendedData;

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
	public BankTransferPreCommitDetails showBankTransferPreCommitDetails(InBasket basket) {

		String err = PREFIX+"showBankTransferPreCommitDetails() ";
		BigDecimal latestCalculatedCost = new BigDecimal("0.0");
		checkAreMyPatents(basket.getPatentIds(), err);
		checkNotNull(basket.getExpectedCost(), err);
		log().debug(err+" invoked ");

		PostLoginDataEngine recalculateEngine = new PostLoginDataEngine();
		BankTransferPreCommitDetails bankTransferCheckoutPreCommit = new BankTransferPreCommitDetails();
		
		try {
			//populateBankTransferPreCommitDetails(bankTransferCheckoutPreCommit, basket.getPatentIds());

			/**
			 * RECALCULATE THE RENEWAL COSTS AGAIN AGAIN
			 * Calling the same method that we are calling as part of POST Login calculations - getExtendedPatentData(session)
			 * 	recalculating all patent data and restore that in session
			 */
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			if(pLoginSession == null){
				//MP to add logs
				return null;
			}
			pLoginSession = recalculateEngine.getExtendedPatentData(pLoginSession);
			
			//add up the cost for the patents in the basket
			
			if(!(pLoginSession.getExtendedPatentUI() == null) ){
				
				List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
				for(PatentExtendedData eachSessionData : sessionData){
					if(basket.getPatentIds().contains(eachSessionData.getPatentId())){
						latestCalculatedCost = latestCalculatedCost .add(eachSessionData.getCurrentRenewalCost());
					}
				}
				bankTransferCheckoutPreCommit.setTotalCostUSD(latestCalculatedCost);
			}
			
			
			bankTransferCheckoutPreCommit = populateBankTransferPreCommitDetails(bankTransferCheckoutPreCommit, basket.getPatentIds());
			// Check that expected price matches calculated
			BigDecimal expected = basket.getExpectedCost().setScale(2, BigDecimal.ROUND_CEILING);
			//BigDecimal calculated = bankTransferCheckoutPreCommit.getTotalCostUSD().setScale(2, BigDecimal.ROUND_CEILING);
			
			BigDecimal calculated = latestCalculatedCost.setScale(2, BigDecimal.ROUND_CEILING);
			
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
	public BankTransferPostCommitDetails showBankTransferPostCommitDetails(InBasket basket) {

		String err = PREFIX+"showBankTransferPostCommitDetails() ";
		BigDecimal latestCalculatedCost = new BigDecimal("0.0");
		Fee committedFee = null;
		//checkAreMyPatents(patentIds, err);
		checkAreMyPatents(basket.getPatentIds(), err);
		//checkNotNull(totalCostUSDin, err);
		checkNotNull(basket.getExpectedCost(), err);
		log().debug(err+" invoked ");
	
		PostLoginDataEngine recalculateEngine = new PostLoginDataEngine();
		BankTransferPostCommitDetails bankTransferPostCommitDetails = new BankTransferPostCommitDetails();
		
		try {
			populateBankTransferPostCommitDetails(bankTransferPostCommitDetails, basket.getPatentIds());
	
			/**
			 * RECALCULATE THE RENEWAL COSTS AGAIN AGAIN
			 * Calling the same method that we are calling as part of POST Login calculations - getExtendedPatentData(session)
			 * 	recalculating all patent data and restore that in session
			 */
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			if(pLoginSession == null){
				//MP to add logs
				return null;
			}
			pLoginSession = recalculateEngine.getExtendedPatentData(pLoginSession);
			
			//add up the cost for the patents in the basket
			
			if(!(pLoginSession.getExtendedPatentUI() == null) ){
				
				List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
				for(PatentExtendedData eachSessionData : sessionData){
					if(basket.getPatentIds().contains(eachSessionData.getPatentId())){
						latestCalculatedCost = latestCalculatedCost .add(eachSessionData.getCurrentRenewalCost());
						committedFee = eachSessionData.getFee();
					}
				}
				bankTransferPostCommitDetails.setTotalCostUSD(latestCalculatedCost);
			}
		
			// Check that expected price matches calculated
			BigDecimal expected = basket.getExpectedCost().setScale(2, BigDecimal.ROUND_CEILING);
			BigDecimal calculated = bankTransferPostCommitDetails.getTotalCostUSD().setScale(2, BigDecimal.ROUND_CEILING);
			if (expected.compareTo(calculated) != 0) {
				err += "Expected Total Price differs from calculated. Expected="+expected.toString()+"  calculated="+calculated.toString();
				logM().warn(err);
				logInternalError().warn(err);
				// Abort or Continue (=ignore). Choose (fro initial development) CONTINUE. so no exception   acToDo
			}
			
			/**
			 * All checks completed , now do the persist
			 * 	a. Insert into Fee table with renewalId as null
			 * 	b. Insert into Invoice table with paymentId as null
			 * 	c. Insert into Payment table 
			 * 	d. Insert into Renewal table
			 * 	e. Update Fee table with the current renewalId
			 * 	f. Update Invoice table with current paymentId
			 * 	c. If above db operations success, then update Patent with renewal_status as RENEWAL IN PLACE
			 */ 
			
			//commitTransaction(bankTransferPostCommitDetails,committedFee);
			
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
		
		/**
		 * RECALCULATE THE RENEWAL COSTS AGAIN AGAIN
		 * Calling the same method that we are calling as part of POST Login calculations - getExtendedPatentData(session)
		 * 	recalculating all patent data and restore that in session
		 */
		PostLoginDataEngine recalculateEngine = new PostLoginDataEngine();
		BigDecimal latestCalculatedCost = new BigDecimal("0.0");
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		if(pLoginSession == null){
			//MP to add logs
			return ;
		}
		pLoginSession = recalculateEngine.getExtendedPatentData(pLoginSession);
		
		//add up the cost for the patents in the basket
		
		if(!(pLoginSession.getExtendedPatentUI() == null) ){
			
			List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
			for(PatentExtendedData eachSessionData : sessionData){
				if(patentIds.contains(eachSessionData.getPatentId())){
					latestCalculatedCost = latestCalculatedCost .add(eachSessionData.getCurrentRenewalCost());
				}
			}
			basketContents.setTotalCostUSD(latestCalculatedCost.setScale(2, BigDecimal.ROUND_CEILING));
		}
		

		List<PatentExtendedData> extendedData = pLoginSession.getExtendedPatentUI();
		
		for (Long patid : patentIds) {
			Patent patent = Patent.findPatent(patid);
			if (patent==null) logInternalError().fatal("PaymentServiceImpl populateBasketContents (for showBasketContents) given invalid PatentID of "+patid);
			PatentUI pui = new PatentUI(patent, extendedData);
			basketContents.getOrderedPatentUIs().add(pui);
		}

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
	
	
	protected BankTransferPreCommitDetails populateBankTransferPreCommitDetails(BankTransferPreCommitDetails bankTransferPreCommitDetails, List<Long> patentIds) {

		bankTransferPreCommitDetails.setOrderedPatentUIs(new ArrayList<PatentUI>());

		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> extendedData = pLoginSession.getExtendedPatentUI();
		
		for (Long patid : patentIds) {
			Patent patent = Patent.findPatent(patid);
			if (patent==null) logInternalError().fatal("PaymentServiceImpl populateBankTransferPreCommitDetails given invalid PatentID of "+patid);
			PatentUI pui = new PatentUI(patent,extendedData);
			bankTransferPreCommitDetails.getOrderedPatentUIs().add(pui);
		}
		
	    Date now = new Date();
	    bankTransferPreCommitDetails.setDateNowLocalTime(now);
	    String nowUI = new DateUtil().dateToUSStringWithDayOfWeek(now);
	    bankTransferPreCommitDetails.setDateNowLocalTimeUI(nowUI);

	    PaymentTimingEngine timing = new PaymentTimingEngine();
	    Date endDate = timing.whenCustomerFundsMustHaveReachedOurUsAccount(now);
	    bankTransferPreCommitDetails.setTransTargetEndDate(endDate);
	    String endDateUI = new DateUtil().dateToUSStringWithDayOfWeekandTimeandZone(endDate);
	    bankTransferPreCommitDetails.setTransTargetEndDateUI(endDateUI);
	    
	    return bankTransferPreCommitDetails;

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
	
	/**
	 * 
	 * @param bankTransferPostCommitDetails
	 * @param fee
	 */
	
	protected Boolean commitTransaction(BankTransferPostCommitDetails commitTransaction, Fee fee){
		
		String msg = PREFIX+"commitTransaction("+commitTransaction+","+fee+ ") ";
		Invoice invoice = new Invoice();
		InvoiceProcessingEngine invoiceEngine = new InvoiceProcessingEngine();
		Boolean dbSuccess = true;
		log().debug(msg +" invoked ");
		
		//a. Insert into Fee Table
		if(!(fee == null)){
			fee.persist();
			log().debug("Persisted Fee Table successfully " + msg);
		}
		else{
			dbSuccess = false;
			log().debug("Fee Table persistence failed " + msg);
			log().error("Fee Table persistence failed " + msg);
			return dbSuccess;
		}
		
		//b.Insert into invoice
		invoice = invoiceEngine.populateInvoiceData(commitTransaction); 
		if(!(invoice == null)){
			invoice.persist();
			log().debug("Persisted Invoice Table successfully " + msg);
		}
		else{
			dbSuccess = false;
			log().debug("Invoice Table persistence failed " + msg);
			log().error("Invoice Table persistence failed " + msg);
			return dbSuccess;
		}
		
		//c.Insert into Payment
		
		if(dbSuccess){
			
		}
		
		return dbSuccess;
			
	}
	
	/**
	 * 
	 * @param bankTransferPostCommitDetails
	 * @return
	 */
	
	protected Payment populatePaymentData(BankTransferPostCommitDetails bankTransferPostCommitDetails){
		
		Payment payment = new Payment();
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		P3SUser user = pLoginSession.getUser();
		payment.setP3S_TransRef(bankTransferPostCommitDetails.getP3sTransRef());
		payment.setTransType(PaymentTypeEnum.BANK_TRANSFER);  //inside this method every time Bank Transfer until we provide CC payment option
		payment.setIsBillingAddressSame(true); //hardcoded.Need to be changed once UI send the data..missing in API 4.1
		payment.setInitiatedByUserId(user);
		payment.setTransStartDate(bankTransferPostCommitDetails.getDateNowLocalTime());
		payment.setTransTargetEndDate(bankTransferPostCommitDetails.getTransTargetEndDate());
		payment.setLatestTransStatus(PaymentStatusEnum.INITIATED);
		payment.setLastUpdatedDate(Calendar.getInstance().getTime());
		
		
		return payment;
	}
	
	

	// End of - Support methods - NOT exposed through the interface

}
