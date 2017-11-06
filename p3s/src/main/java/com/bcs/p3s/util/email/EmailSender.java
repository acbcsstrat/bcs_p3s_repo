package com.bcs.p3s.util.email;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.bcs.p3s.docs.email.P3sEmail;
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
		if (emailContent==null) fail("sendEmail() passed a null emailContent!");
		this.content = emailContent;

		Properties properties = new Properties();  
    	properties.setProperty("mail.smtp.host", "localhost");  
    	properties.setProperty("mail.smtp.port", "25");  

    	Session mailsession = Session.getInstance(properties,null);  
    	//Session session=Session.getDefaultInstance(properties,null);  

    	message = new MimeMessage(mailsession);  
    	
    	try {
			message.setFrom(new InternetAddress("noreply@mail.thepatent.place"));
			message.setSubject(emailContent.getSubject());
    		message.setContent(emailContent.getHtmlBody(), "text/html");
			//    			BTW: From the JLS:
			//    			\n    \ u 000a: linefeed LF 
			//    			\r    \ u 000d: carriage return CR 
			//    		& for Plain text: message.setText(msgText);
		} catch (AddressException e1) {
	    	System.out.println("exception preparing msg - part 1");
			e1.printStackTrace();
		} catch (MessagingException e1) {
	    	System.out.println("exception preparing msg - part 1");
			e1.printStackTrace();
		}  

	}


	/** Add recipient **/
	public void addRecipient(String another) {
		internalAddRecipient(another);
		setRecip = true;
	}
	/** replace recipient with PanicDevs **/
	public void setRecipientsToDevs() {
		internalAddRecipient("andychapman1977@gmail.com");
		internalAddRecipient("andy.chapman@boxcleversoftware.com");
		setRecip = true;
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
			} catch (MessagingException e) {
		    	System.out.println("Transport.send(message); threw exception ");
				e.printStackTrace();
			}  
		}
	}
	

	protected void logEmail(P3sEmail emailContent) {
		String msg = "Start of email sent:\nSubject:\n"+emailContent.getSubject() 
		+ "\nBody:\n"+emailContent.getHtmlBody()+"\nEnd of email sent";
		log().info(msg);
	}
	
	protected void internalAddRecipient(String recip) {
		try {
			message.addRecipient(Message.RecipientType.TO,   
	    			new InternetAddress(recip));  
		} catch (AddressException e1) {
	    	System.out.println("exception preparing msg - part 1");
			e1.printStackTrace();
		} catch (MessagingException e1) {
	    	System.out.println("exception preparing msg - part 2");
			e1.printStackTrace();
		}  
	}
}
