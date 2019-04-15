package com.bcs.p3s.security;

import javax.persistence.TypedQuery;

import org.springframework.security.core.context.SecurityContextHolder;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.lang.Universal;

public class SecurityUtil extends Universal {

	public static synchronized String getMyUserName() { // Potential performance point - for Thread-Safety
		System.out.println("                     SecurityUtil:getMyUserName() invoked");

		//P3SUser me = (P3SUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = SecurityContextHolder.getContext().getAuthentication().getName();

		System.out.println("                                                  returning "+ username);
		return username;
	}


	public static synchronized P3SUser getMyUser() { // Potential performance point - for Thread-Safety
		System.out.println("                     SecurityUtil:getMyUser() invoked");
		String username =  getMyUserName();
		TypedQuery<P3SUser> tq_user = P3SUser.findP3SUsersByEmailAddress(username);
		if (tq_user==null) { 
			System.out.println("INTERNAL ERROR: ToDo: User lookup failed"); 

			Universal universal = new Universal();
			universal.logErrorAndContinue("getMyUser() is NULL ! - Expect Imminent crash !   (User session TimedOut ?)  from SecurityUtil { timeout }");
		}
		P3SUser myUser = tq_user.getSingleResult();
		return myUser;
	}
	
	
//	public static synchronized P3SUser getMyUser() { // Potential performance point - for Thread-Safety
//		System.out.println("                     SecurityUtil:getMyUser() invoked");
//
//		//P3SUser me = (P3SUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//		String username = SecurityContextHolder.getContext().getAuthentication().getName();
//
//		System.out.println("                     SecurityUtil:getMyUser() returning "+ me.getEmailAddress());
//		return me;
//	}
	
	public static String getMyUserEmail() {
		return getMyUser().getEmailAddress();
	}
	
//	public static Long getMyP3SUserID() {
//		return getMyUser().getId();
//	}
	

	public static Business getMyBusiness() {
		System.out.println("                     SecurityUtil:getMyBusiness() invoked");

		Business myBusiness = getMyUser().getBusiness();

		System.out.println("                     SecurityUtil:getMyBusiness() returning Business"
					+myBusiness.getId()+" :: "+myBusiness.getBusinessName());
		return myBusiness;
	}
    	
	/**
	 * The UI will often request data for a specific patent.
	 * As data from the front end cannot be trusted, this allows a simple way of verifying that the user is indeed 
	 * authorised to access the requested patent
	 * @return true if the user IS authorised to access the requested patent
	 */
	public static boolean isThisMyPatent(Long patentID) {
		boolean isAuthorised = false;   // failsafe

		Business myBusiness = getMyUser().getBusiness();
		if (myBusiness!=null && (myBusiness.getId() == patentID)) isAuthorised = true; 
		
		if (isAuthorised) System.out.println("                     SecurityUtil:isThisMyPatent("+patentID+") IS authorised");
		else {
			System.out.println("ATTEMPTED SECURITY BREACH (or incompetent coding:). Details follow");
			System.out.println("ATTEMPTED SECURITY BREACH (or incompetent coding:). User "+getMyUserEmail()+" requested access to Patent "+patentID);
			// Todo: convert syso to LOGs - inc Security LOG
		}
		return isAuthorised;
	}
    	
}
