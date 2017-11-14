package com.bcs.p3s.docs.email.Populators;

import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplates;

// acTidy  -this class contains LOTS or redundant, commented out code, which is now done by the superclass


/**
 * The Populator for emails associated with the 'Usual' Reminder/Notification emails
 * e.g. 2 weeks before colour change
 * 
 * This supports the template: 
 * 		EmailTemplates.email_reminder_standard
 *   
 */
public class ReminderStandardPopulator extends ReminderColourOpenPopulator implements Injectables {

	// Constructor - populates the P3sEmailData
	// for use with: email_reminder_standard
	public ReminderStandardPopulator(String templateName, Object obP3suser, Object obPatent
			, Object obPrice
			, Object obTimeBeforeChangePhrase		// e.g. '2 weeks'
			, Object obTimestampOfNextColourChange) // e.g. 'Nov 22, 2017 17:01 CET'
	{
		super(templateName, obP3suser, obPatent, obPrice);  // Re-Use then extend ReminderColourOpenPopulator functionality
		// Here, ReminderColourOpenPopulator has already populated much of the P3sEmailData
		
		String err = "ReminderStandardPopulator constructor : ";

		if (EmailTemplates.email_reminder_standard.equals(templateName)) {
			populateForStandardReminder(templateName, obP3suser, obPatent,
					obPrice, obTimeBeforeChangePhrase, obTimestampOfNextColourChange);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	protected void populateForStandardReminder(String templateName, Object obP3suser, Object obPatent,
			Object obPrice, Object obTimeBeforeChangePhrase, Object obTimestampOfNextColourChange) 
	{
		// less work here, as ReminderColourOpenPopulator has already done much of it
		
		// Supports standard email reminder template (EmailTemplates.email_reminder_standard) (& potentially others in the future) 
		String err = "ReminderStandardPopulator populateForStandardReminder : ";
		if  ( (obTimeBeforeChangePhrase==null) || (obTimestampOfNextColourChange==null) ) 
				fail(err+"invoked with Bad Parameters : "+(obTimeBeforeChangePhrase==null) + (obTimestampOfNextColourChange==null) );

//		// ColourOpensReminder does MOST of the work required here - so call that first
//		prepareDataForColourOpensReminder(templateName, obP3suser, obPatent, obPrice);
		
		String timeBeforeChangePhrase = null; 
		String timestampOfNextColourChange = null;
		try {
			timeBeforeChangePhrase = (String) obTimeBeforeChangePhrase;  
			timestampOfNextColourChange = (String) obTimestampOfNextColourChange; 
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }
		
		
		// 1of3: Retrieve data from property file
		// n/a
		
		// 2of3: retrieve user & company details. 
		data.setTimeBeforeChangePhrase(timeBeforeChangePhrase);
		data.setTimestampOfNextColourChange(timestampOfNextColourChange);
		
		
		// 3of3: Assemble any values requiring work here
		// n/a

		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent();
		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	
	
//	protected void populateForColourOpenReminder(String templateName, Object obP3suser, Object obPatent, Object obPrice) {
//		String err = "ReminderStandardPopulator populateForColourOpenReminder : ";
//
//		prepareDataForColourOpensReminder(templateName, obP3suser, obPatent, obPrice);
//		
//		
//		// data is now populated with all the injectables required for this template
//
//		// So ...
//		// Now Inject
//		prepareEmailContent();
//		
//		log().debug(err+" completed preparation for template: "+templateName);
//	}
//	
	
	
//	protected void prepareDataForColourOpensReminder(String templateName, Object obP3suser, Object obPatent,
//			Object obPrice) {
//		// Supports ALL email reminder templates 
//		String err = "ReminderStandardPopulator prepareDataForColourOpensReminder : ";
//		if  ( isEmpty(templateName) || (obP3suser==null) || (obPatent==null) 
//			|| (obPrice==null)) 
//				fail(err+"invoked with Bad Parameters : "+isEmpty(templateName)+(obP3suser==null)+(obPatent==null)+(obPrice==null));
//		P3SUser userRecord = null;
//		Patent patent = null;
//		String price = null;
//		try {
//			userRecord = (P3SUser) obP3suser;
//			patent = (Patent) obPatent;
//			price = (String) obPrice;
//		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }
//		
//		
//		// 1of3: Retrieve data from property file
//		String siteTomcatUrl = null;
//		try {
//			P3SPropertyReader reader = new P3SPropertyReader();
//			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
//			data.setLoginUrl(siteTomcatUrl);
//		} catch (P3SPropertyException e) {
//			fail(err+"property read failed",e);
//		}
//		
//		// 2of3: retrieve user & company details. 
//		Business company = null;	
//		data.setFirstname(userRecord.getFirstName());
//		data.setLastname(userRecord.getLastName());
//		company = userRecord.getBusiness(); 
//		data.setCompanyName(company.getBusinessName());
//
//		// 2of3: retrieve patent details
//		data.setPatentApplicationNumber(patent.getPatentApplicationNumber());
//		data.setPatentTitle(patent.getTitle());
//		data.setPatentShortTitle(patent.getShortTitle());
//		data.setPatentClientRef(patent.getClientRef());
//		data.setPrice(price);
//		
//		TwoColRecord a2colRecord = null;
//		List<TwoColRecord> patentDetails = new ArrayList<TwoColRecord>();
//		a2colRecord = new TwoColRecord("Application Number", patent.getPatentApplicationNumber());
//		patentDetails.add(a2colRecord);
//		a2colRecord = new TwoColRecord("Patent Title", patent.getTitle());
//		patentDetails.add(a2colRecord);
//		a2colRecord = new TwoColRecord("Your Short-Title", patent.getShortTitle());
//		patentDetails.add(a2colRecord);
//		a2colRecord = new TwoColRecord("Your Client Ref.", patent.getClientRef());
//		patentDetails.add(a2colRecord);
//		data.setPatentDetails(patentDetails);
//
//			
//			
//		// 3of3: Assemble any values requiring work here
//		// n/a
//
//	}
	
	
//	protected void prepareEmailContent() {
//		String err = "ReminderStandardPopulator prepareEmailContent : ";
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
	
	
	protected String injectIntoSubjectLine(List<String> wholeTemplate) {
		String subjectLinePREinject = wholeTemplate.get(0);

		currentLine = subjectLinePREinject;
		injectTIME_BEFORE_CHANGE_PHRASE();		
		injectPATENT_APPLICATION_NUMBER();		
		
		zz("ReminderStandardPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("ReminderStandardPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);

		return currentLine;
	}
	
	
//	protected String injectIntoBody(List<String> wholeTemplate) {
//		String err = "ReminderStandardPopulator injectIntoBody ("+ this.templateName +") : ";
//		log().debug(err+"invoked");
//		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
//		return newHtmlBody;
//	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		super.doAllInjectionsForCurrentLine();
		

		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIME_BEFORE_CHANGE_PHRASE();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_TITLE();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectSHORT_TITLE();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_CLIENT_REF();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIMESTAMP_OF_NEXT_COLOUR_CHANGE();
		
		
		
		
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_APPLICATION_NUMBER();		
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLASTNAME();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPRICE();
//		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
//		
//		// Check for Repeating sets
//		if (moreInjectionsNeeded) {
//			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENT_DETAILS))!=-1) 
//					processRepeatingPatentDetails();
//		}
		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}
	
	// Repeating Sets explained: See TransactionPopulator:processRepeatingPatents

//	protected void processRepeatingPatentDetails() {
//		StringBuilder bloc = new StringBuilder("");
//		int prefixEnd = currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENT_DETAILS));
//		if (prefixEnd>0) bloc.append(currentLine,0,prefixEnd);
//
//		int repeatingLineStart = currentLine.indexOf(SQUARECLOSE, (prefixEnd+1));
//		String subtemplate;
//		if (currentLine.length()>repeatingLineStart) subtemplate = currentLine.substring(repeatingLineStart+1);
//		else subtemplate = currentLine; 
//		
//		for (TwoColRecord payLine : data.getPaymentDetails()) {
//			currentLine = subtemplate;
//			// update fields on each loop/patentdetail
//			data.setFieldb(payLine.getField1());
//			data.setFieldc(payLine.getField2());
//			injectFIELDB();
//			injectFIELDC();
//			bloc.append(currentLine);
//		}
//		currentLine = bloc.toString();
//	}

}
