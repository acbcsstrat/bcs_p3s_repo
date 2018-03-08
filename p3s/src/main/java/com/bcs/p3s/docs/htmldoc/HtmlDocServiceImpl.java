package com.bcs.p3s.docs.htmldoc;

import org.springframework.stereotype.Service;

import com.bcs.p3s.docs.htmldoc.model.HtmlDocCertificate;
import com.bcs.p3s.docs.htmldoc.model.PenaltyInvoice;
import com.bcs.p3s.docs.htmldoc.model.ProformaInvoice;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.service.ServiceAuthorisationTools;

@Service("HtmlDocService")
public class HtmlDocServiceImpl extends ServiceAuthorisationTools implements HtmlDocService  {

	protected String PREFIX = this.getClass().getName() + " : "; 

	public ProformaInvoice getDataForProformaInvoice(Payment payment) {

		String err = PREFIX+"getDataForProformaInvoice() ";
		checkIsMyPayment(payment, err);
		log().debug(err+" invoked ");

		Invoice invoice = payment.getLatestInvoice();
		ProformaInvoice proformaInvoice = new ProformaInvoice(invoice);
		
		return proformaInvoice;
	}

	public PenaltyInvoice getDataForPenaltyInvoice(Payment payment) {

		String err = PREFIX+"getDataForPenaltyInvoice() ";
		checkIsMyPayment(payment, err);
		log().debug(err+" invoked ");

		Invoice invoice = payment.getLatestInvoice();
		PenaltyInvoice penaltyInvoice = new PenaltyInvoice(invoice);
		
		return penaltyInvoice;
	}

	public HtmlDocCertificate getDataForCertificate(Renewal renewal) {
		
		String err = PREFIX+"getDataForCertificate() ";
		checkThisIsMyPatent(renewal.getPatent().getId(), err);
		log().debug(err+" invoked ");

		HtmlDocCertificate certificate = new HtmlDocCertificate(renewal);
		
		return certificate;
	}

}
