package com.bcs.p3s.docs.email.template;

/**
 * Defines the name of each email variant which can be created by P3S
 *
 */
public interface EmailTemplates {
	
	String email_register_combined	= "email_register_combined";
	
	String email_reminder_standard	= "email_reminder_standard"; 
			
//
//	email_reminder_colour_opens		- template 1
//			
//
//	email_reminder_black_5day		Your’e leaving this really late !
//
//	email_reminder_red_1day			Cannot sell
//
//	email_reminder_after_black		afterBlack - phone us

	
	
	String email_proforma_invoice		= "email_proforma_invoice"; 
	String email_final_invoice			= "email_final_invoice"; 
	String email_renewal_certificate	= "email_renewal_certificate"; 
	String email_penalty_invoice		= "email_penalty_invoice"; 

}
