package com.bcs.p3s.docs.htmldoc.model;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.model.Epct;
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
		List<Epct> epcts = invoice.getPayment().getEpcts();
		int productCounter = 0;
		int numProducts = renewals.size() + epcts.size();
		
		for (Renewal renewal : renewals) {
			Patent4htmlDoc patent4hd = new Patent4htmlDoc(renewal);
			patent4hd.setNumberInList(Integer.valueOf(++productCounter).toString());
			patent4hd.setListSize(Integer.valueOf(numProducts).toString());
			patent4hd.setServiceType("Renewal");
			patents.add(patent4hd);
		}

		for (Epct epct : epcts) {
			Patent4htmlDoc patent4hd = new Patent4htmlDoc(epct);
			patent4hd.setNumberInList(Integer.valueOf(++productCounter).toString());
			patent4hd.setListSize(Integer.valueOf(numProducts).toString());
			patent4hd.setServiceType("Euro-PCT");
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
