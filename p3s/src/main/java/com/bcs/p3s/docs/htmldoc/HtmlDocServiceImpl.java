package com.bcs.p3s.docs.htmldoc;

import org.springframework.stereotype.Service;

import com.bcs.p3s.docs.htmldoc.model.ProformaInvoice;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.service.ServiceAuthorisationTools;

@Service("HtmlDocService")
public class HtmlDocServiceImpl extends ServiceAuthorisationTools implements HtmlDocService  {

	protected String PREFIX = this.getClass().getName() + " : "; 

	public ProformaInvoice getDataForProformaInvoice(Payment payment) {

		if (payment==null) return null;
		String err = PREFIX+"getDataForProformaInvoice() ";
		log().debug(err+" invoked ");
//		checkAreMyPatents(patentIds, err);


		Invoice invoice = payment.getLatestInvoice();
		ProformaInvoice proformaInvoice = new ProformaInvoice(invoice);
		
		
		
		return proformaInvoice;
	}

	
}
