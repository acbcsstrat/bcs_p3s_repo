package com.bcs.p3s.docs.email.populators;

// What purpose does this server - Does this still serve any purpose ? - acTidy
/**
 * We need to log-to-file all emails.
 * To simplify accessing specific emails, emails are grouped by type, 
 * with each type having its own logfile in /p3slogs/
 * 
 * This enum is used to deteremine which logfile a specific email is logged to
 */
public enum EmailTypeEnum {

	  NOTSET			// Initial value. Should never be used
	, REGISTER			// Inc Password Reset
	, REMINDER
	, TRANSACTION
	, INTERNAL_USE_ONLY
//	, PANIC
	;

}
