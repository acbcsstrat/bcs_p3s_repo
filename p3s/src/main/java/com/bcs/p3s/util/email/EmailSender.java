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
import com.bcs.p3s.util.lang.Universal;


public class EmailSender extends Universal {

	public void sendEmail(P3sEmail emailContent) {
		System.out.println(" starting sendEmail()  ");
		if (emailContent==null) fail("sendEmail() passed a null emailContent!");
		
    	Properties properties = new Properties();  
    	properties.setProperty("mail.smtp.host", "localhost");  
    	properties.setProperty("mail.smtp.port", "25");  
    	
    	
    	Session mailsession = Session.getInstance(properties,null);  
    	//Session session=Session.getDefaultInstance(properties,null);  

    	MimeMessage message = new MimeMessage(mailsession);  
    	
    	try {
			//message.setFrom(new InternetAddress("noreply@p3s.me"));
			//message.setFrom(new InternetAddress("noreply@start-space.co.uk"));
			message.setFrom(new InternetAddress("noreply@mail.thepatent.place"));

			message.addRecipient(Message.RecipientType.TO,   
	    			new InternetAddress("andychapman1977@gmail.com"));  

			message.addRecipient(Message.RecipientType.TO,   
	    			new InternetAddress("andy.chapman@boxcleversoftware.com"));  
	    				
		} catch (AddressException e1) {
	    	System.out.println("exception preparing msg - part 1");
			e1.printStackTrace();
		} catch (MessagingException e1) {
	    	System.out.println("exception preparing msg - part 1");
			e1.printStackTrace();
		}  
    	
    	//message.setHeader("Hi, everyone - this HEADER - Does that mean SUBJECT ??");
    	try {
			//message.setSubject("Hi, this is the result of setSubject()");
			message.setSubject(emailContent.getSubject());
    	} catch (MessagingException e) {
	    	System.out.println("message.setSubject threw exception ");
			e.printStackTrace();
		}
    	
    	try {
//    			From the JLS:
//    			\n    \ u 000a: linefeed LF 
//    			\r    \ u 000d: carriage return CR 

//    		String msgText = "Hi, This mail is to inform you...\r\n\r\nHopefully a blank line above, followed by this \r\n\r\nAndy";
//    		message.setText(msgText);

    		//String htmlAttempt = "Line One <hr/>One <b>Two</b> Three <a href=\"http://micro-skip.com/\">Four</a><br/>Here More";
    		String htmlBody = emailContent.getHtmlBody();
    		message.setContent(htmlBody, "text/html");
    		
		} catch (MessagingException e) {
	    	System.out.println("message.setText threw exception ");
			e.printStackTrace();
		}  
    	
    	
    	
    	try {
			Transport.send(message);
		} catch (MessagingException e) {
	    	System.out.println("Transport.send(message); threw exception ");
			e.printStackTrace();
		}  

	}
	

	
}
