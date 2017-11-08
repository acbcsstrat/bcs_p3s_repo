package com.bcs.p3s.docs.email.Populators;

import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.template.EmailTemplateReader;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;

/**
 * The Populator for emails associated with the Registration process
 * 
 * For MVP, there is only 1 template for registration: 
 * 		EmailTemplates.email_register_combined
 *   
 */
public class RegisterPopulator extends AbstractPopulator implements Injectables {

	
	// Constructor - populates the P3sEmailData
	public RegisterPopulator(String templateName, Object obNewUserEmailAddress) {
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.REGISTER;
		String err = "RegisterPopulator constructor : ";

		if (EmailTemplates.email_register_combined.equals(templateName)) {
			populateForRegistration(templateName, obNewUserEmailAddress);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateForRegistration(String templateName, Object obNewUserEmailAddress) {
		// Supports template EmailTemplates.email_register_combined (& potentially others in the future) 
		String err = "RegisterPopulator populateForRegistration : ";
		if  ( (obNewUserEmailAddress==null) || ! (obNewUserEmailAddress instanceof String)) 
				fail(err+"bad param. (obNewUserEmailAddress==null)="+(obNewUserEmailAddress==null));
		String newUserEmailAddress = (String) obNewUserEmailAddress;

		// 1of3: Retrieve data from property file
		String siteWordpressUrl = null;
		String siteTomcatUrl = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			data.setSupportEmailAddress(reader.getGenericProperty(P3SPropertyNames.P3S_support_email_address));
			siteWordpressUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_WORDPRESS_URL_BASE);
			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
			data.setLoginUrl(siteTomcatUrl);
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
		
		// 2of3: retrieve user & company details. 
		P3SUser userRecord = null;
		try {
			userRecord = P3SUser.findP3SUsersByEmailAddress(newUserEmailAddress).getSingleResult();
		} catch (Exception e) {
			fail(err+"Unable to retrieve userdata for "+newUserEmailAddress);
		}

		Business company = null;	
		data.setFirstname(userRecord.getFirstName());
		data.setLastname(userRecord.getLastName());
		company = userRecord.getBusiness(); 
		data.setCompanyName(company.getBusinessName());
		data.setCompanyCode(company.getBusinessNumber());
		data.setCompanyPin(company.getBusinessPin().toString());

		
		// 3of3: Assemble any values requiring work here
		String url2verifyEmail = generateUrlToVerifyEmail(newUserEmailAddress, userRecord, siteTomcatUrl);
		data.setUrlToVerifyEmail(url2verifyEmail);

		data.setUrlToFaq(siteWordpressUrl+"faq");
		
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent();
		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	
	
	protected void prepareEmailContent() {
		String err = "RegisterPopulator prepareEmailContent : ";

		EmailTemplateReader eReader = new EmailTemplateReader();
		List<String> wholeTemplate = eReader.readTemplate(this.templateName);
		zz(err+"Read template "+this.templateName+" : Has "+wholeTemplate.size()+" lines.");

		this.subject = injectIntoSubjectLine(wholeTemplate);
		this.htmlBody = injectIntoBody(wholeTemplate);
		
		this.attachmentPath = null;
		this.attachmentFilename = null;
	}
	
	
	protected String injectIntoSubjectLine(List<String> wholeTemplate) {
		String subjectLinePREinject = wholeTemplate.get(0);
		// Only injectable is FIRSTNAME
//		String target = "["+Injectables.FIRSTNAME+"]";
//		String newval = data.getFirstname();
//		
//		String newSubject = subjectLinePREinject.replace(target,newval);
//
		currentLine = subjectLinePREinject;
		boolean ignore = injectFIRSTNAME();		
		
		
		
		zz("RegisterPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("RegisterPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);
		

		return currentLine;
	}
	
	
	protected String injectIntoBody(List<String> wholeTemplate) {
		String err = "RegisterPopulator injectIntoBody ("+ this.templateName +") : ";
		log().debug(err+"invoked");
		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
		return newHtmlBody;
	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectURL_TO_VERIFY_EMAIL();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectSUPPORT_EMAIL_ADDRESS();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectURL_TO_FAQ();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_CODE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_PIN();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
		
		return moreInjectionsNeeded;
	}

	
//	protected String generateUrlToVerifyEmail(String newUserEmailAddress, P3SUser userRecord, String siteUrl) {
//		String userMash = newUserEmailAddress + userRecord.getId().toString();
//		int    qwikInt  = userMash.hashCode(); // may be negative
//		if (qwikInt<0) qwikInt = qwikInt * -1; 
////		Integer qwikInt = new Integer(userMash.hashCode()); // may be negative
//		String userHash = "736933735" + Integer.toString(qwikInt); // ensure len>8
//		zz("userMash is "+userMash);
//		zz("userHash is "+userHash);
//		int len = userHash.length();
//		String fragment6 = userHash.substring(len-8, len-2); // ignore last 2, then take last 6
//		zz("yields "+fragment6);
//				
//		String url2verifyEmail = siteUrl+"user/confirmuser/"+fragment6+"?email="+newUserEmailAddress;
//		zz("yields "+fragment6);
//		return url2verifyEmail;
//	}
	
	protected String generateUrlToVerifyEmail(String newUserEmailAddress, P3SUser userRecord, String siteUrl) {
		DummyDataEngine dummy = new DummyDataEngine(); 
		String fragment6 = dummy.generate6digitCode(userRecord);
		zz("generateUrlToVerifyEmail yields frag6="+fragment6);
				
		String url2verifyEmail = siteUrl+"user/confirmuser/"+fragment6+"?email="+newUserEmailAddress;
		zz("yields url of : "+url2verifyEmail);
		return url2verifyEmail;
	}
	


}
