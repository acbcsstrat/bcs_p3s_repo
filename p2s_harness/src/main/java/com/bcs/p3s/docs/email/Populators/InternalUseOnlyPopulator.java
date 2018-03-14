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
		
		
		// 2of3: retrieve user & company details. 

		
		// 3of3: Assemble any values requiring work here
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
//		prepareEmailContent();
		
		this.subject = subject;
		this.htmlBody = body;

		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	


	
	/**
	 * This populator does not need injections, but must implement this method.
	 * Return false to indicate no more injections needed
	 */
	protected boolean doAllInjectionsForCurrentLine() { 
		return false;
	}
		
		
		
}
