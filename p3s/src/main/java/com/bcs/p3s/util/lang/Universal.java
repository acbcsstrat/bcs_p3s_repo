package com.bcs.p3s.util.lang;



import java.io.PrintWriter;
import java.io.StringWriter;

import com.bcs.p3s.enump3s.P3SEnumException;
import com.bcs.p3s.util.log.BcsLogger;
import com.bcs.p3s.util.log.Loggable;

/**
 * Many (all?) classes will extend this. Provides:
 * - easy-to-use logging capability
 * - DIY java language extension
 *  
 *  Dependencies:
 *   Logging 
 *   
 **/
public class Universal extends BcsLogger implements Loggable {

	
	public boolean isEmpty(String val) {
		if (val==null || val.trim().length()==0) return true;
		return false;
	}
	public boolean notEmpty(String val) {
		return ! isEmpty(val);
	}

    public void fail(String message) {
    	logInternalError().fatal(message);
    	throw new P3SRuntimeException(message);
    }

    
    public void logErrorAndContinue(String message) {
    	logInternalError().error(message);
    	throw new P3SRuntimeException(message);
    }
    public void logErrorAndContinue(String message, Exception e) {
    	logInternalError().error(message+" : "+e.getMessage()+"  eType: "+e.getClass().getName());
    	// Capture & log the error stackdump
		String dump = "stackDumP:" + "\n";
		if (e!=null) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			dump += errors.toString();
		}
    	logInternalError().error(dump);
    }
    
    
    public void logAttention(String msg) {
    	log().fatal("                                                               ");
    	log().fatal("                                                               ");
    	log().fatal("  ***************************************************************************");
    	log().fatal("  ***************************************************************************");
    	log().fatal("  ****  "+msg+"  ****");
    	log().fatal("  ***************************************************************************");
    	log().fatal("  ***************************************************************************");
    	log().fatal("                                                               ");
    	log().fatal("                                                               ");
    }

    // Temporary - for Development:
    public void notYet(String msg) {
    	String message = "    *************  NOT YET IMPLEMENTED - So this will not work  ************* ";
    	if (notEmpty(msg)) message += msg;
    	log().fatal(message);
    }
    public void notYet() {
    	notYet("Default");
    }
    
}
