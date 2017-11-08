package com.bcs.p3s.docs.email.Populators;

import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.template.EmailTemplateReader;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;

/**
 * The Populator for emails associated with the 'Usual' Reminder/Notification emails
 * e.g. 2 weeks before colour change
 * 
 * This supports the template: 
 * 		EmailTemplates.email_reminder_standard
 *   
 */
public class ReminderEmailStandardPopulator extends AbstractPopulator implements Injectables {

	// Constructor - populates the P3sEmailData
	public ReminderEmailStandardPopulator(String templateName, Object p3suser, Object patent,
			Object obPrice, Object obTimeBeforeChangePhrase, Object obTimestampOfNextColourChange) 
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.REMINDER;
		String err = "ReminderEmailStandardPopulator constructor : ";

		if (EmailTemplates.email_reminder_standard.equals(templateName)) {
			populateForStandardReminder(templateName, p3suser, patent,
					obPrice, obTimeBeforeChangePhrase, obTimestampOfNextColourChange);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateForStandardReminder(String templateName, Object obP3suser, Object obPatent,
			Object obPrice, Object obTimeBeforeChangePhrase, Object obTimestampOfNextColourChange) {
		// Supports template EmailTemplates.email_reminder_standard (& potentially others in the future) 
		String err = "ReminderEmailStandardPopulator populateForStandardReminder : ";
		if  ( isEmpty(templateName) || (obP3suser==null) || (obPatent==null) 
			|| (obPrice==null) || (obTimeBeforeChangePhrase==null) || (obTimestampOfNextColourChange==null) ) 
				fail(err+"invoked with Bad Parameters : "+isEmpty(templateName)+(obP3suser==null)+(obPatent==null)
							+ (obPrice==null) + (obTimeBeforeChangePhrase==null) + (obTimestampOfNextColourChange==null) );
		P3SUser userRecord = null;
		Patent patent = null;
		String price = null;
		String timeBeforeChangePhrase = null; 
		String timestampOfNextColourChange = null;
		try {
			userRecord = (P3SUser) obP3suser;
			patent = (Patent) obPatent;
			price = (String) obPrice;
			timeBeforeChangePhrase = (String) obTimeBeforeChangePhrase;  
			timestampOfNextColourChange = (String) obTimestampOfNextColourChange; 
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
// N/a
		
//		String siteWordpressUrl = null;
//		String siteTomcatUrl = null;
//		try {
//			P3SPropertyReader reader = new P3SPropertyReader();
//			data.setSupportEmailAddress(reader.getGenericProperty(P3SPropertyNames.P3S_support_email_address));
//			siteWordpressUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_WORDPRESS_URL_BASE);
//			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
//			data.setLoginUrl(siteTomcatUrl);
//		} catch (P3SPropertyException e) {
//			fail(err+"property read failed",e);
//		}
		
		
		// 2of3: retrieve user & company details. 
		Business company = null;	
		data.setFirstname(userRecord.getFirstName());
		data.setLastname(userRecord.getLastName());
		company = userRecord.getBusiness(); 
		data.setCompanyName(company.getBusinessName());

		// 2of3: retrieve patent details
		data.setPatentApplicationNumber(patent.getPatentApplicationNumber());
		data.setPatentTitle(patent.getTitle());
		data.setPatentShortTitle(patent.getShortTitle());
		data.setPatentClientRef(patent.getClientRef());
		data.setPrice(price);
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
	
	
	protected void prepareEmailContent() {
		String err = "ReminderEmailStandardPopulator prepareEmailContent : ";

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
		injectTIME_BEFORE_CHANGE_PHRASE();		
		injectPATENT_APPLICATION_NUMBER();		
		
		zz("ReminderEmailStandardPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("ReminderEmailStandardPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);

		return currentLine;
	}
	
	
	protected String injectIntoBody(List<String> wholeTemplate) {
		String err = "ReminderEmailStandardPopulator injectIntoBody ("+ this.templateName +") : ";
		log().debug(err+"invoked");
		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
		return newHtmlBody;
	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIME_BEFORE_CHANGE_PHRASE();		
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_APPLICATION_NUMBER();		
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLASTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIME_BEFORE_CHANGE_PHRASE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_APPLICATION_NUMBER();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_TITLE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectSHORT_TITLE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_CLIENT_REF();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPRICE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIMESTAMP_OF_NEXT_COLOUR_CHANGE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
		
		return moreInjectionsNeeded;
	}
	

}
