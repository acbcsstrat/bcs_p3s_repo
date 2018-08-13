package com.bcs.p3s.docs.email.Populators;

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
import com.bcs.p3s.wrap.BankTransferPaymentDetails;
import com.bcs.p3s.wrap.TwoColRecord;


/**
 * The Populator for emails associated with Transactions
 *  Such emails are a cover-note for the Invoice PDF attachment that they carry 
 * For MVP, there is 4 such templates: all served by this populator: 
 * 				email_proforma_invoice
 * 				email_final_invoice	
 * 				email_penalty_invoice	
 *   
 */
public class TransactionPopulator extends AbstractPopulator implements Injectables {

	protected final String INVOICE_FOLDER = "invoices/";
	
	// Constructor - populates the P3sEmailData
	public TransactionPopulator(String templateName, Object obP3suser
			, Object obTxnRef, Object obFundsTargetArriveTime
			, Object obAttachmentFilename
			, Object obPatents
			, Object obPayeeDets
			, Object obPrice
	) 
	{
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.TRANSACTION;
		String err = "TransactionPopulator constructor : ";

		if (EmailTemplates.email_proforma_invoice.equals(templateName)
				|| EmailTemplates.email_final_invoice.equals(templateName)
				|| EmailTemplates.email_penalty_invoice.equals(templateName) )
		{
			populateAnyInvoice(templateName, obP3suser
					, obTxnRef, obFundsTargetArriveTime
					, obAttachmentFilename
					, obPatents, obPayeeDets, obPrice);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateAnyInvoice(String templateName, Object obP3suser
			, Object obTxnRef, Object obFundsTargetArriveTime
			, Object obAttachmentFilename
			, Object obPatents
			, Object obPayeeDets, Object obPrice
	) {
		// Supports template EmailTemplates.email_proforma_invoice
		// &, as final invoice & penalty invoice requires a subset of this data,
		// also supports: email_final_invoice email_penalty_invoice 
		String err = "TransactionPopulator populateForProformaInvoice : ";
		
		// Start validating and populating
		populateUniversalFields(obP3suser, obTxnRef, obPatents, obAttachmentFilename);
		populatePaymentDueFields(obFundsTargetArriveTime, obPayeeDets, obPrice);
		
		// Validate the remaining parameters
		if  ( isEmpty(templateName)) { 
					fail(err+"invoked with Bad Parameters : "+isEmpty(templateName));
		}

		// 1of3: Retrieve data from property file
		// 2of3: retrieve user & company details. 
		// 3of3: Assemble any values requiring work here - acTidy - titles
		attachmentPath = attachmentRootPath+INVOICE_FOLDER;
		
		
		
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent(attachmentPath, attachmentFilename);
		
		log().debug(err+" completed preparation for template: "+templateName);
	}
	

	protected void populateUniversalFields(Object obP3suser, Object obTxnRef, Object obPatents, Object obAttachmentFilename) {
		// Used for ALL Transaction templates 
		String err = "TransactionPopulator populateUniversalFields : ";
		
		// Validate the parameters
		if  ( (obP3suser==null) || (obTxnRef==null) || (obPatents==null)) {  // formerly (obAttachmentFilename==null) 
				fail(err+"invoked with Bad Parameters : "+(obP3suser==null)+(obTxnRef==null)+(obPatents==null)); 
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
		String siteTomcatUrl = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			String pathToDocs = reader.getESProperty(P3SPropertyNames.PATH_TO_PDF_DOCS); 
			attachmentRootPath = reader.checkPathPropertyTerminated(pathToDocs);
			siteTomcatUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		data.setLoginUrl(siteTomcatUrl);
		
		
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

	protected void populatePaymentDueFields(Object obFundsTargetArriveTime, Object obPayeeDets, Object obPrice) {
		// Used for SOME Transaction templates 
		String err = "TransactionPopulator populatePaymentDueFields : ";
		
		// Validate the parameters
		if  ( (obFundsTargetArriveTime==null) || (obPayeeDets==null) || (obPrice==null)) { 
				fail(err+"invoked with Bad Parameters : "+(obFundsTargetArriveTime==null)+(obPayeeDets==null)+(obPrice==null)); 
		}

		String fundsTargetArriveTime = null;
		BankTransferPaymentDetails payeeDets = null;
		String price = null;
		try {
			fundsTargetArriveTime = (String) obFundsTargetArriveTime;
			payeeDets = (BankTransferPaymentDetails) obPayeeDets;
			price = (String) obPrice;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }

		// 1of3: Retrieve data from property file
		// n/a
		
		// 2of3: retrieve user & company details. 
		// n/a
		
		// 3of3: Assemble any values requiring work here - acTidy - titles
		data.setTimestampTargetFundsArrivel(fundsTargetArriveTime);

		TwoColRecord a2colRecord = null;
		List<TwoColRecord> payDets = new ArrayList<TwoColRecord>();
		//a2colRecord = new TwoColRecord("Payment channel", payeeDets.getAccount1Type()); // inhibit whilst email_proforma_invoice.txt says 'for both FEDWIRE and ACH'
		//payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Bank name", payeeDets.getAccount1BankName());
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("ABA Routing Number", payeeDets.getAccount1BranchCode());
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Account Number", payeeDets.getAccount1AcctNumber());
		payDets.add(a2colRecord);
		// Here, Skip AcctType & AcctName. They detract from the Reference number, & are unlikley to be needed. 
		a2colRecord = new TwoColRecord("Reference", data.getTransactionReference()); // Which WILL have been populated by here
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Amount", "$"+price);
		payDets.add(a2colRecord);
		
		data.setPaymentDetails(payDets);

		data.setPrice(price);

	}

	

	
	
	protected void prepareEmailContent(String attachmentPath, String attachmentFilename) {
		String err = "TransactionPopulator prepareEmailContent : ";

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
		
		zz("TransactionPopulator prepareEmailContent : PREinject Subject WAS "+subjectLinePREinject);
		zz("TransactionPopulator prepareEmailContent : injectIntoSubject has created "+currentLine);
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
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTIMESTAMP_TARGET_FUNDS_ARRIVAL();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPRICE();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectTXT__FOR_EACH_PATENT();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_PLURALITY_TEXT_FRAGMENT();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectPATENT_PLURALITY_S();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectNUMBER_OF_PATENTS();
		if (moreInjectionsNeeded) moreInjectionsNeeded = injectLOGIN_URL();
		
		// Check for Repeating sets
		if (moreInjectionsNeeded) {
			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PATENTS))!=-1) processRepeatingPatents();
			if (currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PAYMENT_DETAILS))!=-1) 
					processRepeatingPaymentDetails();
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
			log().debug("acDebug TransactionPopulator 243: (data==null)="+(data==null)+"  (patent==null)="+(patent==null)); // discard once no longer populated with dodgy patent.getID(1L) - acTodo
			data.setPatentApplicationNumber(patent.getEP_ApplicationNumber());
			data.setPatentShortTitle(patent.getShortTitle());
			data.setPatentTitle(patent.getTitle());
			injectPATENT_APPLICATION_NUMBER();
			injectSHORT_TITLE();
			injectPATENT_TITLE();
			bloc.append(currentLine);
		}
		currentLine = bloc.toString();
	}
	
	
	protected void processRepeatingPaymentDetails() {
		StringBuilder bloc = new StringBuilder("");
		int prefixEnd = currentLine.indexOf(assembleTag(Injectables.THREECOL_TABLE_OF_PAYMENT_DETAILS));
		if (prefixEnd>0) bloc.append(currentLine,0,prefixEnd);

		int repeatingLineStart = currentLine.indexOf(SQUARECLOSE, (prefixEnd+1));
		String subtemplate;
		if (currentLine.length()>repeatingLineStart) subtemplate = currentLine.substring(repeatingLineStart+1);
		else subtemplate = currentLine; 

		for (TwoColRecord payLine : data.getPaymentDetails()) {
			currentLine = subtemplate;
			// update fields on each loop/payLine
			data.setFieldb(payLine.getField1());
			data.setFieldc(payLine.getField2());
			injectFIELDB();
			injectFIELDC();
			bloc.append(currentLine);
		}
		currentLine = bloc.toString();
	}
	
	
	
	
	
//	public P3sEmail generateEmail() {  ACtIDY
//		P3sEmail email = new P3sEmail(this.templateName, this.subject, this.htmlBody, this.attachmentPath, this.attachmentFilename);
//		return email;
//	}
	


	
}
