package com.bcs.p3s.docs.email;

import com.bcs.p3s.docs.email.Populators.AbstractPopulator;
import com.bcs.p3s.docs.email.Populators.CertificatePopulator;
import com.bcs.p3s.docs.email.Populators.ForgotPasswordPopulator;
import com.bcs.p3s.docs.email.Populators.InternalUseOnlyPopulator;
import com.bcs.p3s.docs.email.Populators.RegisterPopulator;
import com.bcs.p3s.docs.email.Populators.ReminderBasicDetailsPopulator;
import com.bcs.p3s.docs.email.Populators.ReminderColourOpenPopulator;
import com.bcs.p3s.docs.email.Populators.ReminderInBlackPopulator;
import com.bcs.p3s.docs.email.Populators.ReminderStandardPopulator;
import com.bcs.p3s.docs.email.Populators.TransactionPopulator;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.util.lang.Universal;

/** Factory. Selecets appropriate factory for the email template, and invokes to provide a P3sEmail
 */
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
			boolean bccEmailToOps = false;
			
			// Email supporting customer Registrations with P3S
			if (EmailTemplates.email_register_combined.equals(template)) {
				pop = new RegisterPopulator(template, param1);
				noBuild = false;
				bccEmailToOps = true;
			}

			// Email supporting customer password reset
			if (EmailTemplates.email_password_reset.equals(template)) {
				pop = new ForgotPasswordPopulator(template, param1, param2);
				noBuild = false;
			}

			// 'Notification' Emails : Reminding custoers that a patent can be renewed
			if (EmailTemplates.email_reminder_standard.equals(template)) {
				pop = new ReminderStandardPopulator(template, param1, param2, param3, param4, param5);
				noBuild = false;
			}
			if (EmailTemplates.email_reminder_green_opens.equals(template)
					 || EmailTemplates.email_reminder_blue_opens.equals(template)) {
						pop = new ReminderColourOpenPopulator(template, param1, param2, param3);
						noBuild = false;
			}
			if (EmailTemplates.email_reminder_black_5day.equals(template)) {
				pop = new ReminderInBlackPopulator(template, param1, param2, param3, param4, param5);
				noBuild = false;
			}
			if (EmailTemplates.email_reminder_after_black.equals(template)) {
				pop = new ReminderBasicDetailsPopulator(template, param1, param2);
				noBuild = false;
			}
			
			// Transaction Emails - relating to a renewal order
			if ((EmailTemplates.email_proforma_invoice.equals(template))
					 || (EmailTemplates.email_final_invoice.equals(template))
					 || (EmailTemplates.email_penalty_invoice.equals(template)) )
			{
				pop = new TransactionPopulator(template, param1, param2, param3, param4, param5, param6, param7);
				noBuild = false;
				
				if (EmailTemplates.email_proforma_invoice.equals(template)) bccEmailToOps = true;
			}
			if (EmailTemplates.email_renewal_certificate.equals(template)) {
				pop = new CertificatePopulator(template, param1, param2, param3, param4, param5, param6, param7);
				noBuild = false;
			}
			if (EmailTemplates.email_panic.equals(template)) {
				pop = new InternalUseOnlyPopulator(template, param1, param2);
				noBuild = false;
			}
			
			if (noBuild) {
				fail("Failed to find email populator for template "+template);
			}
			
			email = pop.generateEmail();
			if (bccEmailToOps) email.setBccToOps(true);
			
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
