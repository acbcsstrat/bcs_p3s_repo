package com.bcs.p3s.docs.email.Populators;

import java.util.List;

import com.bcs.p3s.docs.email.Injectables;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailData;
import com.bcs.p3s.util.lang.Universal;

public abstract class AbstractPopulator extends Universal implements PopulatorInterface {

	protected final int MAXTAGS_PER_LINE = 3;
	protected final String CRLF = "\n";
	
	
	protected String templateName = null;
	protected P3sEmailData data = new P3sEmailData();
	
	protected String subject;
	protected String htmlBody;
	protected String attachmentPath;
	protected String attachmentFilename;



	public AbstractPopulator(String templateName) {
		this.templateName = templateName;
	}
	
	public abstract P3sEmail generateEmail(); // Read template, instantiate p3sEmail, do inject


	
	// Code for Injecting values
	final String SQUAREOPEN = "[";
	final String SQUARECLOSE = "]";
	protected String currentLine = "";		// For temporary use during injection. NEVER null
	StringBuilder bodyWip = new StringBuilder(""); 
	protected abstract boolean doAllInjectionsForCurrentLine();  // Subtype knows which of the below inject*() methods to call 
	/** This has the big loop, and invokes the subtype doAllInjectionsForCurrentLine() for each line **/
	protected String doAllInjectionsIntoBody(List<String> wholeTemplate) { 
		String err = "AbstractPopulator doAllInjectionsIntoBody ("+templateName+") : ";
		// 1st line of template is subject line. Already processed. so remove it
		wholeTemplate.remove(0);
		for (String preInjectLine : wholeTemplate) {
			currentLine = preInjectLine;
			boolean moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
			int attempts = 0;
			while (moreInjectionsNeeded) {
				moreInjectionsNeeded = doAllInjectionsForCurrentLine();
				if (++attempts >= MAXTAGS_PER_LINE)	
					fail(err+" FAILED to eradicate [s after "+MAXTAGS_PER_LINE
							+" ATTEMPTS. line NOW is "+currentLine+" :: Line WAS : "+preInjectLine);
				zz(err+" attempt "+attempts+" (result:"+moreInjectionsNeeded+") for line: "+currentLine);
			}
			bodyWip.append(CRLF);
			bodyWip.append(currentLine);
		}
		return bodyWip.toString();
	}
	protected String assembleTag(String root) { return SQUAREOPEN + root + SQUARECLOSE; }

	// Now the individual Injectors
	protected boolean injectFIRSTNAME() {
		String newString = currentLine.replace(assembleTag(Injectables.FIRSTNAME), data.getFirstname());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectLASTNAME() {
		String newString = currentLine.replace(assembleTag(Injectables.LASTNAME), data.getLastname());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectURL_TO_VERIFY_EMAIL() {
		String newString = currentLine.replace(assembleTag(Injectables.URL_TO_VERIFY_EMAIL), data.getUrlToVerifyEmail());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectCOMPANY_NAME() {
		String newString = currentLine.replace(assembleTag(Injectables.COMPANY_NAME), data.getCompanyName());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectSUPPORT_EMAIL_ADDRESS() {
		String newString = currentLine.replace(assembleTag(Injectables.SUPPORT_EMAIL_ADDRESS), data.getSupportEmailAddress());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectURL_TO_FAQ() {
		String newString = currentLine.replace(assembleTag(Injectables.URL_TO_FAQ), data.getUrlToFaq());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectCOMPANY_CODE() {
		String newString = currentLine.replace(assembleTag(Injectables.COMPANY_CODE), data.getCompanyCode());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectCOMPANY_PIN() {
		String newString = currentLine.replace(assembleTag(Injectables.COMPANY_PIN), data.getCompanyPin());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectLOGIN_URL() {
		String newString = currentLine.replace(assembleTag(Injectables.LOGIN_URL), data.getLoginUrl());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectTIME_BEFORE_CHANGE_PHRASE() {
		String newString = currentLine.replace(assembleTag(Injectables.TIME_BEFORE_CHANGE_PHRASE), data.getTimeBeforeChangePhrase());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectPATENT_APPLICATION_NUMBER() {
		String newString = currentLine.replace(assembleTag(Injectables.PATENT_APPLICATION_NUMBER), data.getPatentApplicationNumber());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectPATENT_TITLE() {
		String newString = currentLine.replace(assembleTag(Injectables.PATENT_TITLE), data.getPatentTitle());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectSHORT_TITLE() {
		String newString = currentLine.replace(assembleTag(Injectables.SHORT_TITLE), data.getPatentShortTitle());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectPATENT_CLIENT_REF() {
		String newString = currentLine.replace(assembleTag(Injectables.PATENT_CLIENT_REF), data.getPatentClientRef());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectPRICE() {
		String newString = currentLine.replace(assembleTag(Injectables.PRICE), data.getPrice());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}
	protected boolean injectTIMESTAMP_OF_NEXT_COLOUR_CHANGE() {
		String newString = currentLine.replace(assembleTag(Injectables.TIMESTAMP_OF_NEXT_COLOUR_CHANGE), data.getTimestampOfNextColourChange());
		currentLine = newString;
		return (currentLine.indexOf(SQUAREOPEN)!=-1);
	}

	
	

	
	
	
	
	// Regular getters & setters
	
	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String template) {
		this.templateName = template;
	}

	public P3sEmailData getData() {
		return data;
	}

	public void setData(P3sEmailData data) {
		this.data = data;
	}


	
	protected void zz(String s) {  // acTidy
		System.out.println("zz: "+s);
	}
	
}
