package com.bcs.p3s.util.log;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.log4j.Logger;

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

	/**
	 * e.g.
	 *  Amber 2 weeks email sent for patent 123456789.2 to 3 recipients
	 */
	protected Logger logReminderEmailSentN4CU = null;
	public Logger logReminderEmailSent() {
		if (logReminderEmailSentN4CU==null) { logReminderEmailSentN4CU = Logger.getLogger(REMINDER_EMAIL_SENT); }
		return logReminderEmailSentN4CU;
	}



	/**
	 * panic() is use to log unexpected events. 
	 * Logs as fatal, AND *WILL* send an email to dev team
	 * By allowing this log action, invoking code can be simpler, as it is now allowed to crash
	 * @param msg A string to be logged
	 */
	public void panic(String msg, Throwable x) {
		String panicMsg = "PANIC: "+msg;
		if (x==null) {
			logInternalError().fatal(panicMsg);
		}
		else
		{
			logInternalError().fatal(panicMsg, x);
		}
		// Imminent functionality - now email this panic to dev team
		String emailBody = panicMsg + "\n\n";
		if (x!=null) {
			emailBody += x.getMessage();
			emailBody += "\n\n";

			StringWriter errors = new StringWriter();
			x.printStackTrace(new PrintWriter(errors));
			emailBody += errors.toString();
		}
		// & - until email is available
		log().debug("Prepared email body is:"+emailBody);
	}
	
	
}
