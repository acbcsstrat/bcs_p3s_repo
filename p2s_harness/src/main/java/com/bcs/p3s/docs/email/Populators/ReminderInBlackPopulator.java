package com.bcs.p3s.docs.email.Populators;


import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.template.EmailTemplates;

/**
 * The Populator for emails associated with the 'Usual' Reminder/Notification emails
 * when the current period is Black (i.e. last few days when can renew online)
 * 
 * This supports the template: 
 * 		EmailTemplates.email_reminder_black_5day
 *   
 */
public class ReminderInBlackPopulator extends ReminderBasicDetailsPopulator implements Injectables {

	// Constructor - populates the P3sEmailData
	// for use with: email_reminder_black_5day
	public ReminderInBlackPopulator(String templateName, Object obP3suser, Object obPatent
			, Object obPrice
			, Object obTimeBeforeChangePhrase		// e.g. '2 weeks'
			, Object obTimestampOfNextColourChange) // e.g. 'Nov 22, 2017 17:01 CET'
	{
		super(templateName, obP3suser, obPatent);  // Re-Use then extend ReminderBasicDetailsPopulator functionality
		// Here, ReminderBasicDetailsPopulator has already populated much of the P3sEmailData
		
		String err = "ReminderInBlackPopulator constructor : ";

		if (EmailTemplates.email_reminder_black_5day.equals(templateName)) {
			populateForInBlackReminder(templateName, obP3suser, obPatent,
					obPrice, obTimeBeforeChangePhrase, obTimestampOfNextColourChange);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	protected void populateForInBlackReminder(String templateName, Object obP3suser, Object obPatent,
			Object obPrice, Object obTimeBeforeChangePhrase, Object obTimestampOfNextColourChange) 
	{
		// less work here, as ReminderBasicDetailsPopulator has already done much of it
		
		String err = "ReminderInBlackPopulator populateForStandardReminder : ";
		if  ( (obPrice==null) || (obTimeBeforeChangePhrase==null) || (obTimestampOfNextColourChange==null) ) 
				fail(err+"invoked with Bad Parameters : "+(obPrice==null)+(obTimeBeforeChangePhrase==null) + (obTimestampOfNextColourChange==null) );

		String price = null; 
		String timeBeforeChangePhrase = null; 
		String timestampOfNextColourChange = null;
		try {
			price = (String) obPrice;  
			timeBeforeChangePhrase = (String) obTimeBeforeChangePhrase;  
			timestampOfNextColourChange = (String) obTimestampOfNextColourChange; 
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }
		
		
		// 1of3: Retrieve data from property file
		// n/a
		
		// 2of3: retrieve user & company details. 
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
	
	
	
	protected String injectIntoSubjectLine(List<String> wholeTemplate) {
		String subjectLinePREinject = wholeTemplate.get(0);

		currentLine = subjectLinePREinject;
		injectTIME_BEFORE_CHANGE_PHRASE();		
		injectPATENT_APPLICATION_NUMBER();		
		
		zz("ReminderInBlackPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("ReminderInBlackPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);

		return currentLine;
	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		super.doAllInjectionsForCurrentLine();
		
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPRICE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIME_BEFORE_CHANGE_PHRASE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIMESTAMP_OF_NEXT_COLOUR_CHANGE();
		
		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}

}
