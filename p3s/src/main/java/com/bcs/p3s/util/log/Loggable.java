package com.bcs.p3s.util.log;

import org.apache.log4j.Logger;

/**
 * Indicates that a class CAN perform logging.
 * Implementation of that logging is provided elsewhere
 **/
public interface Loggable {

	/*
	 * Variable name is chosen to be appropriate for the application code
	 * The value is what turns up in the logfile, in the %c field (so keep it short)
	 */

	public final String STANDARD 		= "STANDARD";
	public final String MALICIOUS  		= "MALICIOUS";
	public final String INTERNAL_ERROR 	= "INTERNAL_ERROR";

	public final String CHANGE_OF_STATUS = "CHANGE_OF_STATUS";	// For logging change-of-status of either a patent or a transaction

}
