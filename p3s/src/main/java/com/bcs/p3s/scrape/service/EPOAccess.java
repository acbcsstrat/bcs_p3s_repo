package com.bcs.p3s.scrape.service;

import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Claims;
import com.bcs.p3s.scrape.model.Form1200Record;

public interface EPOAccess {
	
	public Patent readEPORegisterForRenewals(String patentApplicationNumber);
	
	//------------ Below are the scraping methods for FORM1200 -----------
	public Form1200Record readEPORegisterForForm1200(String patentApplicationNumber);
	
	public Claims readEPOForClaims(String patentPublicationNumber);
	
	public String readEPOForAbstract(String patentPublicationNumber);

}
