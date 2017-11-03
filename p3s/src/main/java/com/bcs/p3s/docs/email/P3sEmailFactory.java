package com.bcs.p3s.docs.email;

import com.bcs.p3s.docs.email.Populators.AbstractPopulator;
import com.bcs.p3s.docs.email.Populators.RegisterPopulator;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.lang.Universal;

public class P3sEmailFactory extends Universal implements EmailTemplates {

	// default constructor
	
	public P3sEmail create(String template, Object param1) {  // extend params as needed ...
		String err = "P3sEmailFactory create("+template+") : ";
		P3sEmail email = null;
		boolean noBuild = true;
		AbstractPopulator pop = null;
		
		if (EmailTemplates.email_register_combined.equals(template)) {
			pop = new RegisterPopulator(template, param1);
			noBuild = false;
		}
		
		
		
		
		
		if (noBuild) {
			fail("Failed to find email populator for template "+template);
		}
		
		email = pop.generateEmail();
		return email;
	}
		




	///////  INVOKING CLIENT SERVICE WOULD USE

//	P3sEmailFactory emailFactory = new P3sEmailFactory();
//	P3sEmail email = emailFactory.create("email_register_combined", paramZZZ);
//	String subject = email.getSubject();
//	String hBody = email.getHtmlBody();



}
