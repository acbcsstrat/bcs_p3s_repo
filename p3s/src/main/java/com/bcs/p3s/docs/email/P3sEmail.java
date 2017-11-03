package com.bcs.p3s.docs.email;

import com.bcs.p3s.util.lang.Universal;

/**
 * All P3S emails are a P3sEmail
 */
public class P3sEmail extends Universal implements P3sEmailInterface {

	String templateName = null;
	String subject = null;
	String htmlBody = null;
	String attachmentPath = null;
	String attachmentFilename = null;
	// Note: client is responsible for providing recipient email addresses to emailer
	
	
	public P3sEmail() {
		// default constructor
	}
	public P3sEmail(String templateName, String subject,String htmlBody, String attachmentPath, String attachmentFilename) {
		this.templateName = templateName;
		this.subject = subject;
		this.htmlBody = htmlBody;
		this.attachmentPath = attachmentPath;
		this.attachmentFilename = attachmentFilename;
	}
	
	
	
	
	

	// Special getter
	public boolean hasAttachment() {
		return (attachmentFilename!=null);
	}
	
	
	// Ordinary getters/setters

	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
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

}



 