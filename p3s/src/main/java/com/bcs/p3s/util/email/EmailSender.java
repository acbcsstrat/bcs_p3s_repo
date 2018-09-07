package com.bcs.p3s.util.email;

import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.Message.RecipientType;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;
import com.bcs.p3s.util.lang.Universal;


public class EmailSender extends Universal {

	protected P3sEmail content = null;
	protected MimeMessage message = null;  
	protected boolean setRecip = false;
	
	/**
	 *  Constructor. Force email to be prepared here (with no recipients).
	 *  Client subsequently alter the recipients before sending   
	 */
	public EmailSender (P3sEmail emailContent) {
		if (emailContent==null) fail("EmailSender() passed a null emailContent!");
		this.content = emailContent;

		Properties properties = new Properties();  
    	properties.setProperty("mail.smtp.host", "localhost");  
    	properties.setProperty("mail.smtp.port", "25");  

    	Session mailsession = Session.getInstance(properties,null);  
    	//Session session=Session.getDefaultInstance(properties,null);  

    	message = new MimeMessage(mailsession);  
    	
    	try {
    		//message.setContent(emailContent.getHtmlBody(), "text/html");
    		//    			BTW: From the JLS:
			//    			\n    \ u 000a: linefeed LF 
			//    			\r    \ u 000d: carriage return CR 
			//    		& for Plain text: (e.g. Visually Impaired: see https://stackoverflow.com/questions/29539882/not-receiving-
    		//			also: gmail block because ipv6 PTR policy. see todo-later.txt
			message.setFrom(new InternetAddress(emailContent.getFromAddress()));
			//message.setFrom(new InternetAddress("noreply@mail.thepatent.place"));
			message.setSubject(emailContent.getSubject());
			// Body
			MimeBodyPart messageHtmlBodyPart = new MimeBodyPart();
			messageHtmlBodyPart.setContent(emailContent.getHtmlBody(), "text/html");
			Multipart multipart = new MimeMultipart();
			multipart.addBodyPart(messageHtmlBodyPart);

			// An attachment
	    	if (content.hasValidAttachmentDetails()) {
	    		String fullFilespec = content.getAttachmentPath() + content.getAttachmentFilename(); 
	    		MimeBodyPart attachPart = new MimeBodyPart();
				DataSource source = new FileDataSource(fullFilespec);
				attachPart.setDataHandler(new DataHandler(source));
				attachPart.setFileName(content.getAttachmentFilename());
	    		multipart.addBodyPart(attachPart);
	    	}
	    	
			message.setContent(multipart);

	    	addBccToOpsIfRequired(emailContent);

    	} catch (Exception e1) {
			fail("Failed whilst preparing email");
		}  
	}

	/** Add recipient **/
	public void addRecipient(String another) {
		internalAddRecipient(another, Message.RecipientType.TO);
		setRecip = true;
	}
	/** replace recipient with PanicDevs **/
	public void setRecipientsToDevs() {
		internalAddRecipient("andychapman1977@gmail.com", Message.RecipientType.TO);
		internalAddRecipient("andy.chapman@boxcleversoftware.com", Message.RecipientType.TO);
		setRecip = true;
	}
	/** Add a BCC to our Operations team, if required **/
	protected void addBccToOpsIfRequired(P3sEmail emailContent) {
		final String INHIBIT = "INHIBIT";
		if (emailContent==null) return;
		if (emailContent.isBccToOps() == true) {
			
			String opsEmailAddress = null;
			try {
				P3SPropertyReader reader = new P3SPropertyReader();
				opsEmailAddress = reader.getESProperty(P3SPropertyNames.NOTIFY_P3S_OPS_EMAIL_ADDRESS); 

				log().debug(" addBccToOpsIfRequired adding BCC2OPS("+opsEmailAddress+") : Template="+emailContent.getTemplateName());
				if ( ! INHIBIT.equalsIgnoreCase(opsEmailAddress)) { 
					internalAddRecipient(opsEmailAddress, Message.RecipientType.BCC);
				}

			} catch (P3SPropertyException e) {
				logInternalError().error("EmailSender addBccToOpsIfRequired() : property read failed",e);
			}
		}
	}
	
	
	
	/**
	 * Sends the email prepared
	 * Logs email to std log
	 * Inhibit sending if from developer PC (as would fail & stackdump)
	 * @param emailContent
	 */
	public void sendEmail() {
		logEmail(content);
		if ( ! setRecip) fail("sendEmail() invoked when recipients not yet set");
		
		
		if (P3SEnvironmentKnowledge.isDeveloperPC()) { 
			log().info("Email not sent, as host isDeveloperPC()"); 
		} else {
	    	try {
				Transport.send(message);
				log().info("Email sent."); 
			} catch (MessagingException e) {
				log().fatal("Transport.send(message); threw exception", e); 
			}  
		}
	}

	
	protected void internalAddRecipient(String recip, RecipientType emailRecipType) {
		try {
			message.addRecipient(emailRecipType, new InternetAddress(recip));  
		} catch (AddressException e1) {
			logInternalError().error("exception preparing msg - part 1 - for "+recip,e1);
		} catch (MessagingException e2) {
			logInternalError().error("exception preparing msg - part 2 - for "+recip,e2);
		}  
	}


	protected void logEmail(P3sEmail emailContent) {
		String msg = "Start of email sent:\nSubject:\n"+emailContent.getSubject() 
		+ "\nBody:\n"+emailContent.getHtmlBody();
		if (emailContent.hasValidAttachmentDetails()) 
			msg += ("\nAttachment: "+emailContent.getAttachmentPath()+emailContent.getAttachmentFilename());
		else msg += "\n(No attachment)";
		msg += "\nEnd of email sent";
		msg += ("\nabove sent TO: "+getRecipientsAsStr()+"\n                        ");
		getLoggerForEmail(emailContent).info(msg);
	}
	
	protected String getRecipientsAsStr() {
		String recips = "Recips: ";
		
		Address[] addresses = null;
		try {
			addresses = message.getRecipients(Message.RecipientType.TO);
		} catch (MessagingException e) {  /* Ignore */ }
		if (addresses!=null) for (Address addr : addresses) {
			recips += (addr.toString() + " ");
		}
		return recips;
	}
	
}
