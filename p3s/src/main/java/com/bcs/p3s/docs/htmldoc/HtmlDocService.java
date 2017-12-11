package com.bcs.p3s.docs.htmldoc;

import com.bcs.p3s.docs.htmldoc.model.ProformaInvoice;
import com.bcs.p3s.model.Payment;

public interface HtmlDocService {

	
	/**
	 * Assemble all the data needed to populate the htmlDoc page of type : ProformaInvoice 
	 * @return a populated ProformaInvoice object
	 */
	public ProformaInvoice getDataForProformaInvoice(Payment payment);

	
	
}
