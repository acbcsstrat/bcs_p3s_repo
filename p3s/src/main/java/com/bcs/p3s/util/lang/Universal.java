package com.bcs.p3s.util.lang;



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
	
}
