package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

/**
 * Provides tools to simplify authorisation checks, 
 *  thereby making the code in the Service classes clearer, and hence, safer.
 *  
 *  General Contract:
 *  - ANY check*() method should be null-safe on all parameters
 *  - Any fail will log, syso(for good measure!), then throw a RuntimeException (to prevent further, damaged processing)
 *
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
		checkPatentUIhasNotificationUIs(patentUI, err);
	}
	
	protected void checkAreMyPatents(List<Long> patentIds, String err) {
		checkNotNull(patentIds, err);
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
	
	protected void checkThisIsMyPatent(Long id, String err) {
		err += "  [on checkThisIsMyPatent]";
		Patent p = Patent.findPatent(id);
		if ( (p==null) || ! checkThisIsMy().getBusiness().getId().equals(p.getBusiness().getId())) 
																	failMalicious(err); 
	}
	
	protected void checkNotNull(Object ob, String err) {
		err += "  [on checkNotNull]";
		if (ob==null) 
																		failInternalError(err); 
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
		if (errorIfFalse==false) 
																	failInternalError(err); 
	}
	protected void checkIsFalse(boolean otherWay, String err) { checkIsTrue( ! otherWay, err); }
	
	/** Any PatentUI should have (about) 10 NotificationUIs */
	protected void checkPatentUIhasNotificationUIs(PatentUI patentUI, String err) {
		if (patentUI==null) 										failInternalError(err+" [patentUI isNull]");
		if (patentUI.getNotificationUIs()==null) 					failInternalError(err+" [patentUI has null notificationUIs]");
		int numNotificationUIs = patentUI.getNotificationUIs().size();
		// Limit? Currently are exactly 10, but big review seems likely. 5 seems safeest.
		if (numNotificationUIs < 5 )								failInternalError(err+" [patentUI has only "+numNotificationUIs+" notificationUIs]"); 
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
		String eMsg = "*** [failMalicious]   "+msg+" ***  {user "+checkThisIsMy().getUser().getId().longValue()+")  **";
		System.out.println(eMsg);
		logM().fatal(eMsg);
		throw new RuntimeException(eMsg);
	}
	
	// End of   : Failure Handling utils
	
	public boolean checkMessageForThisUser(List<Long> messagesID){
		
		boolean isAnyMaliciousData = false;
		List<LoginMessage> messages = SecurityUtil.getMyUser().getLoginMessagesToDisplay();
		List<Long> msgIds = new ArrayList<Long>();
		for(LoginMessage msg : messages){
			msgIds.add(msg.getId());
		}
		
		for (Long id : messagesID){
			if(!(msgIds.contains(id))){
				isAnyMaliciousData = true;
				failMalicious("checkMessageForThisUser() found a malicious message Id being passed");
			}
		}
		return isAnyMaliciousData;
	}

	
}
