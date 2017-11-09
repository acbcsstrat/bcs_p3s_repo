package com.bcs.p3s.docs.email;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.util.email.EmailSender;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPaymentDetails;

/**
 * For development testing : Sends emails to hardcoded recipient(s)
 */
public class EmailDevTest extends Universal  {

	P3sEmail email; 
	P3sEmailFactory emailFactory = new P3sEmailFactory();
	P3SUser acUser = SecurityUtil.getMyUser();
	List<Patent> patents = new ArrayList<Patent>(); 
	Patent onePatent; 
	List<Patent> fourPatents = new ArrayList<Patent>(); 
	BankTransferPaymentDetails payee = new BankTransferPaymentDetails();

	
	
	
	public void testByCode(int code) {
		log().debug("EmailDevTest testByCode : invoked  : param = "+code);

		if (code==100) {
			log().debug("Generate Register email - email_register_combined");
		}
		else if (code>=200 && code <300) {
			log().debug("Send an Invoice/certificate");
			emailPdf(code);
		}
		else if (code>=300 && code <400) {
			log().debug("Send an Reminder - Colour OPEN");
		}
		else if (code>=400 && code <700) {
			log().debug("Send an Ordinary Reminder");
		}
		else if (code==700) {
			log().debug("RED - 1 day left");
		}
		else if (code==730) {
			log().debug("BLACK - 5 days left");
		}
		else if (code==760) {
			log().debug("AFTER Black");
		}
		else log().fatal("This chould not be possible. Code="+code);
		
				
//		  <option value="100">email_register_combined</option>
//
//		  <option value="200">email_proforma_invoice - 1 patent</option>
//		  <option value="210">email_proforma_invoice - 4 patents</option>
//		  <option value="220">email_final_invoice</option>
//		  <option value="230">email_renewal_certificate</option>
//		  <option value="240">email_penalty_invoice</option>
//
//		  <option value="300">email_reminder_colour_opens - Green</option>
//		  <option value="310">email_reminder_colour_opens - Blue</option>
//
//		  <option value="400">email_reminder_standard - Green open</option>
//
//
//		  <option value="700">email_reminder_red_1day</option>
//		  <option value="730">email_reminder_black_5day</option>
//		  <option value="760">email_reminder_after_black</option>
	}
	
	
	
	protected void emailPdf(int code) {
		log().debug("emailPdf code="+code);
		prepareSomeData();
		preparePatents();
		if (code==210 || code==260) patents = fourPatents; else patents.add(onePatent); 
		
		if (code>=200 && code<220) {
			email = emailFactory.create(EmailTemplates.email_proforma_invoice, 
					acUser,"IP0003000009","Nov 9, 2017 17:01 CET","dummyInvoiceNumber1.pdf",patents,payee,"1234.89");
			send();
		}
	}
	
	
	
	protected void send() {
		log().debug("send()");
		EmailSender emailer = new EmailSender(email);
		emailer.setRecipientsToDevs();
		emailer.sendEmail();
	}

	
	protected void prepareSomeData() {
		log().debug("genSomeData");
		
	}
	protected void preparePatents() {
		List<Patent> all = new ArrayList<Patent>();
		all = (Patent.findPatentsByBusiness(acUser.getBusiness())).getResultList();
		if (all.size()>0) onePatent = all.get(0);
		int got = all.size();
		if (got>4) got=4;
		for (int ii=0 ; ii<got ; ii++) fourPatents.add(all.get(ii));
	}
	
	
	

	
	// #1
	// DummyDataEngine dummy.generate6digitCode(seedUser)
	//P3sEmail email = emailFactory.create(EmailTemplates.email_register_combined, "acdev@p3s.me",null,null,null,null);
	// #2
//	Patent pat = Patent.findPatent(1L);
//	
//	patents.add(Patent.findPatent(1L));
//	patents.add(Patent.findPatent(2L));
//	String pdfFilename = "";
//	End of: Here - tmp put Development HOOK for send EMAIL
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
//	********    ********    ********    ********    ********    ********    ********    
	
	
	
	
	
	
	
	
	
	
	


	
	
	
	
	
	
	
	
	
}
