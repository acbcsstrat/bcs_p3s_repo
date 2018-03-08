package com.bcs.p3s.docs.email.Populators;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplates;

/**
 * The Populator for emails that don't have to be pretty, Nor Inject dynamic values.
 * Such emails carry simple, skeletal messages to internal staff
 * 
 * For MVP, there is only 1 such template : 
 * 		EmailTemplates.email_panic
 *   
 */
public class InternalUseOnlyPopulator extends AbstractPopulator implements Injectables {

	
	// Constructor - populates the P3sEmailData
	public InternalUseOnlyPopulator(String templateName, Object obSubject, Object obBody) 
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.INTERNAL_USE_ONLY;
		String err = "InternalUseOnlyPopulator constructor : ";

		if (EmailTemplates.email_panic.equals(templateName)) {
			populateForInternalUseOnly(templateName, obSubject, obBody);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateForInternalUseOnly(String templateName, Object obSubject, Object obBody) {
		String err = "InternalUseOnlyPopulator populateForInternalUseOnly : ";

		// Validate the parameters
		if  (obSubject==null || obBody==null) { 
				fail(err+"invoked with Bad Parameters : "+(obSubject==null)+(obBody==null)); 
		}
		String subject = null;
		String body = null;
		try {
			subject = (String) obSubject;
			body = (String) obBody;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }

		

		// 1of3: Retrieve data from property file
//		String siteWordpressUrl = null;
//		String siteTomcatUrl = null;
//		try {
//			P3SPropertyReader reader = new P3SPropertyReader();
//			data.setSupportEmailAddress(reader.getGenericProperty(P3SPropertyNames.P3S_support_email_address));
//			siteWordpressUrl = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_WORDPRESS_URL_BASE);
//			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
//			data.setLoginUrl(siteTomcatUrl);
//		} catch (P3SPropertyException e) {
//			fail(err+"property read failed",e);
//		}
		
		
		// 2of3: retrieve user & company details. // acTidy  -review ALL these populator NofM messages
//		P3SUser userRecord = null;
//		try {
//			userRecord = P3SUser.findP3SUsersByEmailAddress(newUserEmailAddress).getSingleResult();
//		} catch (Exception e) {
//			fail(err+"Unable to retrieve userdata for "+newUserEmailAddress);
//		}
//
//		Business company = null;	
//		data.setFirstname(userRecord.getFirstName());
//		data.setLastname(userRecord.getLastName());
//		company = userRecord.getBusiness(); 
//		data.setCompanyName(company.getBusinessName());

		
		// 3of3: Assemble any values requiring work here
//		String url2verifyEmail = generateUrlToVerifyEmail(newUserEmailAddress, userRecord, siteTomcatUrl);
//		data.setUrlToVerifyEmail(url2verifyEmail);
//
//		data.setUrlToFaq(siteWordpressUrl+"faq");
//
//		TwoColRecord a2colRecord = null;
//		List<TwoColRecord> colleagueCompanyDetails = new ArrayList<TwoColRecord>();
//		a2colRecord = new TwoColRecord("Company Code", company.getBusinessNumber());
//		colleagueCompanyDetails.add(a2colRecord);
//		a2colRecord = new TwoColRecord("Company PIN", company.getBusinessPin().toString());
//		colleagueCompanyDetails.add(a2colRecord);
//		data.setColleagueCompanyDetails(colleagueCompanyDetails);
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
//		prepareEmailContent();

		
		this.subject = subject;
		this.htmlBody = body;

		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	


	
//	protected void prepareEmailContent() {
//		String err = "InternalUseOnlyPopulator prepareEmailContent : ";
//
//		EmailTemplateReader eReader = new EmailTemplateReader();
//		List<String> wholeTemplate = eReader.readTemplate(this.templateName);
//		zz(err+"Read template "+this.templateName+" : Has "+wholeTemplate.size()+" lines.");
//
//		this.subject = injectIntoSubjectLine(wholeTemplate);
//		this.htmlBody = injectIntoBody(wholeTemplate);
//		
//		this.attachmentPath = null;
//		this.attachmentFilename = null;
//	}
	
	
//	protected String injectIntoSubjectLine(List<String> wholeTemplate) {
//		String subjectLinePREinject = wholeTemplate.get(0);
//		// Only injectable is FIRSTNAME
////			String target = "["+Injectables.FIRSTNAME+"]";
////			String newval = data.getFirstname();
////			
////			String newSubject = subjectLinePREinject.replace(target,newval);
////
//		currentLine = subjectLinePREinject;
//		boolean ignore = injectFIRSTNAME();		
//		
//		
//		
//		zz("InternalUseOnlyPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
//		zz("InternalUseOnlyPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);
//		
//
//		return currentLine;
//	}
	
	
//	protected String injectIntoBody(List<String> wholeTemplate) {
//		String err = "InternalUseOnlyPopulator injectIntoBody ("+ this.templateName +") : ";
//		log().debug(err+"invoked");
//		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
//		return newHtmlBody;
//	}
	
	
	/**
	 * This populator does not need injections, but must implement this method.
	 * Return false to indicate no more injections needed
	 */
	protected boolean doAllInjectionsForCurrentLine() { 
		return false;
	}
		
		
		//	protected boolean doAllInjectionsForCurrentLine() {
//		// This Subtype knows which of the replace*() methods to call for this template group/type
//		// so now, for the current line, call them ALL sequentially. Stop early if no more work
//		boolean moreInjectionsNeeded = true; 
//
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectURL_TO_VERIFY_EMAIL();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectSUPPORT_EMAIL_ADDRESS();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectURL_TO_FAQ();
////			if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_CODE();  // acTidy
////			if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_PIN();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
//		
//		// Check for Repeating sets
//		if (moreInjectionsNeeded) {
//			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_COMPANY_DETAILS))!=-1) processRepeatingSet();
//		}
//		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
//		return moreInjectionsNeeded;
//	}




		
		
}
