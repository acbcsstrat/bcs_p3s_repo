package com.bcs.p3s.docs.htmldoc.model;


import java.math.BigDecimal;

import com.bcs.p3s.engine.PricingEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;

/**
 * Holds all the data needed by proformainvoice.jsp
 * Can also be used by finalinvoice.jsp - as that only needs a subset of this data
 */
public class PenaltyInvoice extends AbstractInvoice {

	protected BankTransferPaymentDetails bankDetails; 
	protected String failReason;
	protected String originalFailedInvoiceNumber;
	
	
	public PenaltyInvoice(Invoice invoice) {
		super(invoice); // provides more than needed
		bankDetails = new BankTransferPaymentDetails();

		// Now add/update certain data
		failReason = invoice.getPayment().getFailureReason();

		PricingEngine pricingEngine = new PricingEngine();
		Business business = null;
		try {
			business = invoice.getPayment().getRenewals().get(0).getPatent().getBusiness();
		} catch (Exception e) { fail("PenaltyInvoice constructor cannot navigate from invoice ["
			+((invoice==null)?"Null":invoice.getId())+"]",e); }

		P3SFeeSole p3sFee = pricingEngine.getEffectiveP3sFees(business);
		this.totalUsdPayable = p3sFee.getLatePayPenalty_USD()
				.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
			
		originalFailedInvoiceNumber = "HHHooooooOOOOOO";
	
	}

	
	// getters
	public BankTransferPaymentDetails getBankDetails() {
		return bankDetails;
	}
	public String getFailReason() {
		return failReason;
	}
	public String getOriginalFailedInvoiceNumber() {
		return originalFailedInvoiceNumber;
	}
}
