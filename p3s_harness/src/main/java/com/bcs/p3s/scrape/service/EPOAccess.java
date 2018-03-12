package com.bcs.p3s.scrape.service;

import com.bcs.p3s.model.Patent;

public interface EPOAccess {
	
	public Patent populatePatentEPOData(String patentApplicationNumber);

}
