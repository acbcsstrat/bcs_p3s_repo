package com.bcs.p3s.docs.email;

/**
 * defines the name of each value that can be injected into an email
 * 
 * Separated into regular values and array values:
 * - Regular values will be surrounded by [] in a template. They have just one value.
 * - Array values will be surrounded by {} in a template. They represent a value that will exist for each element in the array
 * Consequently, where there is an array, the array NAME is surrounded by []
 * 
 *  (and, NO, you cannot have an array within an array ! )
 * 
 * Hence P3S emails may not contain the characters  {}[]
 *
 */
public interface Injectables {

	// Regular values ===================================================================================

	
	String SUPPORT_EMAIL_ADDRESS = "SUPPORT_EMAIL_ADDRESS";
	String LOGIN_URL = "LOGIN_URL";
	String URL_TO_VERIFY_EMAIL = "URL_TO_VERIFY_EMAIL";
	
	String FIRSTNAME = "FIRSTNAME"; 
	String LASTNAME = "LASTNAME"; 
	String COMPANY_NAME = "COMPANY_NAME";
	String COMPANy_CODE = "COMPANy_CODE";
	String COMPANY_PIN = "COMPANY_PIN";

	
	// Array values   ===================================================================================
	
	
}
