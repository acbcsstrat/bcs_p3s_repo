package com.bcs.p3s.util.log;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.log4j.Logger;

import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailFactory;
import com.bcs.p3s.docs.email.Populators.EmailTypeEnum;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.util.email.EmailSender;

/**
 * Provides logging methods.
 * Expect many other classes to Extended this
 * 
 * Dependencies:
 *   Loggable
 *   
 * @author andyc
 */
public class BcsLogger implements Loggable {

	// Log methods are public, so that this class can be instantiated by static methods 
	
	// To avoid erroneous usage: log.debug(...   Instead of log().debug(...,    Loggers are renamed *N4CU.
	//    being: Not For Client Use
	// This is only a risk where a client extends this class - which will happen lots

	protected Logger logN4CU = null;
	public Logger log() {		// Main logger, so short name for convenience
		if (logN4CU==null) { logN4CU = Logger.getLogger(STANDARD); }
		return logN4CU;
	}

	protected Logger logmaliciousN4CU = null;
	public Logger logM() {
		if (logmaliciousN4CU==null) { logmaliciousN4CU = Logger.getLogger(MALICIOUS); }
		return logmaliciousN4CU;
	}

	protected Logger loginternalerrorN4CU = null;
	public Logger logInternalError() {
		if (loginternalerrorN4CU==null) { loginternalerrorN4CU = Logger.getLogger(INTERNAL_ERROR); }
		return loginternalerrorN4CU;
	}
	
	/**
	 * To record a change-of-status of either a patent or a transaction
	 * Message format: Patent|Transaction <Id> ..
	 * e.g.
	 *  Transaction IP0001000001 [7] has been created for 2 patent(s) : aaaaaaaa.a bbbbbbb.b
	 *  Transaction IP0001000001 [7] has reached state : AWAITING_FUNDS | FUNDS_SENT 
	 *  Transaction IP0001000001 [7] has reached state : FUNDS_RECEIVED | EPO_RECEIVED : 1 Patent(s) were EPO-Instructed
	 *  Patent 123456789.1 [1] has been EPO_INSTRUCTED				{ Note: Usually happens upon EPO_RECEIVED, but for RED happens earlier at FUNDS_RECEIVED }
	 *  Patent 123456789.1 [1] has been renewed, confirms EPO.  Was renewed by P3S | Not by P3S.
	 *  Transaction IP0001000001 [7] is now COMPLETED
	 */
	protected Logger logChangeOfStatusN4CU = null;
	public Logger logChangeOfStatus() {
		if (logChangeOfStatusN4CU==null) { logChangeOfStatusN4CU = Logger.getLogger(CHANGE_OF_STATUS); }
		return logChangeOfStatusN4CU;
	}

	
	// P3S receives no emails, but can send 3 types of email. Should log every email sent
	/** As part of the sign-up process **/
	protected Logger logRegistrationEmailSentN4CU = null;
	public Logger logRegistrationEmailSent() {
		if (logRegistrationEmailSentN4CU==null) { logRegistrationEmailSentN4CU = Logger.getLogger(REGISTRATION_EMAIL_SENT); }
		return logRegistrationEmailSentN4CU;
	}
	/** e.g. Amber 2 weeks email sent for patent 123456789.2 to 3 recipients **/
	protected Logger logReminderEmailSentN4CU = null;
	public Logger logReminderEmailSent() {
		if (logReminderEmailSentN4CU==null) { logReminderEmailSentN4CU = Logger.getLogger(REMINDER_EMAIL_SENT); }
		return logReminderEmailSentN4CU;
	}
	/** Transaction created or progressed, where we need email the customer **/
	protected Logger logTransactionEmailSentN4CU = null;
	public Logger logTransactionEmailSent() {
		if (logTransactionEmailSentN4CU==null) { logTransactionEmailSentN4CU = Logger.getLogger(TRANSACTION_EMAIL_SENT); }
		return logTransactionEmailSentN4CU;
	}

	public Logger getLoggerForEmail(P3sEmail emailContent) {
		if (emailContent==null) return null;
		EmailTypeEnum type = emailContent.getEmailType();
		if (EmailTypeEnum.REGISTER==type) return logRegistrationEmailSent();
		else if (EmailTypeEnum.REMINDER==type) return logReminderEmailSent();
		else if (EmailTypeEnum.TRANSACTION==type) return logTransactionEmailSent();
		else if (EmailTypeEnum.TRANSACTION==type) return logTransactionEmailSent();
		else return logInternalError();
	}

	protected Logger logEpoN4CU = null;
	public Logger logEpo() {
		if (logEpoN4CU==null) { logEpoN4CU = Logger.getLogger(EPO_THROTTLING_MONITORING); }
		return logEpoN4CU;
	}

	

	/**
	 * panic() is used to log potentially (or definitely!) dangerous occurrences - to developers..
	 * Such occurrences will not occur in normal, valid operation. 
	 * Logs as fatal, AND sends an email to dev team
	 * By allowing this log action, invoking code can be simpler, as it is now allowed to crash
	 * This method does NOT prevent subsequent operation.
	 * @param msg A string to be logged
	 */
	public void panic(String msg) { panic(msg, null); }
	public void panic(String msg, Throwable x) {
		String panicMsg = "PANIC: "+msg;
		Logger panicLogger = Logger.getLogger("PANIC_EMAIL_SENT");
		if (x==null) {
			logInternalError().fatal(panicMsg);
			panicLogger.fatal(panicMsg);
		}
		else
		{
			logInternalError().fatal(panicMsg, x);
			panicLogger.fatal(panicMsg, x);
		}
		// now email this panic to dev team
		String emailBody = panicMsg + "\n\n";
		if (x!=null) {
			emailBody += x.getMessage();
			emailBody += "\n\n";

			StringWriter errors = new StringWriter();
			x.printStackTrace(new PrintWriter(errors));
			emailBody += errors.toString();
		}
		P3sEmailFactory emailFactory = new P3sEmailFactory();
		P3sEmail pan = emailFactory.create(EmailTemplates.email_panic, 
				"PANIC message from P3Sweb !", emailBody, null, null, null, null, null );
		// formerly:  P3sEmail pan = new P3sEmail("panic", EmailTypeEnum.NOTSET, "PANIC message from P3Sweb !", emailBody, null, null);
    	EmailSender emailer = new EmailSender(pan);
    	emailer.setRecipientsToDevs();
    	emailer.sendEmail();
	}
	
}
