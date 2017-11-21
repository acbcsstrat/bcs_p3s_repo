package com.bcs.p3s.docs.email.Populators;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplateReader;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.GenericProcessingEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.wrap.TwoColRecord;

/**
 * The Populator for emails associated with the Registration process
 * 
 * For MVP, there is only 1 template for registration: 
 * 		EmailTemplates.email_register_combined
 *   
 */
public class RegisterPopulator extends AbstractPopulator implements Injectables {

	
	// Constructor - populates the P3sEmailData
	public RegisterPopulator(String templateName, Object obNewUserEmailAddress) 
	{
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

		// Validate the parameters
		if  ( (obNewUserEmailAddress==null)) { 
				fail(err+"invoked with Bad Parameters : "+(obNewUserEmailAddress==null)); 
		}
		String newUserEmailAddress  = null;
		try {
			newUserEmailAddress = (String) obNewUserEmailAddress;
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
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
		
		// 2of3: retrieve user & company details. // acTidy  -review ALL these populator NofM messages
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
//		data.setCompanyCode(company.getBusinessNumber());
//		data.setCompanyPin(company.getBusinessPin().toString());  // acTidy

		
		// 3of3: Assemble any values requiring work here
		String url2verifyEmail = generateUrlToVerifyEmail(newUserEmailAddress, userRecord, siteTomcatUrl);
		data.setUrlToVerifyEmail(url2verifyEmail);

		data.setUrlToFaq(siteWordpressUrl+"faq");

		TwoColRecord a2colRecord = null;
		List<TwoColRecord> colleagueCompanyDetails = new ArrayList<TwoColRecord>();
		a2colRecord = new TwoColRecord("Company Code", company.getBusinessNumber());
		colleagueCompanyDetails.add(a2colRecord);
		a2colRecord = new TwoColRecord("Company PIN", company.getBusinessPin().toString());
		colleagueCompanyDetails.add(a2colRecord);
		data.setColleagueCompanyDetails(colleagueCompanyDetails);
		
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
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_CODE();  // acTidy
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_PIN();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
		
		// Check for Repeating sets
		if (moreInjectionsNeeded) {
			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_COMPANY_DETAILS))!=-1) processRepeatingSet();
		}
		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}


	protected void processRepeatingSet() {
		StringBuilder bloc = new StringBuilder("");
		int prefixEnd = currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_COMPANY_DETAILS));
		if (prefixEnd>0) bloc.append(currentLine,0,prefixEnd);

		int repeatingLineStart = currentLine.indexOf(SQUARECLOSE, (prefixEnd+1));
		String subtemplate;
		if (currentLine.length()>repeatingLineStart) subtemplate = currentLine.substring(repeatingLineStart+1);
		else subtemplate = currentLine; 

		for (TwoColRecord detailLine : data.getColleagueCompanyDetails()) {
			currentLine = subtemplate;
			// update fields on each loop/detailLine
			data.setFieldb(detailLine.getField1());
			data.setFieldc(detailLine.getField2());
			injectFIELDB();
			injectFIELDC();
			bloc.append(currentLine);
		}
		currentLine = bloc.toString();
	}
	
	
	protected String generateUrlToVerifyEmail(String newUserEmailAddress, P3SUser userRecord, String siteUrl) {
		GenericProcessingEngine genEngine = new GenericProcessingEngine();
		String fragment6 = genEngine.generateUrlVerificationCode(userRecord);
		String url2verifyEmail = siteUrl+"register/new-user-verify/"+fragment6+"?emailAddress="+newUserEmailAddress;
		return url2verifyEmail;
	}
	


}
