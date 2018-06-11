/**
 * 
 */
package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.scrape.model.Claims;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.session.PostLoginSessionBean;

/**
 * @author MerinP
 *
 */
public interface MiscService {

	public LoginMessageUI findAllLoginMessagesForUser(PostLoginSessionBean pLoginBean);
	
	public void suppressLoginMessages(List<Long> id, P3SUser user);
	
	//------------ Below are the scraping methods for FORM1200 -----------
	public Form1200Record readEPOForForm1200(String patentPublicationNumber);
		
	public Claims getClaims(String patentApplicationNumber);

}
