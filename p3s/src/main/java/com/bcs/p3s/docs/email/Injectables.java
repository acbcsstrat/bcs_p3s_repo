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
	String WEBSITE_URL = "WEBSITE_URL";
	String URL_TO_VERIFY_EMAIL = "URL_TO_VERIFY_EMAIL";
	String URL_TO_FAQ = "URL_TO_FAQ";
	
	// User and Company details
	String FIRSTNAME = "FIRSTNAME"; 
	String LASTNAME = "LASTNAME"; 
	String COMPANY_NAME = "COMPANY_NAME";
	String COMPANY_CODE = "COMPANY_CODE";
	String COMPANY_PIN = "COMPANY_PIN";

	// Patent and renewal timing details
	String TIME_BEFORE_CHANGE_PHRASE = "TIME_BEFORE_CHANGE_PHRASE";  // e.g. "2 weeks"
	String PATENT_TRANSACTION_TYPE = "PATENT_TRANSACTION_TYPE";
	String PATENT_APPLICATION_NUMBER = "PATENT_APPLICATION_NUMBER";
	String PATENT_TITLE = "PATENT_TITLE";
	String SHORT_TITLE = "SHORT_TITLE";
	String PATENT_CLIENT_REF = "PATENT_CLIENT_REF";
	String PRICE = "PRICE";											// WithOUT currency symbol
	String TIMESTAMP_OF_NEXT_COLOUR_CHANGE = "TIMESTAMP_OF_NEXT_COLOUR_CHANGE"; // Inc. Timezone

	// Transaction details
	String TRANSACTION_REFERENCE = "TRANSACTION_REFERENCE";
	String TIMESTAMP_TARGET_FUNDS_ARRIVAL = "TIMESTAMP_TARGET_FUNDS_ARRIVAL";
	String NUMBER_OF_PATENTS = "NUMBER_OF_PATENTS"; 
	String FIELDB = "FIELDB"; 
	String FIELDC = "FIELDC"; 
	String PATENT_PLURALITY_TEXT_FRAGMENT = "PATENT_PLURALITY_TEXT_FRAGMENT"; // "is" or "s are"
	String PATENT_PLURALITY_S = "PATENT_PLURALITY_S"; // "" or "s"
	
	// Fixed text formats - acTidy - are these needed?
	String CRLF = "CRLF";
	String TXT__FOR_EACH_PATENT = "TXT__FOR_EACH_PATENT";
	
	// 'Repeating Set' Identifiers  ===================================================================================
	String THREECOL_TABLE_OF_PATENTS = "THREECOL_TABLE_OF_PATENTS"; 
	String THREECOL_TABLE_OF_PATENT_DETAILS = "THREECOL_TABLE_OF_PATENT_DETAILS"; 
	String THREECOL_TABLE_OF_PAYMENT_DETAILS = "THREECOL_TABLE_OF_PAYMENT_DETAILS"; 
	String THREECOL_TABLE_OF_COMPANY_DETAILS = "THREECOL_TABLE_OF_COMPANY_DETAILS"; 

//	String TABLE__TWO_DATA_COLUMNS = "TABLE__TWO_DATA_COLUMNS"; 
	
	
	
	
}
