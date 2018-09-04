package com.bcs.p3s.docs.email.populators;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplateReader;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.wrap.TwoColRecord;

/**
 * 
 * The Populator for Basic details. 
 * Can be used on its own, but likely to be extended by other populators
 * 
 * This supports the template: 
 * 		EmailTemplates.email_reminder_after_black
 *   
 */
public class ReminderBasicDetailsPopulator extends AbstractPopulator implements Injectables {

	// Constructor - populates the P3sEmailData
	// for use with: email_reminder_green_opens & email_reminder_blue_opens
	public ReminderBasicDetailsPopulator(String templateName, Object obP3suser, Object obPatent)
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.REMINDER; // Used for logging of emails sent
		String err = "ReminderBasicDetailsPopulator constructor ("+templateName+") : ";

		if (EmailTemplates.email_reminder_after_black.equals(templateName)
		 || EmailTemplates.email_reminder_black_5day.equals(templateName) // Must include these for the extended class 
		) 
		{
			populateBasicDetailsReminder(templateName, obP3suser, obPatent);
		}
		else fail(err+"cannot support offered template (templateName): "+templateName);
	}
	
	

	protected void populateBasicDetailsReminder(String templateName, Object obP3suser, Object obPatent) {
		String err = "ReminderBasicDetailsPopulator populateBasicDetailsReminder : ";

		prepareDataForBasicDetailsReminder(templateName, obP3suser, obPatent);
		
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent();
		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	
	
	
	protected void prepareDataForBasicDetailsReminder(String templateName, Object obP3suser, Object obPatent) {
		// Supports ALL email reminder templates 
		String err = "ReminderBasicDetailsPopulator prepareDataForBasicDetailsReminder : ";
		if  ( isEmpty(templateName) || (obP3suser==null) || (obPatent==null) ) 
				fail(err+"invoked with Bad Parameters : "+isEmpty(templateName)+(obP3suser==null)+(obPatent==null));
		P3SUser userRecord = null;
		Patent patent = null;
		try {
			userRecord = (P3SUser) obP3suser;
			patent = (Patent) obPatent;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }
		
		
		// 1of3: Retrieve data from property file
		String siteTomcatUrl = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
			data.setLoginUrl(siteTomcatUrl);
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
		// 2of3: retrieve user & company details. 
		Business company = null;	
		data.setFirstname(userRecord.getFirstName());
		data.setLastname(userRecord.getLastName());
		company = userRecord.getBusiness(); 
		data.setCompanyName(company.getBusinessName());

		// 2of3: retrieve patent details
		data.setPatentApplicationNumber(patent.getEP_ApplicationNumber());
		
		TwoColRecord a2colRecord = null;
		List<TwoColRecord> patentDetails = new ArrayList<TwoColRecord>();
		a2colRecord = new TwoColRecord("Application Number", patent.getEP_ApplicationNumber());
		patentDetails.add(a2colRecord);
		a2colRecord = new TwoColRecord("Patent Title", patent.getTitle());
		patentDetails.add(a2colRecord);
		a2colRecord = new TwoColRecord("Your Short-Title", patent.getShortTitle());
		patentDetails.add(a2colRecord);
		a2colRecord = new TwoColRecord("Your Client Ref.", patent.getClientRef());
		patentDetails.add(a2colRecord);
		data.setPatentDetails(patentDetails);

			
			
		// 3of3: Assemble any values requiring work here
		// n/a
		
		// Set any dummy values needed to prevent NPE here, if invoked by extended class
		data.setTimeBeforeChangePhrase("TEMPORARY_VALUE");
		data.setTimestampOfNextColourChange("TEMPORARY_VALUE");
		data.setPrice("TEMPORARY_VALUE");
	}
	
	
	protected void prepareEmailContent() {
		String err = "ReminderBasicDetailsPopulator prepareEmailContent : ";

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

		currentLine = subjectLinePREinject;
		injectPATENT_APPLICATION_NUMBER();		
		
		zz("ReminderBasicDetailsPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("ReminderBasicDetailsPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);

		return currentLine;
	}
	
	
	protected String injectIntoBody(List<String> wholeTemplate) {
		String err = "ReminderBasicDetailsPopulator injectIntoBody ("+ this.templateName +") : ";
		log().debug(err+"invoked");
		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
		return newHtmlBody;
	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_APPLICATION_NUMBER();		
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLASTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
		
		// Check for Repeating sets
		if (moreInjectionsNeeded) {
			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENT_DETAILS))!=-1) 
					processRepeatingPatentDetails();
		}
		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}
	
	// Repeating Sets explained: See TransactionPopulator:processRepeatingPatents

	protected void processRepeatingPatentDetails() {
		StringBuilder bloc = new StringBuilder("");
		int prefixEnd = currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENT_DETAILS));
		if (prefixEnd>0) bloc.append(currentLine,0,prefixEnd);

		int repeatingLineStart = currentLine.indexOf(SQUARECLOSE, (prefixEnd+1));
		String subtemplate;
		if (currentLine.length()>repeatingLineStart) subtemplate = currentLine.substring(repeatingLineStart+1);
		else subtemplate = currentLine; 
		
		for (TwoColRecord patentLine : data.getPatentDetails()) {
			currentLine = subtemplate;
			// update fields on each loop/patentdetail
			data.setFieldb(patentLine.getField1());
			data.setFieldc(patentLine.getField2());
			injectFIELDB();
			injectFIELDC();
			bloc.append(currentLine);
		}
		currentLine = bloc.toString();
	}


}
