package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.InvoiceProcessingEngine;
import com.bcs.p3s.engine.CommitToRenewalEngine;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.OrderProcessingEngine;
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
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyNames;
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
			
			
			bankTransferCheckoutPreCommit = populateBankTransferPreCommitDetails(bankTransferCheckoutPreCommit, basket);
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
		Payment currentPayment = new Payment();
		OrderProcessingEngine orders = new OrderProcessingEngine();
		BigDecimal latestCalculatedCost = new BigDecimal("0.0");
		List<Fee> committedFee = new ArrayList<Fee>();
		//checkAreMyPatents(patentIds, err);
		checkAreMyPatents(basket.getPatentIds(), err);
		//checkNotNull(totalCostUSDin, err);
		checkNotNull(basket.getExpectedCost(), err);
		log().debug(err+" invoked ");
	
		PostLoginDataEngine recalculateEngine = new PostLoginDataEngine();
		BankTransferPostCommitDetails bankTransferPostCommitDetails = new BankTransferPostCommitDetails();
		
		try {
			
			//not p3sTRansRef this time
			populateBankTransferPostCommitDetails(bankTransferPostCommitDetails, basket);
	
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
						committedFee.add(eachSessionData.getFee());
					}
				}
				bankTransferPostCommitDetails.setTotalCostUSD(latestCalculatedCost);
			}
			/*//finally generate the p3sTransRef
			CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
			String p3sTransRef = commitToRenewal.generateP3sTransRef(pLoginSession);
			bankTransferPostCommitDetails.setP3sTransRef(p3sTransRef);*/
		
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
			 * 	a. Insert into Invoice table with paymentId as null
			 * 	b. Insert into Payment table  with the current invoice Id
			 *  c. Insert into Fee table with renewalId as null
			 * 	d. Insert into Renewal table with the current feeId
			 *  e. Update payment_renewals join table with renewals
			 * 	f. Update Fee table with the current renewalId
			 * 	g. Update Invoice table with current paymentId
			 * 	h. If above db operations success, then update Patent with renewal_status as Payment In Progress
			 */ 
			
			currentPayment = commitTransaction(bankTransferPostCommitDetails,committedFee);
			//create and send the orders file to MC -- to do MP <<<<IMP NOTE !!!!>>>>
			if(!(currentPayment == null))

				// orders.createOrderCsv(currentPayment);
				notYet("Writing SFTP file to SFTP site is inhibited for now: PaymentServiceImpl line 227");
			
			else{
				err += "Order file not created. Payment is null from commitTransaction(" + bankTransferPostCommitDetails +"," + committedFee +")";
				logM().error(err);
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
					latestCalculatedCost = latestCalculatedCost.add(eachSessionData.getCurrentRenewalCost());
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
	
	
	protected BankTransferPreCommitDetails populateBankTransferPreCommitDetails(BankTransferPreCommitDetails bankTransferPreCommitDetails, InBasket basket) {

		bankTransferPreCommitDetails.setOrderedPatentUIs(new ArrayList<PatentUI>());

		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> extendedData = pLoginSession.getExtendedPatentUI();
		
		for (Long patid : basket.getPatentIds()) {
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
	
	

	protected void populateBankTransferPostCommitDetails(BankTransferPostCommitDetails bankTransferPostCommitDetails, InBasket basket) {

		populateBankTransferPreCommitDetails(bankTransferPostCommitDetails, basket);

		/*CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
		String p3sTransRef = commitToRenewal.generateP3sTransRef(bankTransferPostCommitDetails);
		bankTransferPostCommitDetails.setP3sTransRef(p3sTransRef);*/

		DummyDataEngine dummy = new DummyDataEngine();
		BankTransferPaymentDetails bankTransferPaymentDetails = dummy.generateBankTransferPaymentDetails();
		bankTransferPostCommitDetails.setBankTransferPaymentDetails(bankTransferPaymentDetails);
		
		String proformaInvoiceUrl = dummy.gimmeAnyInvoiceUrl();
		bankTransferPostCommitDetails.setProformaInvoiceUrl(proformaInvoiceUrl);
		
		String warningMessage = dummy.gimmeEmptyPostPayWarningMessage();
		bankTransferPostCommitDetails.setWarningMessage(warningMessage);
		

	    //set the address details
	   bankTransferPostCommitDetails.setBillingCity(basket.getBillingCity());
	   bankTransferPostCommitDetails.setBillingState(basket.getBillingState());
	   bankTransferPostCommitDetails.setBillingStreet(basket.getBillingStreet());
	   bankTransferPostCommitDetails.setBillingZip(basket.getBillingZip());

	}
	
	/**
	 * 
	 * @param bankTransferPostCommitDetails
	 * @param fee
	 */
	
	protected Payment commitTransaction(BankTransferPostCommitDetails commitTransaction, List<Fee> fee){
		
		String msg = PREFIX+"commitTransaction("+commitTransaction+","+fee+ ") ";
		Invoice invoice = new Invoice();
		Payment payment = new Payment();
		Fee currentFee = null;
		Invoice currentInvoice = new Invoice();
		Payment currentPayment = new Payment();
		Renewal currentRenewal = new Renewal();
		InvoiceProcessingEngine invoiceEngine = new InvoiceProcessingEngine();
		Boolean dbSuccess = true;
		log().debug(msg +" invoked ");
		
		List<Renewal> renewal_payment = new ArrayList<Renewal>();
		List<PatentUI> orderedPatents = commitTransaction.getOrderedPatentUIs();
//a.Insert into invoice
		invoice = invoiceEngine.populateInvoiceData(commitTransaction); 
		if(!(invoice == null)){
			currentInvoice = invoice.persist();
			if(currentInvoice == null){
				dbSuccess = false;
				log().debug("Invoice Table persistence failed " + msg);
				log().error("Invoice Table persistence failed " + msg);
				return payment;
			}
			else {
				Invoice newInvoice = Invoice.findInvoice(invoice.getId());
				String invoiceNumber = invoiceEngine.generateProFormaInvoiceNumber(newInvoice); 
				newInvoice.setInvoiceNumber(invoiceNumber);
				newInvoice.merge();
				
				log().debug("Persisted Invoice Table. " + msg + "and returned invoice details with id as " + invoice.getId()
				+ ", Invoice Number "+invoice.getInvoiceNumber());
			}
				//payment.setLatestInvoice(currentInvoice);
		}
		
		else{
			dbSuccess = false;
			log().debug("Invoice Table persistence failed " + msg);
			log().error("Invoice Table persistence failed " + msg);
			return payment;
		}
		
//b.Insert into Payment
		payment = populatePaymentData(commitTransaction);
		payment.setLatestInvoice(currentInvoice);
		if(!(payment == null)){
			currentPayment = payment.persist();
			log().debug("Persisted Payment Table successfully " + msg + "and returned payment details with id as " + payment.getId());
			currentInvoice.setPayment(currentPayment);
			 
			if(currentPayment == null){
				dbSuccess = false;
				log().debug("Payment Table persistence failed " + msg);
				log().error("Payment Table persistence failed " + msg);
				return payment;
			}
			
			CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
			String p3sTransRef = commitToRenewal.generateP3sTransRef(currentPayment);
			currentPayment.setP3S_TransRef(p3sTransRef);
			currentPayment.merge();
			logChangeOfStatus().debug("Transaction " + currentPayment.getP3S_TransRef() + " created with " + orderedPatents.size() +" patents ");
			
			//setting the generated p3s Ref to BankTransferPostCommitDetails - this object we are sending back to FE for displaying on final Payment page
			commitTransaction.setP3sTransRef(currentPayment.getP3S_TransRef());
		}
		

		/**
		 * Each transaction may have multiple patents. So loop through each in orderedPatentIds and get the details from session
		 */
		
		for(PatentUI eachPatent : orderedPatents){
			
			Renewal renewal = new Renewal();
			renewal = populateRenewalData(commitTransaction,eachPatent);
			//c. Insert into Fee Table
			if(!(fee == null)){
				currentFee = renewal.getFee().persist();
				if(currentFee == null){
					dbSuccess = false;
					log().debug("Fee Table persistence failed " + msg);
					log().error("Fee Table persistence failed " + msg);
					return payment;
				}
				log().debug("Persisted Fee Table successfully " + msg);
			}
			else{
				dbSuccess = false;
				log().debug("Fee Table persistence failed " + msg);
				log().error("Fee Table persistence failed " + msg);
				return payment;
			}
			
			//d.Insert into Renewal
			
			renewal.setActivePaymentId(currentPayment);
			renewal.setFee(currentFee);
			currentRenewal = renewal.persist();
			currentFee.setRenewal(currentRenewal);
			renewal_payment.add(currentRenewal);
			log().debug("Persisted Renewal Table successfully " + msg + "and returned renewal details with id as " + renewal.getId());
			
			if(currentRenewal == null){
				dbSuccess = false;
				log().debug("Renewal Table persistence failed " + msg);
				log().error("Renewal Table persistence failed " + msg);
				return payment;
			}
		
		}
//e.Update payment_renewal table
		if(!(renewal_payment == null)){
			payment.setRenewals(renewal_payment);
			payment.merge();
			log().debug("payment_renewals join table persisted with "+ renewal_payment.size() +" renewal(s)");
		}
//f.Update currentFee Table with currentRenewal
		if(!(currentFee == null)){
			currentFee.merge();
			log().debug("Fee table updated with renewal id as "+ currentRenewal.getId());
		}
		
		
//g.Update currentInvoice Table with currentPayment
		if(!(currentInvoice == null)){
			currentInvoice.merge(); 
			log().debug("Invoice table updated with payment id as "+ currentPayment.getId());
		}

//g. Update Patent table for all ordered Patents
		if(dbSuccess){
			for(PatentUI eachPatent : orderedPatents){
				Patent patent = Patent.findPatent(eachPatent.getId());
				patent.setRenewalStatus(currentRenewal.getRenewalStatus());
				patent.merge();
			}
			
		}
		
		return payment;
			
	}
	
	/**
	 * a method to set all payment proprties except latestInvoice (latestInvoice being set inside persist() of invoice table
	 * @param bankTransferPostCommitDetails
	 * @return
	 */
	
	protected Payment populatePaymentData(BankTransferPostCommitDetails bankTransferPostCommitDetails){
		
		Payment payment = new Payment();
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		P3SUser user = pLoginSession.getUser();
		payment.setP3S_TransRef(bankTransferPostCommitDetails.getP3sTransRef());
		//MP to remove below line later ::::: IMP!!!!!!!!!!
		//payment.setMC_TransRef("TEMP_REF");  //initial insert this will be null
		payment.setTransType(PaymentTypeEnum.BANK_TRANSFER);  //inside this method every time Bank Transfer until we provide CC payment option
		payment.setInitiatedByUserId(user);
		payment.setTransStartDate(bankTransferPostCommitDetails.getDateNowLocalTime());
		payment.setTransTargetEndDate(bankTransferPostCommitDetails.getTransTargetEndDate());
		payment.setLatestTransStatus(PaymentStatusEnum.INITIATED);
		payment.setLastUpdatedDate(Calendar.getInstance().getTime());
		payment.setHasFailed(false); //when insert to payments initially
		payment.setFailureReason(null);
		payment.setTransAmount_USD(bankTransferPostCommitDetails.getTotalCostUSD());
		payment.setIsBillingAddressSame(true); //hardcoded.Need to be changed once UI send the data..missing in API 4.1
		payment.setBillingAddressCity(bankTransferPostCommitDetails.getBillingCity());
		payment.setBillingAddressState(bankTransferPostCommitDetails.getBillingState());
		payment.setBillingAddressStreet(bankTransferPostCommitDetails.getBillingStreet());
		payment.setBillingAddressZip(bankTransferPostCommitDetails.getBillingZip());
		return payment;
	}
	
	protected Renewal populateRenewalData(BankTransferPostCommitDetails bankTransferPostCommitDetails, PatentUI patentUI){
		
		Renewal renewal = new Renewal();
		renewal.setCertificate(null);
		Patent patent = Patent.findPatent(patentUI.getId());
		renewal.setPatent(patent);
		renewal.setRenewalYear(patent.getRenewalYear());
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
		for(PatentExtendedData eachSessionData : sessionData){
			if(eachSessionData.getPatentId() == patentUI.getId()){
				renewal.setRenewalDueDate(eachSessionData.getRenewalDueDate());
				renewal.setRenewalPeriod(eachSessionData.getCurrentCostBand());
				renewal.setFee(eachSessionData.getFee());
				break;
			}
		}
		
		renewal.setRenewalStatus(RenewalStatusEnum.IN_PROGRESS);
		renewal.setRenewalAttemptsMade(P3SPropertyNames.Renewal_Attempts_Constant_In_Payment_Commit);
		return renewal;
	}
	
	

	// End of - Support methods - NOT exposed through the interface

}
