package com.bcs.p3s.engine;

import java.lang.management.PlatformLoggingMXBean;

import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;

/**
 * This engine handles the processing when a customer Commits to the renewal of one or more patenta.
 * This is the moment when they Commit to making a Bank Transfer (Future: Or successfully complete a Card Payment)
 * 
 * An important part of this is creating instances in the correct order
 * then doing the 'catch-up' - i.e. populating those ?circular? relationships that could not be created at instantiation time.
 * 
 * The order is:
 * - Invoice
 * - Payemnt (aka Transaction)
 * - Fee
 * - [Certificate - but this is actually created much later]
 * - Renewal
 *
 * The catch-ups then are:
 * In Invoice, populate the field called payment
 * In Payment, populate the list called renewals
 * In Fee, populate the field called renewal
 * In Certificate, populate the field called renewal
 *
 * 
 *
 */
public class CommitToRenewalEngine extends Universal {
	
	
	public String generateP3sTransRef(PostLoginSessionBean pLoginSession) {
		
		String p3sTransRef = "IP";
		
		if( !(pLoginSession.getBusiness() == null || pLoginSession.getUser() == null)){
			String part1 = "";
			String part2 = "";
			
			part1 = String.format("%04d", pLoginSession.getUser().getId());
			part2 = String.format("%06d", pLoginSession.getBusiness().getId());
			
			p3sTransRef = p3sTransRef.concat(part1).concat(part2);
			
		}
		
		if(!(p3sTransRef.length() == P3SPropertyNames.P3sTransRef_Length) ){
			logmaliciousN4CU.fatal("generateP3sTransRef() failed creating 12 character reference");
			return p3sTransRef;
		}
			
		return p3sTransRef;
	}

	
	
	
}
