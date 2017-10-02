/**
 * 
 */
package com.bcs.p3s.docs;

import java.util.Calendar;

import com.bcs.p3s.enump3s.InvoiceStatusEnum;
import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;

/**
 * A class that holds all the invoicing related activities
 * 	populating data for persisting and Updating Invoice Table
 * 	generating invoice doc
 * 
 * @author MerinP
 *
 */
public class InvoiceProcessingEngine {
	
	protected String PREFIX = this.getClass().getName() + " : "; 

	
	public Invoice populateInvoiceData(BankTransferPostCommitDetails postCommitData){
		
		Invoice invoice = new Invoice();
		
		invoice.setInvoiceNumber("Empty");
		invoice.setIssueDate(Calendar.getInstance().getTime());
		invoice.setInvoiceStatus(InvoiceStatusEnum.OPEN);
		invoice.setPreceedingInvoiceId(null);
		invoice.setInvoiceType(InvoiceTypeEnum.PROFORMA);
		//dummy values start
		invoice.setDocPath("hardcodedpdffolder/invoices/");
		invoice.setFilename("dummyInvoiceNumber1.pdf");
		invoice.setInvoiceTemplateId("template1");
		//dummy values end
		
		return invoice;
	}

	public String generateProFormaInvoiceNumber(Invoice invoice) {
		if (invoice==null) return null;
		String result = "IP";
		result += String.format("%06d", invoice.getId());
		result += "PF";
		return result;
	}
	
}
