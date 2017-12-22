package com.bcs.p3s.docs.email.Populators;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplateReader;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.wrap.TwoColRecord;

/**
 * The Populator for the Forgot-Password email
 * 
 * For MVP, there is only 1 template for registration: 
 * 		EmailTemplates.email_password_reset
 *   
 */
public class ForgotPasswordPopulator extends AbstractPopulator implements Injectables {

	
	// Constructor - populates the P3sEmailData
	public ForgotPasswordPopulator(String templateName, Object obNewUserEmailAddress, Object obVerifyCode) 
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.REGISTER;  // which includes Password Reset
		String err = "ForgotPasswordPopulator constructor : ";

		if (EmailTemplates.email_password_reset.equals(templateName)) {
			populateForPasswordReset(templateName, obNewUserEmailAddress, obVerifyCode);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateForPasswordReset(String templateName, Object obNewUserEmailAddress, Object obVerifyCode) {
		// Supports template EmailTemplates.email_password_reset 
		String err = "ForgotPasswordPopulator populateForPasswordReset : ";

		// Validate the parameters
		if  ( (obNewUserEmailAddress==null || obVerifyCode==null)) { 
				fail(err+"invoked with Bad Parameters : "+(obNewUserEmailAddress==null)+", "+(obVerifyCode==null)); 
		}
		String userEmailAddress  = null;
		String verifyCode = null;
		try {
			userEmailAddress = (String) obNewUserEmailAddress;
			verifyCode = (String) obVerifyCode;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }

		

		// 1of3: Retrieve data from property file
		String siteWordpressUrl = null;
		String siteTomcatUrl = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			data.setSupportEmailAddress(reader.getGenericProperty(P3SPropertyNames.P3S_support_email_address));
			siteWordpressUrl = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_WORDPRESS_URL_BASE);
			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);

			data.setLoginUrl(siteTomcatUrl);
			data.setWebsiteUrl(siteWordpressUrl);
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
		
		// 2of3: retrieve user & company details. // acTidy  -review ALL these populator NofM messages
		P3SUser userRecord = null;
		try {
			userRecord = P3SUser.findP3SUsersByEmailAddress(userEmailAddress).getSingleResult();
		} catch (Exception e) {
			fail(err+"Unable to retrieve userdata for "+userEmailAddress);
		}
		data.setFirstname(userRecord.getFirstName());

		// 3of3: Assemble any values requiring work here
		String url2verifyEmail = generateUrlToVerifyEmail(userEmailAddress, verifyCode, siteTomcatUrl);
		data.setUrlToVerifyEmail(url2verifyEmail);

		data.setUrlToFaq(siteWordpressUrl+"faq");

		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent();
		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	


	
	protected void prepareEmailContent() {
		String err = "ForgotPasswordPopulator prepareEmailContent : ";

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
		
		
		
		zz("ForgotPasswordPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("ForgotPasswordPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);
		

		return currentLine;
	}
	
	
	protected String injectIntoBody(List<String> wholeTemplate) {
		String err = "ForgotPasswordPopulator injectIntoBody ("+ this.templateName +") : ";
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
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectSUPPORT_EMAIL_ADDRESS();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectURL_TO_FAQ();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectWEBSITE_URL();

		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}


	protected String generateUrlToVerifyEmail(String userEmailAddress, String verifyCode, String siteUrl) {
		String url2verifyEmail = siteUrl+"prelogin/rest-forgot-password/"+verifyCode+"?emailAddress="+userEmailAddress;
		return url2verifyEmail;
	}
	
}
