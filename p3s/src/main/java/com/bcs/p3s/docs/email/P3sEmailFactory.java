package com.bcs.p3s.docs.email;

import com.bcs.p3s.docs.email.Populators.AbstractPopulator;
import com.bcs.p3s.docs.email.Populators.CertificatePopulator;
import com.bcs.p3s.docs.email.Populators.RegisterPopulator;
import com.bcs.p3s.docs.email.Populators.ReminderStandardPopulator;
import com.bcs.p3s.docs.email.Populators.TransactionPopulator;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.util.lang.Universal;

public class P3sEmailFactory extends Universal implements EmailTemplates {

	// default constructor
	
	public P3sEmail create(String template 
			, Object param1
			, Object param2
			, Object param3
			, Object param4
			, Object param5
			, Object param6
			, Object param7
			)   // extend params as needed ...
	{
		String err = "P3sEmailFactory create("+template+") : ";
		P3sEmail email = null;
		try {
			boolean noBuild = true;
			AbstractPopulator pop = null;
			
			if (EmailTemplates.email_register_combined.equals(template)) {
				pop = new RegisterPopulator(template, param1);
				noBuild = false;
			}
			if (EmailTemplates.email_reminder_standard.equals(template)) {
				pop = new ReminderStandardPopulator(template, param1, param2, param3, param4, param5);
				noBuild = false;
			}
			if ((EmailTemplates.email_proforma_invoice.equals(template))
					 || (EmailTemplates.email_final_invoice.equals(template))
					 || (EmailTemplates.email_penalty_invoice.equals(template)) )
			{
				pop = new TransactionPopulator(template, param1, param2, param3, param4, param5, param6, param7);
				noBuild = false;
			}
			if (EmailTemplates.email_renewal_certificate.equals(template)) {
				pop = new CertificatePopulator(template, param1, param2, param3, param4, param5, param6, param7);
				noBuild = false;
			}
			
			if (noBuild) {
				fail("Failed to find email populator for template "+template);
			}
			
			email = pop.generateEmail();
		} catch (Exception e) {
			fail("Caught unexpected problem",e);
		}
		return email;
	}
		




	///////  INVOKING CLIENT SERVICE WOULD USE

//	P3sEmailFactory emailFactory = new P3sEmailFactory();
//	P3sEmail email = emailFactory.create("email_register_combined", paramZZZ);
//	String subject = email.getSubject();
//	String hBody = email.getHtmlBody();



}
