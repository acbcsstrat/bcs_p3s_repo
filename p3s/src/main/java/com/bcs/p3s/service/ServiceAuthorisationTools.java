package com.bcs.p3s.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.PageDescriptionEnum;
import com.bcs.p3s.display.form1200.PageDescriptionTool;
import com.bcs.p3s.display.form1200.PageDescriptionUI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.enump3s.EPCTnotAvailableReasonEnum;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.P3SAuthorisationException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.InBasket;

/**
 * Provides tools to simplify authorisation checks, 
 *  thereby making the code in the Service classes clearer, and hence, safer.
 *  
 *  General Contract:
 *  - ANY check*() method should be null-safe on all parameters
 *  - Any fail will log, syso(for good measure!), then throw a RuntimeException (to prevent further, damaged processing)
 *
 *  And each Client method <i>should</i> VeryEarlyOn (ideally firstLine) call one of these check*() methods
 *   (even if just checkNoActionRequired).  This is to simplify visual confirmation that one of these safety checks have been called
 */
public class ServiceAuthorisationTools extends Universal {

	@Autowired
	HttpSession session;

	
	protected void authReminder() {
		System.out.println("");
		System.out.println("AUTHORISATION REMINDER:");
		System.out.println("ServiceAuthorisationTools authReminder Invoked - This is a REMINDER that you don't yet have proper auorisation checking");
		System.out.println("");
		// EVERY service method (& else/where?) should invoke this until proper tools are in place
	}
	
	
	// Start of : Higher Level tools

	protected void checkNoActionRequired(String err) {
		// OK - EVERY service method should call SOME check* method (& pass 'err') - this for simplicity in checking full coverage.
		// But what if no check is required? 
		// Hence, this dummy / NoAction method
		;
	}

	protected void checkUpdatePatent(long id, PatentUI patentUI, String err) {
		// Note!: This method only checks for PatentUI, If instead is LinkedHashMap, client must do own checking
		checkThisIsMyPatent(id, err);
		checkNotNull(patentUI, err);
		checkIsTrue((patentUI.getId().longValue()==id), err);
		// checkPatentUIhasNotificationUIs(patentUI, err);  // from v2.1, Notifications NOT provided with updatePatent. So disable this
	}
	
	protected void checkAreMyPatents(List<Long> patentIds, String err) {
		checkNotNull(patentIds, err+" checkAreMyPatents null");
		if (patentIds.size()==0) failMalicious(err+" checkAreMyPatents SIZE=0 listIsEmpty");
		for (Long patentId : patentIds) {
			checkThisIsMyPatent(patentId, err);
		}
	}

	protected void checkIsMyPayment(Payment payment, String err) {
		checkNotNull(payment, err);
		List<Renewal> renewals = payment.getRenewals();
		for (Renewal renewal : renewals) {
			checkThisIsMyPatent(renewal.getPatent().getId(), err);
		}
	}
	
	protected void checkForm1200isViable(long id, String err) {
		checkThisIsMyPatent(id, err);
		checkPatendIsOpenForForm1200(id, err);
	}

	protected void checkForm1200AsEntered4MissingData(long id, String err, long totalClaims, long totalPages, 
			List<ExtensionStateUI> extensionStatesUI, List<ValidationStateUI> validationStatesUI, List<PageDescriptionUI> pageDescriptionUI) 
	{
		checkThisIsMyPatent(id, err);
		checkPatendIsOpenForForm1200(id, err);
		check4MissingDataInForm1200Entry(id, err, totalClaims, totalPages, extensionStatesUI, validationStatesUI, pageDescriptionUI);
	}
	
	protected void checkForm1200isDeletable(long patentId, String err) 
	{
		Patent patent = checkThisIsMyPatent(patentId, err);
		checkEpctisDeletable(patent, err);
	}
	
	protected void checkForm1200isRejectable(long patentId, String err) 
	{
		Patent patent = checkThisIsMyPatent(patentId, err);
		checkEpctisRejectable(patent, err);
	}
	
	protected void checkNotNull(Object ob, String err) {
		err += "  [on checkNotNull]";
		if (ob==null) 
																	failInternalError(err); 
	}
	
	protected void check4ValidSellablePatentStatusv2_1(InBasket basket, String err) {
		checkSub4ValidSellablePatentStatusv2_1(basket, err);
	}
	
	
	protected P3SUser getMyUser() {
		return checkThisIsMy().getUser();
	}

	// Check Notifications are all of the same type and have credible Notification.Id 
	protected void checkNotificationsAreValidSet(List<NotificationUI> newNotificationUIs, String productType, String err) {
		checkSubNotificationsAreValidSet(newNotificationUIs, productType, err);
	}
	
	
	// End of   : Higher Level tools
	
	
	// Start of : Lower Level tools

	// Singleton for session info - not Singleton anymore
	//protected PostLoginSessionBean me = null;
		protected PostLoginSessionBean checkThisIsMy() {
			//if (me==null) {
				//log().debug("ServiceAuthorisationTools me singleton being instantiated."); // Use this to monitor destructions
				PostLoginSessionBean me = (PostLoginSessionBean) session.getAttribute("postSession");
				if ((me==null) || (me.getUser()==null) || (me.getBusiness()==null) ) {
					String msg = "***  ServiceAuthorisationTools checkThisIsMy() failed to retreive good session info *** (Possibly not logged in?)";
					System.out.println(msg);
					logInternalError().fatal(msg);
					System.out.println("(me==null) is "+(me==null));
					if (me!=null) System.out.println("me.getUser() is "+me.getUser());
					if (me!=null) System.out.println("me.getBusiness() is "+me.getBusiness());
					assert false : "4768";
				}
			//}
			return me;
		}	

	protected void checkThisIsMyUser(Long id, String err) {
		err += "  [on checkThisIsMyUser]";
		if ( ! checkThisIsMy().getUser().getId().equals(id)) 
																	failMalicious(err); 
	}
	
	protected void checkThisIsMyBusiness(Long id, String err) {
		err += "  [on checkThisIsMyBusiness]";
		if ( ! checkThisIsMy().getBusiness().getId().equals(id)) 
																	failMalicious(err); 
	}
	
	protected Patent checkThisIsMyPatent(Long id, String err) {
		err += ("  [on checkThisIsMyPatent("+id+")]");
		Patent p = Patent.findPatent(id);
		if ( (p==null) || ! checkThisIsMy().getBusiness().getId().equals(p.getBusiness().getId())) 
																	failMalicious(err);
		return p;
	}
	
	protected void checkEPNumberFormat(String str, String err) {
		err += "  [on checkEPNumberFormat]";
		if(!("EP".equals(str.substring(0,2))))
			failMalicious(err); 
		if(!(str.substring(2, 10).matches("[0-9]+")))
			failMalicious(err); 
	}
	
	protected void checkIsTrue(boolean errorIfFalse, String err) {
		err += "  [on checkIsTrue]";
		if (errorIfFalse==false) failInternalError(err); 
	}
	protected void checkIsFalse(boolean otherWay, String err) { checkIsTrue( ! otherWay, err); }

	// from v2.1, Notifications NOT provided with updatePatent. So disable this
	///** Any PatentUI should have (about) 10 NotificationUIs */
	//protected void checkPatentUIhasNotificationUIs(PatentUI patentUI, String err) {
	//	if (patentUI==null) 										failInternalError(err+" [patentUI isNull]");
	//	if (patentUI.getNotificationUIs()==null) 					failInternalError(err+" [patentUI has null notificationUIs]");
	//	int numNotificationUIs = patentUI.getNotificationUIs().size();
	//	// Limit? Currently are exactly 10, but big review seems likely. 5 seems safeest.
	//	if (numNotificationUIs < 5 )								failInternalError(err+" [patentUI has only "+numNotificationUIs+" notificationUIs]"); 
	//}

	// Client can only invoke if status & reason values are appropriate. SafteyCheck
	protected void checkPatendIsOpenForForm1200(long patentId, String err) {
		err += "  [on checkPatendIsOpenForForm1200]";
		Patent p = Patent.findPatent(patentId);
		String statusStr = p.getEpctStatus();
		String reasonStr = p.getEpctNotAvailableReason();
		boolean statusIsBad = true;
		if (notEmpty(statusStr)) {
			Form1200StatusEnum statusEnum = new Form1200StatusEnum(statusStr);
			statusIsBad = ! statusEnum.canInitiateForm1200();
		}
		boolean reasonIsBad = false;
		if (notEmpty(reasonStr)) {
			EPCTnotAvailableReasonEnum reasonEnum = new EPCTnotAvailableReasonEnum(reasonStr);
			if (reasonEnum.isNotAvailableReasonTerminal()) reasonIsBad = true;
		}
		if (statusIsBad || reasonIsBad)		failMalicious(err); 
	}

	// Check for nulls where shouldn't be, etc
	protected void check4MissingDataInForm1200Entry(long patentId, String err, long totalClaims, long totalPages, 
			List<ExtensionStateUI> extensionStatesUI, List<ValidationStateUI> validationStatesUI, List<PageDescriptionUI> pageDescriptionUI)
	{
		err += "  [on check4MissingDataInForm1200Entry] - ";
		if (totalClaims<1)	failMalicious(err+"totalClaims"); 
		if (totalPages<1)	failMalicious(err+"totalPages"); 
		if (extensionStatesUI==null)	failMalicious(err+"extensionStatesUI is null"); 
		if (validationStatesUI==null)	failMalicious(err+"validationStatesUI is null"); 
		if (pageDescriptionUI==null)	failMalicious(err+"pageDescriptionUI is null"); 
		if (pageDescriptionUI.size()!=3)	failMalicious(err+"pageDescriptionUI size is not 3");
		PageDescriptionTool pageDescriptionTool = new PageDescriptionTool();
		if ( ! pageDescriptionTool.confGot1ofEach(pageDescriptionUI)) failMalicious(err+"pageDescriptionUI not 1ofEach");
		checkPageNumbersForSillies(totalPages, pageDescriptionUI, err);
	}
	protected void checkPageNumbersForSillies(long totalPages, List<PageDescriptionUI> pageDescriptionUIs, String err) {
		err += "checkPageNumbersForSillies - ";
		int totPages = (int) totalPages;
		PageDescriptionTool pageDescriptionTool = new PageDescriptionTool();
		PageDescriptionUI descriptionPages	= pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUIs, PageDescriptionEnum.Description);
		PageDescriptionUI claimsPages		= pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUIs, PageDescriptionEnum.Claims);
		PageDescriptionUI drawingsPages		= pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUIs, PageDescriptionEnum.Drawings);
		int descStart = Integer.parseInt(descriptionPages.getTypeStart());
		int descEnd = Integer.parseInt(descriptionPages.getTypeEnd());
		int claimsStart = Integer.parseInt(claimsPages.getTypeStart());
		int claimsEnd = Integer.parseInt(claimsPages.getTypeEnd());
		int drgsStart = Integer.parseInt(drawingsPages.getTypeStart());
		int drgsEnd = Integer.parseInt(drawingsPages.getTypeEnd());
		if (descEnd>totPages || claimsEnd>totPages || drgsEnd>totPages) failMalicious(err+"SectionEndPage beyond end doc."); 
		// check each range for overlaps
		if ( 
			   (isPageNumWithinRange(claimsStart, descStart, descEnd))
			|| (isPageNumWithinRange(claimsEnd, descStart, descEnd))
			|| (isPageNumWithinRange(drgsStart, descStart, descEnd))
			|| (isPageNumWithinRange(drgsEnd, descStart, descEnd))
			|| (isPageNumWithinRange(descStart, claimsStart, claimsEnd))
			|| (isPageNumWithinRange(descEnd, claimsStart, claimsEnd))
			|| (isPageNumWithinRange(drgsStart, claimsStart, claimsEnd))
			|| (isPageNumWithinRange(drgsEnd, claimsStart, claimsEnd))
			|| (isPageNumWithinRange(descStart, drgsStart, drgsEnd))
			|| (isPageNumWithinRange(descEnd, drgsStart, drgsEnd))
			|| (isPageNumWithinRange(claimsStart, drgsStart, drgsEnd))
			|| (isPageNumWithinRange(claimsEnd, drgsStart, drgsEnd))
		) failMalicious(err+"Section page numbers overlap.");
	}
	protected boolean isPageNumWithinRange(int pageNum, int rangeStart, int rangeEnd) {
		return (pageNum>rangeStart && pageNum<rangeEnd);
	}


	// Only valid if exists and status value is appropriate. SafteyCheck
	protected void checkEpctisDeletable(Patent patent, String err) {
		Epct epct = Epct.findActiveEpctByPatent(patent);
		if (epct==null)  failMalicious(err+"No such Epct exists.");
		else {
			String epctStatus = epct.getEpctStatus();
			boolean isDeletable = Form1200StatusEnum.isDeletable(epctStatus);
			if ( ! isDeletable) failMalicious(err+"Epct("+epct.getId()+") is NOT deleteable. eSts="+epctStatus);
		}
	}	

	// Only valid if epct-not-exist, OR exists and status value is appropriate. SafteyCheck
	protected void checkEpctisRejectable(Patent patent, String err) {
		boolean isRejectable = Form1200StatusEnum.isRejectable(patent.getEpctStatus());
		if ( ! isRejectable) failMalicious(err+"Patent("+patent.getId()+" is NOT EpctRejectable.");
	}	
	

	// Check each patent for valid renewable OR form1200-able status
	// named 'v2.1' as relies on only sellable products being Renewal or form1200
	protected void checkSub4ValidSellablePatentStatusv2_1(InBasket basket, String err) {
		err += "checkSub4ValidSellablePatentStatusv2_1 : ";
		for (Long patentId : basket.getPatentIds()) {
			Patent patent = Patent.findPatent(patentId);
			if (StageManager.isInProsecution(patent.getEpoPatentStatus())) {
				// {this relocated from PaymentRestController  v1 181107}
				// * Precheck before committing payment : to avoid duplicate payments for same patents from different users of same company
				// * CHECK :- CHECK WHETHER ALL THE PATENTS ADDED TO THE BASKET IS HAVING A STATUS AS SHOW_PRICE
				//
				//List<Long> addedPatentIds = basketContents.getPatentIds();
				//if(!(addedPatentIds.isEmpty())){
				//	for(Long eachId : addedPatentIds){
				//		Patent patent = Patent.findPatent(eachId);
	    				if(!(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(patent.getRenewalStatus()))) {
							//log().debug("Patent[" +patent.getId() +"] added to basket has got a RENEWAL STATUS NOT EQUALS SHOW_PRICE. Abort the Payment request.");
							//return new ResponseEntity<BankTransferPostCommitDetails>(bankTransferPostCommitDetails, HttpStatus.BAD_REQUEST);  // Pat to display respective error message
	    					failMalicious(err+"Renewal patentId("+patent.getId()+") is NOT status SHOW_PRICE- is "+patent.getRenewalStatus()); 
	    				}
				//	}
				//}
			}
			else
			{
				Form1200StatusEnum form1200StatusEnum = new Form1200StatusEnum(patent.getEpctStatus()); 
				if ( ! form1200StatusEnum.canSellForm1200()) {
					failMalicious(err+"E-PCT patentId("+patent.getId()+") is NOT in sellable status - is "+patent.getEpctStatus());
				}
			}
			
		}
	}

	
	protected void checkSubNotificationsAreValidSet(List<NotificationUI> newNotificationUIs, String productType, String err) {
		err += "checkSubNotificationsAreValidSet : ";
		String failMsg = null;
		if (newNotificationUIs==null || productType==null) failMsg = " : Passed 1+ null param";
		else {
			for (NotificationUI aNotificationUI : newNotificationUIs) {
				Long aNotificationId = aNotificationUI.getId();
				if (aNotificationId==null || (long) aNotificationId == 0) failMsg = "aNotificationId is not valid.";
				if ( ! productType.equals(aNotificationUI.getProductType())) 
						failMsg = "1+ aNotificationId of wrong type. Expected "+productType+", got "+aNotificationUI.getProductType();
			}
		}
		if (failMsg!=null) failMalicious(err+" : newNotificationUIs are NOT a consistent set");
	}
	
	// End of   : Lower Level tools
	

	
	
	// Start of : Failure Handling utils

	protected void failInternalError(String msg) {
		String eMsg = "*** [failInternalError]   "+msg+" ***  {user "+checkThisIsMy().getUser().getId().longValue()+")  **";
		System.out.println(eMsg);
		logInternalError().fatal(eMsg);
		throw new RuntimeException(eMsg);
	}
	
	protected void failMalicious(String msg) {
		String eMsg = "*** [failMalicious]   "+msg+" ***  (user "+checkThisIsMy().getUser().getId().longValue()+")  ***";
		System.out.println(eMsg);
		logM().fatal(eMsg);
		throw new P3SAuthorisationException(eMsg);
	}
	
	// End of   : Failure Handling utils
	
}
