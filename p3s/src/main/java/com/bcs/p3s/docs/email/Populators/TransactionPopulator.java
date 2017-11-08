package com.bcs.p3s.docs.email.Populators;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailData;
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
 *  Such emails are a cover-note for the Invoice or Transaction that they carry 
 * For MVP, there is 4 such templates: all served by this populator: 
 * 				email_proforma_invoice
 * 				email_final_invoice	
 * 				email_certificate_invoice
 * 				email_penalty_invoice	
 *   
 */
public class TransactionPopulator extends AbstractPopulator implements Injectables {

	protected final String INVOICE_FOLDER = "invoices/";
	protected final String CERTIFICATE_FOLDER = "certificates/";
	
	// Constructor - populates the P3sEmailData
	public TransactionPopulator(String templateName, Object obP3suser
			, Object obTxnRef, Object obFundsTargetArriveTime
			, Object dummy, Object obAttachmentFilename
			, Object obPatents
			, Object obPayeeDets
			, Object obPrice
	) {
		super(templateName);  // set templateName
		templatetype = EmailTypeEnum.TRANSACTION;
		String err = "TransactionPopulator constructor : ";

		if (EmailTemplates.email_proforma_invoice.equals(templateName)) {
			populateForProformaInvoice(templateName, obP3suser
					, obTxnRef, obFundsTargetArriveTime
					, null, obAttachmentFilename
					, obPatents, obPayeeDets, obPrice);
		}
		else fail(err+"cannot support offered template: "+templateName);
	}
	
	

	protected void populateForProformaInvoice(String templateName, Object obP3suser
			, Object obTxnRef, Object obFundsTargetArriveTime
			, Object dummy, Object obAttachmentFilename
			, Object obPatents
			, Object obPayeeDets, Object obPrice
	) {
		// Supports template EmailTemplates.email_proforma_invoice 
		String err = "TransactionPopulator populateForProformaInvoice : ";
		
		// Validate the parameters
		if  ( isEmpty(templateName) || (obP3suser==null)  
				|| (obTxnRef==null) || (obFundsTargetArriveTime==null)  
				|| (obAttachmentFilename==null) 
				|| (obPatents==null) || (obPayeeDets==null) || (obPrice==null)) { 
					fail(err+"invoked with Bad Parameters : "+isEmpty(templateName)
						+ (obP3suser==null)+(obTxnRef==null)+(obFundsTargetArriveTime==null) 
						+ (obAttachmentFilename==null)  
						+ (obPatents==null)+(obPayeeDets==null)+(obPrice==null)); 
		}
		P3SUser userRecord = null;
		String txnRef = null;
		String fundsTargetArriveTime = null;
		String attachmentPath = null;
		String attachmentFilename= null;
		List<Patent> patents = null; 
		BankTransferPaymentDetails payeeDets = null;
		String price = null;
		try {
			userRecord = (P3SUser) obP3suser;
			txnRef = (String) obTxnRef;
			fundsTargetArriveTime = (String) obFundsTargetArriveTime;
			//attachmentPath = (String) obAttachmentPath;
			attachmentFilename = (String) obAttachmentFilename;
			patents = (List<Patent>) obPatents;
			payeeDets = (BankTransferPaymentDetails) obPayeeDets;
			price = (String) obPrice;
		} catch (Exception e) { fail(err+"failed casting of object parameters", e); }

		
				
		// 1of3: Retrieve data from property file
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			String pathToDocs = reader.getESProperty(P3SPropertyNames.PATH_TO_PDF_DOCS); 
			attachmentPath = reader.checkPathPropertyTerminated(pathToDocs)+INVOICE_FOLDER;
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
		data.setTimestampTargetFundsArrivel(fundsTargetArriveTime);
		data.setPatents(patents);
		data.setNumberOfPatents(""+patents.size());

		TwoColRecord a2colRecord = null;
		List<TwoColRecord> payDets = new ArrayList<TwoColRecord>();
		a2colRecord = new TwoColRecord("ABA Number", payeeDets.getItem1());
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Account Number", payeeDets.getAccountNumber());
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Reference", txnRef);
		payDets.add(a2colRecord);
		a2colRecord = new TwoColRecord("Amount", "$"+price);
		payDets.add(a2colRecord);
		data.setPaymentDetails(payDets);

		data.setPrice(price);

		
		
		// data is now populated with all the injectables required for this template

		// So ...
		// Now Inject
		prepareEmailContent(attachmentPath, attachmentFilename);
		
		log().debug(err+" completed preparation for template: "+templateName);
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
	
	
	
	
	
	public P3sEmail generateEmail() {
		P3sEmail email = new P3sEmail(this.templateName, this.subject, this.htmlBody, this.attachmentPath, this.attachmentFilename);
		return email;
	}
	


	
}
