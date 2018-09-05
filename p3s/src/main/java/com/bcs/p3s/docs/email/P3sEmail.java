package com.bcs.p3s.docs.email;

import com.bcs.p3s.docs.email.Populators.EmailTypeEnum;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.Universal;

/**
 * All P3S emails are a P3sEmail
 */
public class P3sEmail extends Universal implements P3sEmailInterface {

	String templateName = null;
	EmailTypeEnum emailType = EmailTypeEnum.NOTSET; 
	String fromAddress = null;
	String subject = null;
	String htmlBody = null;
	String attachmentPath = null;
	String attachmentFilename = null;
	boolean bccToOps = false;
	// Note: client is responsible for providing recipient email addresses to emailer
	
	
	private P3sEmail() {   // prevent default constructor
		// default constructor
	}
	public P3sEmail(String templateName, EmailTypeEnum emailType
			, String subject,String htmlBody, String attachmentPath, String attachmentFilename) 
	{
		this.templateName = templateName;
		this.emailType = emailType;
		this.fromAddress = determineFromAddress();
		this.subject = subject;
		this.htmlBody = htmlBody;
		this.attachmentPath = attachmentPath;
		this.attachmentFilename = attachmentFilename;
	}
	
	
	
	

	
	
	
	protected String determineFromAddress() {
		String from = null;
		// Retrieve data from property file
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			from = reader.getESProperty(P3SPropertyNames.P3S_FROM_EMAIL_ADDRESS); 
		} catch (P3SPropertyException e) {
			fail("P3sEmail determineFromAddress() property read failed",e);
		}
		return from;
	}
	

//	// Special getter
//	public boolean hasAttachment() {
//		return (attachmentFilename!=null);
//	}
	public boolean hasValidAttachmentDetails() {
		boolean safe = false;
		if (notEmpty(attachmentPath) && notEmpty(attachmentFilename)) safe = true;
		return safe;
	}
	
	
	// Ordinary getters/setters

	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	public EmailTypeEnum getEmailType() {
		return emailType;
	}
	public void setEmailType(EmailTypeEnum emailType) {
		this.emailType = emailType;
	}
	public String getFromAddress() {
		return fromAddress;
	}
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getHtmlBody() {
		return htmlBody;
	}
	public void setHtmlBody(String htmlBody) {
		this.htmlBody = htmlBody;
	}
	public String getAttachmentPath() {
		return attachmentPath;
	}
	public void setAttachmentPath(String attachmentPath) {
		this.attachmentPath = attachmentPath;
	}
	public String getAttachmentFilename() {
		return attachmentFilename;
	}
	public void setAttachmentFilename(String attachmentFilename) {
		this.attachmentFilename = attachmentFilename;
	}
	public boolean isBccToOps() {
		return bccToOps;
	}
	public void setBccToOps(boolean bccToOps) {
		this.bccToOps = bccToOps;
	}
	
}



 