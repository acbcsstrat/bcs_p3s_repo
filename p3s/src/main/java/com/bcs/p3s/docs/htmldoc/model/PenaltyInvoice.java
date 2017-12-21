package com.bcs.p3s.docs.htmldoc.model;


import java.math.BigDecimal;

import com.bcs.p3s.engine.PricingEngine;
import com.bcs.p3s.enump3s.InvoiceStatusEnum;
import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.enump3s.McFailCodeEnum;
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
	protected String penaltyPaymentReferenceNumber;
	protected String invoiceStatusMessage;
	

	protected final String PAID = "PAID";
	protected final String UNPAID = "Awaiting Payment";

	
	public PenaltyInvoice(Invoice invoice) {
		super(invoice); // provides more than needed
		bankDetails = new BankTransferPaymentDetails();

		// Now add/update certain data
		failReason = invoice.getPayment().getFailureReason();
		if (isEmpty(failReason)) {
			String failCode = invoice.getPayment().getMC_failCode();
			if (isEmpty(failCode)) fail("PenaltyInvoice constructor missing fails for inv ["+invoice.getId()+"]");
			McFailCodeEnum mcEnum = new McFailCodeEnum(failCode);
			failReason = mcEnum.toCustomerFacingString();
			log().debug("PenaltyInvoice ["+invoice.getId()+"] failReason missing so used failCode");
		}

		PricingEngine pricingEngine = new PricingEngine();
		Business business = null;
		try {
			business = invoice.getPayment().getRenewals().get(0).getPatent().getBusiness();
		} catch (Exception e) { fail("PenaltyInvoice constructor cannot navigate from invoice ["
			+((invoice==null)?"Null":invoice.getId())+"]",e); }

		P3SFeeSole p3sFee = pricingEngine.getEffectiveP3sFees(business);
		this.totalUsdPayable = p3sFee.getLatePayPenalty_USD()
				.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
			
		// The original failed invoice will always be a ProForma invoice
		originalFailedInvoiceNumber = this.getTransactionReference()
				+getInvoiceNumberSuffix(InvoiceTypeEnum.PROFORMA.toString());
		
		// Penalty invoice is unusual in that the BankTransfer reference DOES include the suffix
		penaltyPaymentReferenceNumber = this.getTransactionReference()
				+getInvoiceNumberSuffix(InvoiceTypeEnum.PENALTY.toString());

		InvoiceStatusEnum invoiceStatusEnum = new InvoiceStatusEnum(invoice.getInvoiceStatus());
		if (InvoiceStatusEnum.OPEN.equalsIgnoreCase(invoiceStatusEnum.toString())) {
			invoiceStatusMessage = UNPAID;
		}
		else 			invoiceStatusMessage = PAID;

			

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
	public String getPenaltyPaymentReferenceNumber() {
		return penaltyPaymentReferenceNumber;
	}
	public String getInvoiceStatusMessage() {
		return invoiceStatusMessage;
	}

}
