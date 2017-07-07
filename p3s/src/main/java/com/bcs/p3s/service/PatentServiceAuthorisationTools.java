package com.bcs.p3s.service;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.model.Patent;
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
public class PatentServiceAuthorisationTools extends Universal {

	@Autowired
	HttpSession session;

	
	protected void authReminder() {
		System.out.println("");
		System.out.println("AUTHORISATION REMINDER:");
		System.out.println("PatentServiceAuthorisationTools authReminder Invoked - This is a REMINDER that you don't yet have proper auorisation checking");
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
			checkThisIsMyPatent(id, err);
		checkNotNull(patentUI, err);
		checkIsTrue((patentUI.getId().longValue()==id), err);
	}
	
	
	// End of   : Higher Level tools
	
	
	// Start of : Lower Level tools

	// Singleton for session info
	protected PostLoginSessionBean me = null;
	protected PostLoginSessionBean checkThisIsMy() {
		if (me==null) {
			log().debug("PatentServiceAuthorisationTools me singleton being instantiated."); // Use this to monitor destructions
			me = (PostLoginSessionBean) session.getAttribute("postSession");
			if ((me==null) || (me.getUser()==null) || (me.getBusiness()==null) ) {
				String msg = "***  PatentServiceAuthorisationTools checkThisIsMy() failed to retreive good session info ***";
				System.out.println(msg);
				logInternalError().fatal(msg);
				assert false : "4768";
			}
		}
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
	
	protected void checkIsTrue(boolean errorIfFalse, String err) {
		err += "  [on checkIsTrue]";
		if (errorIfFalse==false) 
																	failInternalError(err); 
	}
	protected void checkIsFalse(boolean otherWay, String err) { checkIsTrue( ! otherWay, err); }
	
	
	
	
	
	
	// End of   : Lower Level tools
	

	// Start of : Failure Handling utils

	protected void failInternalError(String msg) {
		String eMsg = "*** [failInternalError]   "+msg+" ***";
		System.out.println(eMsg);
		logInternalError().fatal(eMsg);
		throw new RuntimeException(eMsg);
	}
	
	protected void failMalicious(String msg) {
		String eMsg = "*** [failMalicious]   "+msg+" ***";
		System.out.println(eMsg);
		logM().fatal(eMsg);
		throw new RuntimeException(eMsg);
	}
	
	// End of   : Failure Handling utils
	

	
	
	// envise summat like as GENERAL CONTRACT for theses tools
	// is this my patent / transaction / ...
	// logM or logIntErr as approp
	// if Malicious - throu rentime exception
	
	
	
	
	// for UPDATE patent
//	if (patentUI==null || id<1 || (id!=patentUI.getId()) ) {
//		if (patent.getBusiness().getId() != usersBusiness.getId()) logM().warn(err+" rqsted by userId"+pLoginSession.getUser().getId()); 
//		return null;
//	}   also check : UI.getNotificationUIs() notNull

	//
//	PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
//	Business usersBusiness = pLoginSession.getBusiness();

	
	
	
	
	
	
	
}
