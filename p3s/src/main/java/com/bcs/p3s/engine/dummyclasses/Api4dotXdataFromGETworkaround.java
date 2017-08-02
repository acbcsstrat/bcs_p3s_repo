package com.bcs.p3s.engine.dummyclasses;

import java.math.BigDecimal;
import java.util.List;

/** a temporary class - see package-info.java 
 * 
 * THIS class can be used for api section 4.1, 4.2 & 4.3
 * as progressively, each adds more fields
 * 
 * **/
public class Api4dotXdataFromGETworkaround {

	// fields for API section 4.1
	public List<Long> patentIds;
	
	// Here are the ADDITIONAL fields for API section 4.2
	public BigDecimal expectedCost;

	// Here are the ADDITIONAL fields for API section 4.3
	public String billingAddressStreet;
	public String billingAddressCity;
	public String billingAddressState;
	public Long billingAddressZip;

	
	

	// no need for getters & setters - all members are public
}
