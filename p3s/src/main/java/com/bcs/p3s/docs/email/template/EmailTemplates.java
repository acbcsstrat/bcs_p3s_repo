package com.bcs.p3s.docs.email.template;

/**
 * Defines the name of each email variant which can be created by P3S
 *
 */
public interface EmailTemplates {
	
	// Email(s) supporting customer Registration with P3S & password reset
	String email_register_combined	= "email_register_combined";
	String email_password_reset	= "email_password_reset";

	// 'Notification' Emails : Reminding custoers that a patent can be renewed
	String email_reminder_standard	= "email_reminder_standard"; 
	String email_reminder_green_opens = "email_reminder_green_opens";
	String email_reminder_blue_opens = "email_reminder_blue_opens";
	//email_reminder_red_1day			Cannot sell  // 17113 DISCONTINUED - whats the point?
	String email_reminder_black_5day = "email_reminder_black_5day";
	String email_reminder_after_black = "email_reminder_after_black";

	// Transaction Emails - relating to a renewal order
	String email_proforma_invoice		= "email_proforma_invoice"; 
	String email_final_invoice			= "email_final_invoice"; 
	String email_renewal_certificate	= "email_renewal_certificate"; 
	String email_penalty_invoice		= "email_penalty_invoice"; 

}
