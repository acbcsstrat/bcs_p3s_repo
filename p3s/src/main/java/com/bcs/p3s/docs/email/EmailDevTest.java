package com.bcs.p3s.docs.email;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.util.email.EmailSender;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;

/**
 * For development testing : Sends emails to hardcoded recipient(s)
 */
public class EmailDevTest extends Universal {

	P3sEmail email;
	P3sEmailFactory emailFactory = new P3sEmailFactory();
	P3SUser acUser = SecurityUtil.getMyUser();
	List<Patent> patents = new ArrayList<Patent>();
	Patent onePatent;
	List<Patent> fourPatents = new ArrayList<Patent>();
	BankTransferPaymentDetails payee = new BankTransferPaymentDetails();

	public void testByCode(int code) {
		log().debug("EmailDevTest testByCode : invoked  : param = " + code);

		if (code == 100) {
			log().debug("Generate Register email - email_register_combined");
			emailRegistration();
		} else if (code >= 200 && code < 300) {
			log().debug("Send an Invoice/certificate");
			emailPdf(code);
		}
		else if (code>=300 && code <400) {
			log().debug("Send an Reminder Email - Colour Open");
			emailReminder(code, "NOT.USED");
		}
		else if (code >= 400 && code < 700) {
			log().debug("Send an Reminder Email");
			String howSoon = "6 weeks";
			//if (code >= 400 && code < 410) howSoon = "";
			if (code == 450) howSoon = "12 weeks";
			if (code == 455) howSoon = "2 weeks";
			if (code == 460) howSoon = "7 days";
			if (code == 465) howSoon = "5 days";
			if (code == 470) howSoon = "3 days";
			if (code == 475) howSoon = "2 days";
			if (code == 480) howSoon = "1 day";

			emailReminder(code, howSoon);
		}
		// else if (code==700) {
		// log().debug("RED - 1 day left");
		// }
		 else if (code==730) {
			 // email_reminder_black_5day 
			 log().debug("BLACK - 5 days left");
				String howSoon = "5 days";
				emailReminder(code, howSoon);
		 }
		 else if (code==760) {
			//email_reminder_after_black
			log().debug("AFTER Black");
			emailReminder(code, null);
		 }
		 else if (code==999) {
			// test panic()
			// Doscontinued from here - no pwd check. Available elsewhere. LogM any usage 
			// panic("Test PANIC message from EmailDevTest. \nNo attached exception.");
			logM().warn("someone has invoked actest-acgenerateemail-code999. Should not be possible");
			
		 }

		 else
			log().fatal("This should not be possible. Code=" + code);

			//		  <option value="100">email_register_combined</option>
			//
			//		  <option value="200">email_proforma_invoice - 1 patent</option>
			//		  <option value="210">email_proforma_invoice - 4 patents</option>
			//		  <option value="220">email_final_invoice - 4 patents</option>
			//		  <option value="240">email_renewal_certificate</option>
			//		  <option value="250">email_penalty_invoice - 1 patent</option>
			//		  <option value="260">email_penalty_invoice - 4 patent</option>
			//
			//		  <option value="300">email_reminder_green_opens - Green</option>
			//		  <option value="310">email_reminder_blue_opens - Blue</option>
			//
			//		  <option value="400">email_reminder_standard - 6 weeks - Patent1</option>
			//		  <option value="401">email_reminder_standard - 6 weeks - Patent2</option>
			//		  <option value="402">email_reminder_standard - 6 weeks - Patent3</option>
			//		  <option value="403">email_reminder_standard - 6 weeks - Patent4</option>
			//		  <option value="404">email_reminder_standard - 6 weeks - Patent5</option>
			//
			//		  <option value="450">email_reminder_standard - 12 weeks</option>
			//		  <option value="455">email_reminder_standard - 2 weeks</option>
			//		  <option value="460">email_reminder_standard - 7 days</option>
			//		  <option value="465">email_reminder_standard - 5 days</option>
			//		  <option value="470">email_reminder_standard - 3 days</option>
			//		  <option value="475">email_reminder_standard - 2 days</option>
			//		  <option value="480">email_reminder_standard - 1 day</option>
			//
			//		  <!--   <option value="700">WIP email_reminder_red_1day</option>  -->
			//		  <option value="730">email_reminder_black_5day</option>
			//		  <option value="760">email_reminder_after_black</option>
			//		  <option value="999">test panic()</option>


	}

	protected void emailRegistration() {
		Business business = acUser.getBusiness();
		email = emailFactory.create(EmailTemplates.email_register_combined, acUser.getEmailAddress(),
				business.getBusinessNumber(), business.getBusinessPin(), null, null, null, null);
		send();
	}

	protected void emailPdf(int code) {
		log().debug("emailPdf code=" + code);
		// prepareSomeData();
		preparePatents();
		if (code == 210 || code == 220 || code == 260)
			patents = fourPatents;
		else
			patents.add(onePatent);

		if (code >= 200 && code < 220) {
			email = emailFactory.create(EmailTemplates.email_proforma_invoice, acUser, "IP0003000009",
					"Nov 22, 2017 17:01 CET", "dummyInvoiceNumber1.pdf", patents, payee, "1234.89");
			send();
		} else if (code >= 220 && code < 240) {
			email = emailFactory.create(EmailTemplates.email_final_invoice, acUser, "IP0003000009",
					"Nov 22, 2017 17:01 CET", "dummyInvoiceNumber1.pdf", patents, payee, "1234.89");
			send();
		} else if (code >= 240 && code < 250) {
			email = emailFactory.create(EmailTemplates.email_renewal_certificate, acUser, "IP0003000009",
					"Nov 22, 2017 17:01 CET", "dummyCertificateNumber1.pdf", patents, payee, "1234.89");
			send();
		} else if (code >= 250 && code < 270) {
			email = emailFactory.create(EmailTemplates.email_penalty_invoice, acUser, "IP0003000009",
					"Nov 22, 2017 17:01 CET", "dummyInvoiceNumber1.pdf", patents, payee, "1234.89");
			send();
		}
	}

	protected void emailReminder(int code, String howSoon) {
		log().debug("emailReminder code=" + code);
		int whichPatent = code % 10;
		prepareUniversalReminderData(whichPatent);

		if (code >= 300 && code < 400) {
			// email_reminder_colour_opens
			// reminder_standard - different patents
			String colourOpenTemplate = null;
			if (code==300) colourOpenTemplate = EmailTemplates.email_reminder_green_opens;
			else if (code==310) colourOpenTemplate = EmailTemplates.email_reminder_blue_opens;
			else fail("EmailDevTest emailReminder : Passed unexpected code");

			email = emailFactory.create(colourOpenTemplate, acUser
						, onePatent
						, "786.00"
						, null, null, null, null);
			send();
		}
		else if (code >= 400 && code < 500) {
			// reminder_standard - different patents
			email = emailFactory.create(EmailTemplates.email_reminder_standard, acUser
						, onePatent
						, "9999.00"
						, howSoon
						, "Nov 22, 2017 17:01 CET"
						, null, null);
			send();
		} else if (code == 700) {
			// email_reminder_red_1day
			log().fatal("NOT YET WRITTEN");
		} else if (code == 730) {
			// email_reminder_black_5day
			email = emailFactory.create(EmailTemplates.email_reminder_black_5day, acUser
					, onePatent, "82,547.00", howSoon
					, "Nov 22, 2017 17:01 CET"
					, null, null);
			send();
		} else if (code == 760) {
			// email_reminder_after_black
			email = emailFactory.create(EmailTemplates.email_reminder_after_black, acUser
						, onePatent
						, null, null, null, null, null);
			send();
		}
	}

	// protected void standardReminder(int code) {
	// acTidy
	// }

	protected void send() {
		log().debug("send()");
		EmailSender emailer = new EmailSender(email);
		emailer.setRecipientsToDevs();
		emailer.sendEmail();
	}

	protected void preparePatents() {
		List<Patent> all = new ArrayList<Patent>();
		all = (Patent.findPatentsByBusiness(acUser.getBusiness())).getResultList();
		if (all.size() > 0)
			onePatent = all.get(0);
		int got = all.size();
		if (got > 4)
			got = 4;
		for (int ii = 0; ii < got; ii++)
			fourPatents.add(all.get(ii));
	}

	/**
	 * @param 0-9
	 */
	protected void prepareUniversalReminderData(int whichPatent) {
		List<Patent> all = new ArrayList<Patent>();
		all = (Patent.findPatentsByBusiness(acUser.getBusiness())).getResultList();
		int got = all.size();
		if (got == 0)
			fail("Cannot demo reminder email. We got no patents!");
		else if (got == 1)
			whichPatent = 0;
		else if (whichPatent >= got)
			whichPatent = whichPatent % got;

		this.onePatent = all.get(whichPatent);
	}

	// #1
	// DummyDataEngine dummy.generate6digitCode(seedUser)
	// P3sEmail email = emailFactory.create(EmailTemplates.email_register_combined,
	// "acdev@p3s.me",null,null,null,null);
	// #2
	// Patent pat = Patent.findPatent(1L);
	//
	// patents.add(Patent.findPatent(1L));
	// patents.add(Patent.findPatent(2L));
	// String pdfFilename = "";

}
