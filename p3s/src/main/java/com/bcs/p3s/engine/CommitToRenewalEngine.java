package com.bcs.p3s.engine;

import com.bcs.p3s.util.lang.Universal;

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

	
	
}
