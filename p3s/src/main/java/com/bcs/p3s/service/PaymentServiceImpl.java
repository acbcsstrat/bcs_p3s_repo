package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.InvoiceProcessingEngine;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailFactory;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.engine.CommitToRenewalEngine;
import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.engine.PaymentTimingEngine;
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.email.EmailSender;
import com.bcs.p3s.util.lang.P3SPriceException;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
import com.bcs.p3s.wrap.InBasket;
import com.bcs.p3s.wrap.PatentExtendedData;

@Service("PaymentService")
public class PaymentServiceImpl extends ServiceAuthorisationTools implements PaymentService {

	// Observation: Are invoking EpctEngine several times. MAY benefit for call once and distribute ...
	
	
	/*@Autowired
	HttpSession session;*/

	protected String PREFIX = this.getClass().getName() + " : "; 
	public static String PRICE_CHANGED = "The price has changed from that expected"; 

	
	// Start of - the methods which implement the prototypes in the Interface

    /** Implements API section 4.1 **/
	public BasketContents showBasketContents(List<Long> patentIds) {

		String err = PREFIX+"showBasketDetails() ";
		BasketContents basketContents = new BasketContents();

		// 190226 are now being invoked with empty basket. Avoid exception
		if (patentIds==null || patentIds.size()==0) {
			log().debug("showBasket() invoked with empty basket!  Avoid exception.  190226    "+err);
			return basketContents;
		}
		
		
		
		checkAreMyPatents(patentIds, err);
		log().debug(err+" invoked ");
		
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
		
//		try {
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
						
						log().debug("181120 crashes here upon leave basket for epct");
						
						//latestCalculatedCost = latestCalculatedCost .add(eachSessionData.getCurrentRenewalCost()); // This line crashed 181129 upon checkout
						BigDecimal currentRenewalCost = eachSessionData.getCurrentRenewalCost();
						if (currentRenewalCost!=null)
							latestCalculatedCost = latestCalculatedCost .add(currentRenewalCost);
						else log().warn("******* Just avoided crash - but MISSING pricing (f1200?");
					}
				}
				// v2.1 UTTER BODGE starts here (as long stated : pricing / storage / whole design needs rewrite)
				// above latestCalculatedCost lacks f1200 costs, yet they are needed immediately below. Need rapid workaround
				BasketContents tmpBasketContents = new BasketContents();
				List<Long> patentIdInBasket = basket.getPatentIds();
				log().debug("181129 workaround to recalc checkout basket cost has patentIdInBasket of (below) : ");
				for (long lng : patentIdInBasket) log().debug("    this Long is : "+lng);
				populateBasketContents(tmpBasketContents, patentIdInBasket);

				BigDecimal NEWlatestCalculatedCost = tmpBasketContents.getTotalCostUSD();
				log().debug("181129 workaround to recalc checkout basket cost has calculated : "+NEWlatestCalculatedCost);

				NEWlatestCalculatedCost.setScale(2, BigDecimal.ROUND_HALF_UP);
				bankTransferCheckoutPreCommit.setTotalCostUSD(NEWlatestCalculatedCost);
				latestCalculatedCost = NEWlatestCalculatedCost;
				// v2.1 UTTER BODGE Ends here
				//bankTransferCheckoutPreCommit.setTotalCostUSD(latestCalculatedCost.setScale(2, BigDecimal.ROUND_HALF_UP));
			}
			logAttention("Checkout got renewal costs - NOT f1200s - not yet written - PaymentServiceImpl BankTransferPreCommitDetails");
			
			bankTransferCheckoutPreCommit = populateBankTransferPreCommitDetails(bankTransferCheckoutPreCommit, basket);

			// Check that expected price matches calculated
			BigDecimal expected = basket.getExpectedCost().setScale(2, BigDecimal.ROUND_HALF_UP);
			//BigDecimal calculated = bankTransferCheckoutPreCommit.getTotalCostUSD().setScale(2, BigDecimal.ROUND_HALF_UP);
			
			BigDecimal calculated = latestCalculatedCost.setScale(2, BigDecimal.ROUND_HALF_UP);
			
			if ( ! doesExpectedEqualCalculated(expected, calculated, "Checkout")) {
				err += "Expected Total Price differs from calculated. Expected="+expected.toString()+"  calculated="+calculated.toString();
				logM().warn(err);
				logInternalError().warn(err);
				throw new P3SRuntimeException(err);
			}
//		}  // acTidy
//		catch (Exception e) {
//    		// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
//    		System.out.println("PaymentServiceImpl showBankTransferPreCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
//			System.out.println(e.getMessage());
//			e.printStackTrace();
//			throw new RuntimeException(e);
//    	}
		return bankTransferCheckoutPreCommit;
	}
	protected boolean doesExpectedEqualCalculated(BigDecimal expected, BigDecimal calculated, String src) {
		log().warn("doesExpectedEqualCalculated(e,c) invoked with "+expected+", "+calculated+"..");
		if (expected==null || calculated==null) return false;
		boolean allOk = true;
		if (expected.compareTo(calculated) != 0) {
			allOk = false; // Oh Dear. Prices NOT the same
			
			// BUT - lets check - just in case the mismatch is one cent or less. Shouldn't happen, but huge problem if it can
			// If this triggers, we <i>could</i> setScale() on both first. But SHOULD NOT be necessary
			if (expected.subtract(calculated).abs().compareTo(new BigDecimal("0.01")) <= 0) {
				// Phew - we can avoid an awful mess
				log().warn(src + " nearly rejected an expected/calc mismatch: "+expected.toString()+", "+calculated.toString()+"   FIX THIS !");
				allOk = true;
			}
		}
		return allOk;
	}
	
	

	
    /** Implements API section 4.3 **/
	public BankTransferPostCommitDetails showBankTransferPostCommitDetails(InBasket basket) {

		String err = PREFIX+"showBankTransferPostCommitDetails() ";
		log().debug(err+" invoked ");

		checkNotNull(basket, err+"A");
		checkAreMyPatents(basket.getPatentIds(), err);
		checkNotNull(basket.getExpectedCost(), err+"B");
		check4ValidSellablePatentStatusv2_1(basket, err);

		Payment currentPayment = new Payment();
		BigDecimal latestCalculatedCost = new BigDecimal("0.0");
		List<RenewalFee> committedFee = new ArrayList<RenewalFee>();
		List<Long> patentIdsInThisTransaction = new ArrayList<Long>(); 
	
		PostLoginDataEngine recalculateEngine = new PostLoginDataEngine();
		BankTransferPostCommitDetails bankTransferPostCommitDetails = new BankTransferPostCommitDetails();
		
//		try {
			
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
			if(pLoginSession.getExtendedPatentUI()==null) fail(err+"pLoginSession.getExtendedPatentUI() == null"); 
			else {
				List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
				for(PatentExtendedData eachSessionData : sessionData) {
					if(basket.getPatentIds().contains(eachSessionData.getPatentId())) {
						if (isThisPatentaRenewal(eachSessionData.getPatentId())) { // safety exclusion added for form1200
							latestCalculatedCost = latestCalculatedCost.add(eachSessionData.getCurrentRenewalCost());
							committedFee.add(eachSessionData.getFee());
							patentIdsInThisTransaction.add(eachSessionData.getPatentId());
						}
					}
				}
				// That v1 code will have calculated for renewals. Now form1200s
				
				List<Long> basketPatentIds = basket.getPatentIds();
				for (Long patentId : basketPatentIds) {
					Patent patent = Patent.findPatent(patentId);
					if (patent==null) fail(err+" List<Long> basketPatentIds  contains non-existent patent : "+patentId);
					// Filter to just form1200s (as have done renewals above)
					boolean isEpct = StageManager.isInFiling(patent.getEpoPatentStatus());
					if (isEpct) {
						EpctEngine epctEngine = new EpctEngine(patent);
						
						Epct optionalEpctNotWantedHere = null;
						Form1200Fee form1200Fee = epctEngine.calcEpctPersistPricingOnly(optionalEpctNotWantedHere); 

						BigDecimal totF1200costUSD = form1200Fee.getSubTotal_USD();
						
						latestCalculatedCost = latestCalculatedCost.add(totF1200costUSD);
						// committedFee - not applicable here - will do equiv ...
						patentIdsInThisTransaction.add(patentId);
					}
				}
				bankTransferPostCommitDetails.setTotalCostUSD(latestCalculatedCost.setScale(2, BigDecimal.ROUND_HALF_UP));
			}
			/*//finally generate the p3sTransRef // acTidy
			CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
			String p3sTransRef = commitToRenewal.generateP3sTransRef(pLoginSession);
			bankTransferPostCommitDetails.setP3sTransRef(p3sTransRef);*/
		
			// Check that expected price matches calculated
			BigDecimal expected = basket.getExpectedCost().setScale(2, BigDecimal.ROUND_HALF_UP);
			BigDecimal calculated = bankTransferPostCommitDetails.getTotalCostUSD().setScale(2, BigDecimal.ROUND_HALF_UP);
			//if (expected.compareTo(calculated) != 0) {
			if ( ! doesExpectedEqualCalculated(expected, calculated, "Commit")) {

				bankTransferPostCommitDetails.setWarningMessage(PRICE_CHANGED);

				err += "[@Commit] Expected Total Price differs from calculated. Expected="+expected.toString()+"  calculated="+calculated.toString();
				logM().warn(err);
				logInternalError().warn(err);
				throw new P3SPriceException(err);
			}
			
			/**
			 * All checks completed , now do the persist
			 * 	a. Insert into Invoice table with paymentId as null
			 * 	b. Insert into Payment table  with the current invoice Id
			 * 	c. Update Invoice table with current paymentId
			 *  d. Insert into Fee table with renewalId as null
			 * 	e. Insert into Renewal table with the current feeId
			 *  f. Update payment_renewals join table with renewals
			 * 	g. Update Fee table with the current renewalId
			 * 	h. If above db operations success, then update Patent with renewal_status as Payment In Progress
			 */ 
			
			currentPayment = commitTransaction(bankTransferPostCommitDetails,committedFee);

			/**
			 * 	i. Create proforma invoice
			 *  j. Send booking email & proforma invoice to customer by email 
			 */ 
			//log().warn("**** Booking made - but p3s cannot yet create an Proforma Invoice (or any PDF) to email");
			

			sendProformaInvoiceEmail(bankTransferPostCommitDetails, patentIdsInThisTransaction);

			// For the htmlDoc solution (see com.bcs.p3s.docs.htmldoc package-info) invoiceUrl (below), here, is not used. The equivalents are set in RenewalUI  & PaymentUI
			// However, the front-end booking confirmation 'Show Invoice' button DOES need it. So set here 
			bankTransferPostCommitDetails.setProformaInvoiceUrl(deriveInvoiceUrl(currentPayment));
			
			
			//create and send the orders file to MC
			// This is no longer done by p3sweb. p3sweb creates a payment record with sent_tp_mc = null.
			// Cron invoked frequently, checks for such payments, writes the SFTP Order file, 
			//  then writes a timestamp to payment:sent_tp_mc 
			if(currentPayment == null) {
				err += "Order not created. Payment is null from commitTransaction(" + bankTransferPostCommitDetails +"," + committedFee +")";
				logInternalError().error(err);
			}

//		}
//		catch (Exception e) {
//			// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
//			System.out.println("PaymentServiceImpl showBankTransferPostCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
//			System.out.println(e.getMessage());
//			e.printStackTrace();
//			//throw new RuntimeException(e);
//			
//			// this SHOULD make above code redundant
//			throw new P3SRuntimeException("PaymentServiceImpl showBankTransferPostCommitDetails() SUFFERED WATCHDOG WRAPPER EXCEPTION ", e);
//		}
		return bankTransferPostCommitDetails;
	}


	// End of - the methods which implement the prototypes in the Interface

	
	
	
	
	
	
	
	// Start of - Support methods - NOT exposed through the interface

	
	protected void sendProformaInvoiceEmail(BankTransferPostCommitDetails commitTransaction
				, List<Long> patentIdsInThisTransaction) {

		log().debug("Send Proforma Invoice");
		String err = PREFIX+"sendProformaInvoiceEmail : ";
		if (commitTransaction==null || patentIdsInThisTransaction==null) {
			panic(err+"Error preparing to send ProformaInvoice email");
			return;
		}
		try {
			// Prepare data needed by the emailer
			List<Patent> patents = new ArrayList<Patent>();
			P3sEmailFactory emailFactory = new P3sEmailFactory();
			P3SUser me = SecurityUtil.getMyUser();
			String p3sRef = commitTransaction.getP3sTransRef();
			if (isEmpty(p3sRef)) panic(err+"p3sRef is Empty!");  
			BankTransferPaymentDetails payee = commitTransaction.getBankTransferPaymentDetails();
			
			Payment thisTransaction = Payment.findPaymentsByP3S_TransRef(p3sRef).getSingleResult();
			String pdfFilename = thisTransaction.getLatestInvoice().getFilename();
			String totUSDstr = thisTransaction.getTransAmount_USD().toString();
			
			for (Long patentId : patentIdsInThisTransaction) {
				Patent thisPatent = Patent.findPatent(patentId);
				patents.add(thisPatent);
			}

			//PaymentTimingEngine timing = new PaymentTimingEngine();
		   // Date endDate = timing.whenCustomerFundsMustHaveReachedOurUsAccount(new Date());
			//Getting target End Date from DB value transTargetEndDate - MP 06/12/2017 
			//Date endDate = timing.getBothPayDates(commitTransaction);
			Date endDate = thisTransaction.getTransTargetEndDate();
		    String endDateUI = new DateUtil().dateToUSStringWithDayOfWeekandTimeandZone(endDate);
			
		    String recipient = me.getEmailAddress();
		    recipient = amendIfRqdForDev(recipient);
		    
	
			P3sEmail email = emailFactory.create(EmailTemplates.email_proforma_invoice, me, p3sRef,
					endDateUI, pdfFilename, patents, payee, totUSDstr);
			send(email, recipient);
		}
		catch (RuntimeException rte) {
			//logErrorAndContinue(err+"Error preparing ProformaInvoice email. Now rethrow",rte);
			throw new P3SRuntimeException("Error preparing ProformaInvoice email. Now rethrow",rte);
		}
	}
	
	protected void send(P3sEmail email, String recipient) {
		log().debug("send() proforma to "+recipient);
		EmailSender emailer = new EmailSender(email);
		//emailer.setRecipientsToDevs();
		emailer.addRecipient(recipient);
		emailer.sendEmail();
	}
	
	protected String amendIfRqdForDev(String existing) {  // acTidy acDebug
		// this temporary DEV code whilst using domain p3s.me
		if ("andy@p3s.me".equalsIgnoreCase(existing)) return "andy.chapman@boxcleversoftware.com";
		if ("merin@p3s.me".equalsIgnoreCase(existing)) return "merin.paul@boxcleversoftware.com";
		if ("pat@p3s.me".equalsIgnoreCase(existing)) return "patrick.mcdermott@boxcleversoftware.com";
		if ("dan@p3s.me".equalsIgnoreCase(existing)) return "dan.scobie@boxcleversoftware.com";
		if ("guest@p3s.me".equalsIgnoreCase(existing)) return "andy.chapman@boxcleversoftware.com";
		return existing;
	}
	
	
	protected void populateBasketContents(BasketContents basketContents, List<Long> patentIds) {

		String err = CLASSNAME+".populateBasketContents() : ";
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
			
			// Here, v1 code loops by stored data (for renewals), rather than by patentIds. Retain v2.1, whilst it works
			List<PatentExtendedData> sessionData = pLoginSession.getExtendedPatentUI();
			for(PatentExtendedData eachSessionData : sessionData){
				if(patentIds.contains(eachSessionData.getPatentId())){
					if (eachSessionData.getCurrentRenewalCost() != null) { // This line: added for v2.1, (if no renewal)
						log().debug("doubleProcFee3 - checking is eachSessionData.getPatentId("+eachSessionData.getPatentId()+") is in prosecution - for user "+pLoginSession.getUser().getId());
						try {
							if ( StageManager.isInProsecution(Patent.findPatent(eachSessionData.getPatentId()).getEpoPatentStatus()) ) { // This line: also added for v2.1, to stop double counting (if a renewal exists (PaymentInProgress), for another patent (not in basket, not even for this customer!) it can contribute to the totals. Inhibit!
								latestCalculatedCost = latestCalculatedCost.add(eachSessionData.getCurrentRenewalCost());
								basketContents.addRenewalFeesToBreakdownTotals(eachSessionData); // This line: added for v2.1, as breakdown totals is new to BE
							} else log().debug("doubleProcFee4 AVOIDed a doublecount...");
						} catch (Exception e) { fail("doubleProcFee2 - oh dear",e); }
					}
				}
			}

			basketContents.setTotalCostUSD(latestCalculatedCost.setScale(2, BigDecimal.ROUND_HALF_UP));
		}
		log().debug("doubleProcFee1 - procFee post renewal calc is "+basketContents.getTotalProcessingFeesUSD());
		
		// v2.1 Existing(mostly) above code (ie v1) will have calculated renewal costs. If E-PCT costs, see below 

		List<PatentExtendedData> extendedData = pLoginSession.getExtendedPatentUI();
		
		// Above has calculated Renew fees. Now do Epct fees
		for (Long patid : patentIds) {
			Patent patent = Patent.findPatent(patid);
			if (patent==null) logInternalError().fatal("PaymentServiceImpl populateBasketContents (for showBasketContents) given invalid PatentID of "+patid);

			// If have form1200s in basket, add their pricing
			boolean isEpct = StageManager.isInFiling(patent.getEpoPatentStatus());
			if (isEpct) {
				
	    		EpctEngine epctEngine = new EpctEngine(patent);
				Epct optionalEpctNotWantedHere = null;
	    		Form1200Fee form1200Fee = epctEngine.calcEpctPersistPricingOnly(optionalEpctNotWantedHere); 
	    		
	    		if (epctEngine.isNotAvailable()) log().error(err+"Epct.isNotAvailable should not exist in the basket !");
	    		else {
	    			basketContents.addEpctFeesToBreakdownTotals(form1200Fee);
	    			
	    			BigDecimal thisEpctCostUSD = form1200Fee.getSubTotal_USD();  
					BigDecimal newTotal = basketContents.getTotalCostUSD().add(thisEpctCostUSD);
					basketContents.setTotalCostUSD(newTotal.setScale(2, BigDecimal.ROUND_HALF_UP));
	    		}
			}
			
			PatentUI pui = new PatentUI(patent, extendedData); // PatentUI has no record of individual Form1200 fees, so no processing needed here
			pui.setRenewalNotificationUIs(null); // Inhibit unwanted large data (&redundant data?)
			pui.setEpctNotificationUIs(null); // I assume this wanted too .. acToDo
			
			basketContents.getOrderedPatentUIs().add(pui);
		}
		basketContents.setScaleOfTotals();

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
	    //Date endDate = timing.whenCustomerFundsMustHaveReachedOurUsAccount(now);
	    //Date endDate = timing.getPayByDateForUser(bankTransferPreCommitDetails.getOrderedPatentUIs());
	    
	    /*if(endDate == null){
	    	log().error("Error calculating transaction target end date. So returning error");
	    	return null;
	    }*/
	    
	    bankTransferPreCommitDetails = timing.getBothPayDates(bankTransferPreCommitDetails);
	    if(bankTransferPreCommitDetails == null){
	    	log().error("Error calculating transaction target end dates. So returning error");
	    	return null;
	    }
	    //bankTransferPreCommitDetails.setTransTargetEndDate(endDate);
	    String endDateUI = new DateUtil().dateToUSStringWithDayOfWeekandTimeandZone(bankTransferPreCommitDetails.getTransTargetEndDate());
	    bankTransferPreCommitDetails.setTransTargetEndDateUI(endDateUI);
	    
	    return bankTransferPreCommitDetails;

	}
	
	

	protected void populateBankTransferPostCommitDetails(BankTransferPostCommitDetails bankTransferPostCommitDetails, InBasket basket) {

		populateBankTransferPreCommitDetails(bankTransferPostCommitDetails, basket);

		/*CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
		String p3sTransRef = commitToRenewal.generateP3sTransRef(bankTransferPostCommitDetails);
		bankTransferPostCommitDetails.setP3sTransRef(p3sTransRef);*/

		BankTransferPaymentDetails bankTransferPaymentDetails = new BankTransferPaymentDetails();
		bankTransferPostCommitDetails.setBankTransferPaymentDetails(bankTransferPaymentDetails);
		
		bankTransferPostCommitDetails.setWarningMessage(null);
		

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

// acTidy - this from above	
//	 * 	a. Insert into Invoice table with paymentId as null
//	 * 	b. Insert into Payment table  with the current invoice Id
//	 * 	c. Update Invoice table with current paymentId
//	 *  d. Insert into Fee table with renewalId as null
//	 * 	e. Insert into Renewal table with the current feeId
//	 *  f. Update payment_renewals join table with renewals
//	 * 	g. Update Fee table with the current renewalId
//	 * 	h. If above db operations success, then update Patent with renewal_status as Payment In Progress
	
	protected Payment commitTransaction(BankTransferPostCommitDetails commitTransaction, List<RenewalFee> fee){
		
		String msg = PREFIX+"\ncommitTransaction("+commitTransaction+", \n\n& fee"+fee+ ") ";
		Invoice invoice = new Invoice();
		Payment payment = new Payment();
		RenewalFee currentRenewalFee = null;
		Invoice currentInvoice = null; // new Invoice();
		Payment currentPayment = null; // new Payment();
		Renewal currentRenewal = new Renewal();
		InvoiceProcessingEngine invoiceEngine = new InvoiceProcessingEngine();
		Boolean dbSuccess = true;
		log().debug(msg +" invoked ");
		
		List<Renewal> renewal_payment = new ArrayList<Renewal>();
		List<Epct> epct_payment = new ArrayList<Epct>();

		List<PatentUI> orderedPatents = commitTransaction.getOrderedPatentUIs();
//a.Insert into invoice (Temporary - some fields incomplete, but need it persisted to have it's ID)
		invoice = invoiceEngine.populateProformaInvoiceData(commitTransaction); 

		currentInvoice = invoice.persist();
		if(currentInvoice == null){
			dbSuccess = false;
			log().error("Invoice Table persistence failed " + msg);
			fail("Invoice Table persistence failed " + msg);
			//return payment;
		}
		else {
			//Invoice newInvoice = Invoice.findInvoice(invoice.getId());
			//newInvoice.merge();
			log().debug("Persisted Invoice Table. " + msg + "\nand returned invoice details with id as " + currentInvoice.getId()
			+ ", Invoice Number "+invoice.getInvoiceNumber());  // at this point, InvoiceNumber will be 'Empty'
		}
		
		
//b.Insert into Payment
		payment = populatePaymentData(commitTransaction);
		payment.setLatestInvoice(currentInvoice);

		// payment:P3S_TransRef cannot be set until after the payment is persisted
		
		currentPayment = payment.persist();

		if(currentPayment == null){
			dbSuccess = false;
			log().error("Payment Table persistence failed " + msg);
			fail("Payment Table persistence failed " + msg);
		}
		log().debug("Persisted Payment Table successfully " + msg + "and returned payment details with id as " + currentPayment.getId());
		
//			CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
//			String p3sTransRef = commitToRenewal.generateP3sTransRef(currentPayment); cannot gen yet. paymentID not yet exist
//			currentPayment.setP3S_TransRef(p3sTransRef);
		// currentPayment.merge(); // inhibit because pointless
		logChangeOfStatus().debug("Transaction ["+currentPayment.getId()+"] created with " + orderedPatents.size() +" patents ");
		

//c.Update the new Invoice and Payment with details now available

		currentPayment = Payment.findPayment(currentPayment.getId());
		CommitToRenewalEngine commitToRenewal = new CommitToRenewalEngine();
		String p3sTransRef = commitToRenewal.generateP3sTransRef(currentPayment);
		currentPayment.setP3S_TransRef(p3sTransRef);
		currentPayment.merge();
		logChangeOfStatus().debug("Transaction ["+currentPayment.getId()+"] " + currentPayment.getP3S_TransRef() + " updated with " + orderedPatents.size() +" patents ");

		// set remaining Invoice details
		String invoiceNumber = invoiceEngine.generateProFormaInvoiceNumber(currentPayment); 
		Invoice newInvoice = Invoice.findInvoice(currentInvoice.getId());
		newInvoice.setInvoiceNumber(invoiceNumber);
		newInvoice.setPayment(currentPayment);
		newInvoice.merge(); 
		log().debug("Invoice table ["+newInvoice.getId()+"]updated with payment id as "+ currentPayment.getId());

		// setting the generated p3s Ref to BankTransferPostCommitDetails - this object we are sending back to FE for displaying on final Payment page
		commitTransaction.setP3sTransRef(p3sTransRef);


		/**
		 * Each transaction may have multiple patents. So loop through each in orderedPatentIds and get the details from session
		 */
		
//d. Insert into Fee Table & e. Insert into Renewal 

		for(PatentUI eachPatent : orderedPatents){
			if (isThisPatentaRenewal(eachPatent.getId())) {
		
				// d(i). Insert into Fee table - For Renewals
	
				//Renewal renewal = new Renewal();
				//renewal = populateRenewalData(commitTransaction,eachPatent);
				//if(!(fee == null)){
				//	currentRenewalFee = renewal.getRenewalFee().persist();
				//	if(currentRenewalFee == null){
				//		dbSuccess = false;
				//		log().error("Fee Table persistence failed. currentFee=null " + msg);
				//		return payment;
				//	}
				//	log().debug("Persisted Fee Table successfully " + msg);
				//}
				//else{
				//	dbSuccess = false;
				//	log().error("Fee Table persistence failed. fee=null " + msg);
				//	return payment;
				//}
			
				Renewal renewal = new Renewal();
				renewal = populateRenewalData(commitTransaction,eachPatent);
				if(fee == null) { dbSuccess = false; fail("Renewal Fee Table persistence failed. fee=null " + msg); }
				else {
					currentRenewalFee = renewal.getRenewalFee().persist();
					if(currentRenewalFee == null){
						dbSuccess = false;
						log().error("Fee Table persistence failed. currentFee=null " + msg);
						return payment;
					}
					log().debug("Persisted Fee Table successfully " + msg);
				}
			
				// e(i). Insert into Renewal table - For Renewals
			
				renewal.setActivePaymentId(currentPayment);
				renewal.setRenewalFee(currentRenewalFee);
				currentRenewal = renewal.persist();
				currentRenewalFee.setRenewal(currentRenewal);
				
				// merge currentRenewalFee here rather than in g
				currentRenewalFee.merge();
				
				renewal_payment.add(currentRenewal);
				log().debug("Persisted Renewal Table successfully " + msg + "and returned renewal details with id as " + renewal.getId());
				
				if(currentRenewal == null){
					dbSuccess = false;
					log().debug("Renewal Table persistence failed " + msg);
					log().error("Renewal Table persistence failed " + msg);
					fail("Renewal Table persistence failed " + msg);
					//return payment;
				}
				
				// h(i) update patent with new renewal status
				Patent patent = Patent.findPatent(eachPatent.getId());
				patent.setRenewalStatus(currentRenewal.getRenewalStatus());
				patent.merge();
			}
			else 
			{ // is a form1200 item

				// d(ii). Insert into Form1200Fee table - For form1200
				// e(ii). Insert into Epct table - For form1200
				
				// Here, v2.1 E-PCT (aka Form1200) behaviour differs from v1 Renewals. Here the entities are already persisted
				// But the Fee needs recalculating and the Epct a minor update & the epct-status updating
				Epct epct = Epct.findActiveEpctByPatent(eachPatent);
				if (epct==null) fail(CLASSNAME+".commitTransaction fails on patent("+eachPatent.getId()+") : findActiveEpctByPatent() returned null");

	    		EpctEngine epctEngine = new EpctEngine(eachPatent);
				Epct optionalEpctNotWantedHere = null;
				Form1200Fee newInmemoryForm1200Fee = epctEngine.calcEpctPersistPricingOnly(optionalEpctNotWantedHere); //  Don't pass in epct here. Is already persisted.
				newInmemoryForm1200Fee.setEpct(epct);
				Form1200Fee redundantForm1200Fee = epct.getForm1200Fee();
				epct_payment.add(epct);

				// Do the persistence merry-go-round, Updating the Epct along the way
				Form1200Fee newPersistedForm1200Fee = newInmemoryForm1200Fee.persist();
				epct.setForm1200Fee(newPersistedForm1200Fee);
				epct.setEpctStatus(Form1200StatusEnum.PAYMENT_IN_PROGRESS);
				epct.merge();

				// redundantForm1200Fee.remove(); - Cannot yet delete. `p3s_v2`.`form1200fee`, CONSTRAINT `FK_4nnv416nt7isy0ps94xlccvgx` FOREIGN KEY (`epct`) REFERENCES `epct` (`id`))
				// Reasoning: redundantForm1200Fee erroneously believes that IT is that target of epct.form1200fee which is a NotNull field in epct. Hence redundantForm1200Fee cannot be deleted.
				redundantForm1200Fee.setEpct(null);
				redundantForm1200Fee.merge();
				redundantForm1200Fee.remove();
				
				// h(ii) update patent with new epct status
				Patent patent = Patent.findPatent(eachPatent.getId());
				patent.setEpctStatus(epct.getEpctStatus());
				patent.merge();
			}
		}  // End of: for(PatentUI eachPatent : orderedPatents){

//f.Update payment_renewals & payment_epcts tables
		if (renewal_payment==null || epct_payment==null) fail(msg+" renewal_payment or epct_payment is null");
		currentPayment = Payment.findPayment(currentPayment.getId());
		currentPayment.setRenewals(renewal_payment);
		currentPayment.setEpcts(epct_payment);
		currentPayment.merge();
		log().debug("payment_renewals & payment_epcts join tables persisted with "+ renewal_payment.size() +" renewal(s) "+ epct_payment.size() +" epct(s)");
		
		
//g.Update currentFee Table with currentRenewal
		// This was v1 code. Yet if multiple renewals, this is AFTER the loop. At best, would have be unreliable .. So merge in proper place - in 'd'
		//if(!(currentRenewalFee == null)){
		//	currentRenewalFee.merge();
		//	log().debug("Fee table updated with renewal id as "+ currentRenewal.getId());
		//}
		
		
//h. Update Patent table for all ordered Patents
		// as per above - below existing code was after loop - too late !. moved above, so this is redundant
//		if(dbSuccess){
//			for(PatentUI eachPatent : orderedPatents){
//				Patent patent = Patent.findPatent(eachPatent.getId());
//				patent.setRenewalStatus(currentRenewal.getRenewalStatus());
//				patent.merge();
//			}
//		}

		
		return payment;
			
	}
	
	/**
	 * a method to set all payment properties except latestInvoice (latestInvoice being set inside persist() of invoice table
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
		payment.setMC_TransRef(null);
		payment.setTransType(PaymentTypeEnum.STANDARD_PAYMENT);  // any Payment created by p3sWEB is std. It's cron that would create penalty payments
		payment.setInitiatedByUserId(user);
		payment.setTransStartDate(bankTransferPostCommitDetails.getDateNowLocalTime());
		payment.setTransTargetEndDate(bankTransferPostCommitDetails.getTransTargetEndDate());
		payment.setLatestTransStatus(PaymentStatusEnum.INITIATED);
		payment.setLastUpdatedDate(Calendar.getInstance().getTime());
		payment.setHasFailed(false); //when insert to payments initially
		payment.setFailureReason(null);
		// latestInvoice - not set yet
		payment.setTransAmount_USD(bankTransferPostCommitDetails.getTotalCostUSD());
		payment.setIsBillingAddressSame(true); //hardcoded.Need to be changed once UI send the data..missing in API 4.1
		payment.setBillingAddressCity(bankTransferPostCommitDetails.getBillingCity());
		payment.setBillingAddressState(bankTransferPostCommitDetails.getBillingState());
		payment.setBillingAddressStreet(bankTransferPostCommitDetails.getBillingStreet());
		payment.setBillingAddressZip(bankTransferPostCommitDetails.getBillingZip());
		payment.setSentToMc(null);
		payment.setMC_failCode(null); 
		payment.setFxTarget(bankTransferPostCommitDetails.getFxTarget());
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
				renewal.setRenewalFee(eachSessionData.getFee());
				break;
			}
		}
		
		renewal.setRenewalStatus(RenewalStatusEnum.PAYMENT_IN_PROGRESS);
		renewal.setRenewalAttemptsMade(P3SPropertyNames.Renewal_Attempts_Constant_In_Payment_Commit);
		return renewal;
	}
	
	

	protected String deriveInvoiceUrl(Payment currentPayment) {
		if (currentPayment==null) return null;
		String url = null;
		
		// Read web context
		String context = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			context = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_CONTEXT); 
		} catch (P3SPropertyException e) {
			System.out.println("RenewalUI constructor : property read failed");
			e.printStackTrace();
		}
		if (context!=null) {
			url = context + "/invoice/" + currentPayment.getId(); 
		}
		return url;
	}

	
	// v2.1 is often many times over making this check. Rewrite in future - acTodo
	boolean isThisPatentaRenewal(long patentId) { // ie distinguish between Renewal and Form1200 items
		Patent patent = Patent.findPatent(patentId);
		if (patent==null) fail("PaymentServiceImpl : isThisPatentaRenewal("+patentId+") doesn't exist !");
		boolean isRenewal = StageManager.isInProsecution(patent.getEpoPatentStatus());
		return isRenewal;
	}
	
	
	
	
	
	// End of - Support methods - NOT exposed through the interface

}
