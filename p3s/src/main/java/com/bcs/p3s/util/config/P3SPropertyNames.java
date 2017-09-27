package com.bcs.p3s.util.config;



/**
 * Convenience class of constants. Avoids typo errors.
 * 
 * Within each section, properties are in no particular order
 * 
 * @author andyc
 */
public interface P3SPropertyNames {

	// Generic Properties
	String Smtp_Host = "smtp_host";
	
	
	
	// Environment-Specific Properties
	String Email_From_Address = "email_from_address";
	String Email_Debug = "email_debug";
	
	//Payment commit properties
	//String Payment_Status_While_Commit = "Initiated";
	int Renewal_Attempts_Constant_In_Payment_Commit = 1;
	int P3sTransRef_Length = 12;
	
	//EPO data
	String Destination_EPO_Office = "EPO";
	String EPO_Payment_Reference = "repl 28051033";
	
	String Payment_Type_SEPA = "SEPA";
	String Payment_Type_SWIFT = "SWIFT";

	//Patent data
	int Patent_Renewal_Max_Year = 20;

}
