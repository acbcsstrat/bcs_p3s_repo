/**
 * 
 */
package com.bcs.p3s.docs;

import java.util.Calendar;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.enump3s.InvoiceStatusEnum;
import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;

/**
 * A class that holds all the invoicing related activities
 * 	populating data for persisting and Updating Invoice Table
 * 	generating invoice doc
 * 
 * @author MerinP
 *
 */
public class InvoiceProcessingEngine extends Universal {
	
	protected String PREFIX = this.getClass().getName() + " : "; 

	
	public Invoice populateProformaInvoiceData(BankTransferPostCommitDetails postCommitData){
		
		Invoice invoice = new Invoice();
		
		invoice.setInvoiceNumber("Empty");
		invoice.setIssueDate(Calendar.getInstance().getTime());
		invoice.setInvoiceStatus(InvoiceStatusEnum.OPEN);
		invoice.setPreceedingInvoiceId(null);
		invoice.setInvoiceType(InvoiceTypeEnum.PROFORMA);
		//dummy values start - acTidy
//		invoice.setDocPath("hardcodedpdffolder/invoices/");
//		invoice.setFilename("dummyInvoiceNumber1.pdf");
//		invoice.setInvoiceTemplateId("template1");
		//dummy values end
		
		return invoice;
	}


//	public String generateProFormaInvoiceNumber(Invoice invoice) {
//	if (invoice==null) return null;
//	String result = "IP";
//	result += String.format("%06d", invoice.getId());
//	result += "PF";
//	return result;
//}
// below made redundant by CommitToRenewalEngine extends Universal : public String generateP3sTransRef
//	public String generateP3sTransactionNumber(Payment payment) {
//		if (payment==null) return null;
//		String result = null;
//		Long businessPart = payment.getInitiatedByUserId().getBusiness().getId();
//		Long txnPart = payment.getId();
//		result = "IP"+padWithLeadingZeros(businessPart,4)+padWithLeadingZeros(txnPart,6);
//		return result;
//	}
//	protected String padWithLeadingZeros(Long number, int digits) {
//		String num = number.toString();
//		if (num.length()>digits) fail("Unthinkable. NoPadNeeded. Already too big "+number+":"+digits);
//		int padders = digits - num.length();
//		String pad = "";
//		for (int ii = num.length()+1 ; ii<digits ; ii++) { pad+="0"; }
//		String ret = pad+num;
//		log().debug("padWithLeadingZeros "+number+":"+digits+" yields "+ret);
//		return ret;
//	}
	public String generateProFormaInvoiceNumber(Payment payment) {
		if (payment==null) return null;
		String result = payment.getP3S_TransRef();
		result += getInvoiceNumberSuffix(InvoiceTypeEnum.PROFORMA);
		return result;
	}
	protected String getInvoiceNumberSuffix(String invoiceType) {
		String suffix = "";
		if (InvoiceTypeEnum.PROFORMA.equalsIgnoreCase(invoiceType)) suffix = "PF";
		if (InvoiceTypeEnum.PENALTY.equalsIgnoreCase(invoiceType)) suffix = "P";
		return suffix;
	}

	
	
	public Invoice populateFinalInvoiceData(Payment payment) {
		if (payment==null) fail(PREFIX+":populateFinalInvoiceData() passed null");
		String err = PREFIX+" : populateFinalInvoiceData("+payment.getId()+")";

		Invoice newInvoice = new Invoice(); 
		Invoice existingInvoice = payment.getLatestInvoice();
		if (existingInvoice==null) fail(err+" found existingInvoice is missing");
		
		newInvoice.setPayment(payment);
		newInvoice.setInvoiceNumber(stripProForma(existingInvoice.getInvoiceNumber()));
		newInvoice.setIssueDate(Calendar.getInstance().getTime());
		newInvoice.setInvoiceStatus(InvoiceStatusEnum.OPEN);
		newInvoice.setPreceedingInvoiceId(existingInvoice);
		newInvoice.setInvoiceType(InvoiceTypeEnum.FINAL);
		//dummy values start
		newInvoice.setDocPath("hardcodedpdffolder/invoices/");
		newInvoice.setFilename("dummyInvoiceNumber1.pdf");
		newInvoice.setInvoiceTemplateId("template1");
		//dummy values end

		return newInvoice;
	}

	
	
	
	
	
	
	
	
	
	
	
	public String generateInvoicePDF(Invoice invoice) {
		if (invoice==null) return null;
		String err = PREFIX+"generateInvoicePDF("+invoice.getId()+") ";
		log().debug("invoked "+ err);

		String filename = "dummyInvoiceNumber1.pdf";
		
		DummyDataEngine dummy = new DummyDataEngine();  // Flag up incompleteness
		log().warn("Generating PDFs of Invoices is NOT YET WRITTEN"); // acToDo
		
		
		log().debug("Completed "+ err);
		return filename;
	}
	
	

	// Support methods
	
	/**
	 * A ProForma invoice number should end 'PF'. 
	 * The subsequent Final invoice number should be the same number, but without the PF
	 * This strips the PF 
	 * @param proFormaInvoiceNumber 
	 * @return proFormaInvoiceNumber with any trailing PF removed
	 */
	protected String stripProForma(String proFormaInvoiceNumber) { // acTidy - relocate this lower
		if (proFormaInvoiceNumber==null) return proFormaInvoiceNumber;
		String finalInvoiceNumber = proFormaInvoiceNumber;
		if (proFormaInvoiceNumber.endsWith("PF")) {
			finalInvoiceNumber = proFormaInvoiceNumber.substring(0, proFormaInvoiceNumber.length()-2);
		} 
		return finalInvoiceNumber;
	}


}
