package com.bcs.p3s.docs.email.Populators;

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


/**
 * The Populator for email associated with certificates
 *  Such emails are a cover-note for the Certificate PDF attachment that they carry 
 * For MVP, there is 1 such template served by this populator: 
 * 				email_certificate_invoice
 *   
 */
public class CertificatePopulator extends AbstractPopulator implements Injectables {


	protected final String CERTIFICATE_FOLDER = "certificates/";
	
	// Constructor - populates the P3sEmailData
	public CertificatePopulator(String templateName, Object obP3suser
			, Object obTxnRef, Object obFundsTargetArriveTime
			, Object obAttachmentFilename
			, Object obPatents
			, Object obPayeeDets
			, Object obPrice
	) 
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.TRANSACTION;
		String err = "CertificatePopulator constructor : ";

		if (EmailTemplates.email_renewal_certificate.equals(templateName)) {
				populateCertificate(templateName, obP3suser
					, obTxnRef 
					, obAttachmentFilename
					, obPatents);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateCertificate(String templateName, Object obP3suser
			, Object obTxnRef, Object obAttachmentFilename, Object obPatents) 
	{
		// Supports template EmailTemplates.email_renewal_certificate
		String err = "CertificatePopulator populateCertificate : ";
		
		// Start validating and populating
		populateUniversalFields(obP3suser, obTxnRef, obPatents, obAttachmentFilename);
		
		// Validate the remaining parameters
		if  ( isEmpty(templateName)) { 
					fail(err+"invoked with Bad Parameters : "+isEmpty(templateName));
		}
		// check just 1 patents
		List<Patent> patents = data.getPatents(); 
		if  (patents.size()!=1) { 
				fail(err+"invoked with Bad Num Patents = "+(patents.size())); 
		}

		
		// 1of3: Retrieve data from property file
		// 2of3: retrieve user & company details. 
		// 3of3: Assemble any values requiring work here - acTidy - titles
		attachmentPath = attachmentRootPath+CERTIFICATE_FOLDER;
		
		
		
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent(attachmentPath, attachmentFilename);
		
		log().debug(err+" completed preparation for template: "+templateName);
	}

	
	
	
	
	protected void populateUniversalFields(Object obP3suser, Object obTxnRef, Object obPatents, Object obAttachmentFilename) {
		// Used for ALL Transaction templates 
		String err = "CertificatePopulator populateUniversalFields : ";
		
		// Validate the parameters
		if  ( (obP3suser==null) || (obTxnRef==null) || (obPatents==null) || (obAttachmentFilename==null)) { 
				fail(err+"invoked with Bad Parameters : "+(obP3suser==null)+(obTxnRef==null)+(obPatents==null)+(obAttachmentFilename==null)); 
		}
		P3SUser userRecord = null;
		String txnRef = null;
		List<Patent> patents = null; 
		try {
			userRecord = (P3SUser) obP3suser;
			txnRef = (String) obTxnRef;
			patents = (List<Patent>) obPatents;
			attachmentFilename = (String) obAttachmentFilename;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }

		
				
		// 1of3: Retrieve data from property file
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			String pathToDocs = reader.getESProperty(P3SPropertyNames.PATH_TO_PDF_DOCS); 
			attachmentRootPath = reader.checkPathPropertyTerminated(pathToDocs);
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
		
		// 2of3: retrieve user & company details. 
		data.setFirstname(userRecord.getFirstName());
		data.setLastname(userRecord.getLastName());
		Business company = userRecord.getBusiness();	
		data.setCompanyName(company.getBusinessName());

		
		// 3of3: Assemble any values requiring work here - acTidy - titles
		data.setTransactionReference(txnRef);
		data.setPatents(patents);
		data.setNumberOfPatents(""+patents.size());
	}


	protected void prepareEmailContent(String attachmentPath, String attachmentFilename) {
		String err = "CertificatePopulator prepareEmailContent : ";

		EmailTemplateReader eReader = new EmailTemplateReader();
		List<String> wholeTemplate = eReader.readTemplate(this.templateName);
		zz(err+"Read template "+this.templateName+" : Has "+wholeTemplate.size()+" lines.");

		this.subject = injectIntoSubjectLine(wholeTemplate);
		this.htmlBody = injectIntoBody(wholeTemplate);
		
		this.attachmentPath = attachmentPath;
		this.attachmentFilename = attachmentFilename;
	}
	
	
	protected String injectIntoSubjectLine(List<String> wholeTemplate) {
		String subjectLinePREinject = wholeTemplate.get(0);
		currentLine = subjectLinePREinject;
		boolean ignore = injectTRANSACTION_REFERENCE();
		
		zz("CertificatePopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("CertificatePopulator prepareEmailContent : injectIntoSubject has created "+currentLine);
		return currentLine;
	}
	
	
	protected String injectIntoBody(List<String> wholeTemplate) {
		String err = "TransactionPopulator injectIntoBody ("+ this.templateName +") : ";
		log().debug(err+"invoked");

		String newHtmlBody = doAllInjectionsIntoBody(wholeTemplate);
		return newHtmlBody;
	}
	
	
	protected boolean doAllInjectionsForCurrentLine() {
		// This Subtype knows which of the replace*() methods to call for this template group/type
		// so now, for the current line, call them ALL sequentially. Stop early if no more work
		boolean moreInjectionsNeeded = true; 

		if (moreInjectionsNeeded) moreInjectionsNeeded = injectFIRSTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLASTNAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectCOMPANY_NAME();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTRANSACTION_REFERENCE();
		
		// Check for Repeating sets
		if (moreInjectionsNeeded) {
			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENTS))!=-1) processRepeatingPatents();
		}
		moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
		return moreInjectionsNeeded;
	}


	// Repeating Sets explained: Any line containing a 'Repeating Set' identifier (see Injectibles) then
	// the remainder of that line is processed as many times as there is data in the set
	// To do injections in this loop, the actual 'currentLine' and 'data' objects must be substituted or 're-used'
	
	protected void processRepeatingPatents() {
		StringBuilder bloc = new StringBuilder("");
		int prefixEnd = currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENTS));
		if (prefixEnd>0) bloc.append(currentLine,0,prefixEnd);

		int repeatingLineStart = currentLine.indexOf(SQUARECLOSE, (prefixEnd+1));
		String subtemplate;
		if (currentLine.length()>repeatingLineStart) subtemplate = currentLine.substring(repeatingLineStart+1);
		else subtemplate = currentLine; 
		
		for (Patent patent : data.getPatents()) {
			currentLine = subtemplate;
			// use existing, unused, fields, but update on each loop/patent 
			log().debug("acDebug CertificatePopulator 243: (data==null)="+(data==null)+"  (patent==null)="+(patent==null)); // discard once no longer populated with dodgy patent.getID(1L) - acTodo
			data.setPatentApplicationNumber(patent.getPatentApplicationNumber());
			data.setPatentShortTitle(patent.getShortTitle());
			data.setPatentTitle(patent.getTitle());
			injectPATENT_APPLICATION_NUMBER();
			injectSHORT_TITLE();
			injectPATENT_TITLE();
			bloc.append(currentLine);
		}
		currentLine = bloc.toString();
	}
	
	
	
//	public P3sEmail generateEmail() {  // ACtIDY
//		P3sEmail email = new P3sEmail(this.templateName, this.subject, this.htmlBody, this.attachmentPath, this.attachmentFilename);
//		return email;
//	}
	
	
}
