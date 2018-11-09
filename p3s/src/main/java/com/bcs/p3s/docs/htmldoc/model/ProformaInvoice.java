package com.bcs.p3s.docs.htmldoc.model;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;

public class ProformaInvoice extends AbstractInvoice {

	protected BankTransferPaymentDetails bankDetails; 
	protected List<Patent4htmlDoc> patents = new ArrayList<Patent4htmlDoc>();
	
	
	public ProformaInvoice(Invoice invoice) {
		super(invoice);
		bankDetails = new BankTransferPaymentDetails();
		transactionType = PaymentTypeEnum.STANDARD_PAYMENT;
		
		List<Renewal> renewals = invoice.getPayment().getRenewals();
		int ii = 1;
		for (Renewal renewal : renewals) {
			Patent4htmlDoc patent4hd = new Patent4htmlDoc(renewal);
			patent4hd.setNumberInList(Integer.valueOf(ii++).toString());
			patent4hd.setListSize(Integer.valueOf(renewals.size()).toString());
			patents.add(patent4hd);
		}
	}

	// getters
	public List<Patent4htmlDoc> getPatents() {
		return patents;
	}
	public BankTransferPaymentDetails getBankDetails() {
		return bankDetails;
	}

}
