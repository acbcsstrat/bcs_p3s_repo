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
	public static final String P3S_support_email_address = "p3s_support_email_address"; 
	
	
	
	// Environment-Specific Properties
	
	// Email SENDing
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
	

	// SFTP 
	public static final String WHICH_FX_SFTP_SITE = "fx_provider";
	public static final String MC_FX_SFTP_SITE_URL = "mc_fx_url";
	public static final String MC_FX_SFTP_SITE_USERNAME = "mc_fx_un";
	public static final String MC_FX_SFTP_SITE_SECURE_FINGERPRINT = "mc_fx_key";
	public static final String BCS_FX_SFTP_SITE_URL = "bcs_fx_url";
	public static final String BCS_FX_SFTP_SITE_USERNAME = "bcs_fx_un";
	public static final String BCS_FX_SFTP_SITE_SECURE_FINGERPRINT = "bcs_fx_key";


	// host web URL + support
	public static final String P3S_WEB_URL_BASE = "p3s_web_url_base"; 
	
	// Document storage (terminate with forwardslash)
	public static final String INVOICE_DOCUMENT_PATH = "invoice_doc_path";
	public static final String CERTIFICATE_DOCUMENT_PATH = "certificate_doc_path";

	
	
}
