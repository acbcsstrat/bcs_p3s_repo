package com.bcs.p3s.engine;

/**
 * 'Stage' is a useful concept, introduced in v2.1, although it is not strictly needed.
 * Current stage is determined by the patent status value provided by the EPO
 * 
 * Values and meaning are: (only first two are used as of v2.1)
 *   Filing					Not yet E-PCT, so may be able to sell a Form1200
 *   Prosecution			E-PCT in place. May be able to sell a renewal
 *   Intention to Grant
 *   Granted
 */
public class StageManager {

    public static final String FILING					= "Filing"; 
    public static final String PROSECUTION				= "Prosecution";

    protected static final String number17 = "The international publication has been made";
    
    
    public static String determineStage(String epoStatus) {
    	if (epoStatus==null) return epoStatus; 
    	if (number17.equalsIgnoreCase(epoStatus.trim())) 
    			return FILING;
    	else 
    			return PROSECUTION;
    }
 
    
    
    public static boolean isInFiling(String epoStatus) {
    	return (FILING.equals(determineStage(epoStatus)));
    }
    public static boolean isInProsecution(String epoStatus) {
    	return (PROSECUTION.equals(determineStage(epoStatus)));
    }
    
}
