package com.bcs.p3s.docs.htmldoc.model;

import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;

public class ProformaInvoice extends AbstractInvoice {

	protected BankTransferPaymentDetails bankDetails; 
//	WILL ass Patent here 
	
	
	public ProformaInvoice(Invoice invoice) {
		super(invoice);
		bankDetails = new BankTransferPaymentDetails();
		
	}


	public BankTransferPaymentDetails getBankDetails() {
		return bankDetails;
	}



}
