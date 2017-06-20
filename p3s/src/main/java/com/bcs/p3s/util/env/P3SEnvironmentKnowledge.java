package com.bcs.p3s.util.env;

//import com.bcs.p3s.util.os.Hostname;

//import java.util.Map;
//import java.util.HashMap;

/*
 * Provides knowledge of specific hosts that this code may run on
 * 
 * Dependencies:
 *   None
 *   
 */
public class P3SEnvironmentKnowledge {

	public static final String PROPERTYFILENAME = "PatentExpressway.properties";
	public static final String PROPERTYFILEDEFAULTLOCATION = "/utils";
	
	
	public static final String Hostnames[] = {
			  "CCP020"					// Andy's Lenovo 
			, "CCP007"					// Andy's Dell 
			, "avid-ox790-013"			// Merin's PC
			, "patrickwork"				// Patrick's PC
			, "reviewsystem"			// Tomacat-A (on Linode)
			// YET TO INCLUDE: other Linux Hosts? Dev, Test, Demo & Production
	};
		
		
	/**
	 * Environment-Specific (i.e. Host Specific) Properties which must exist for every environment. 
	 */
	public static final String MandatedESProperties[] = {
			  "Dummy1"					// role ...
			// YET TO INCLUDE: Everything     acToDo
	};
		
	/**
	 * Non-Environment-Specific Properties which must exist. 
	 */
	public static final String MandatedGenericProperties[] = {
			  "Universal1"					// role ...
			// YET TO INCLUDE: Everything
	};
		
		
	/**
	 * Location of the main property file on this host
	 * Will end with forwardslash, ready for filename to be prepended
	 */
	public static final String pathToPropertyFile()  {
		String path = PROPERTYFILEDEFAULTLOCATION;

		//String hostname = Hostname.getWinHostname(); 
		//if ("avid-ox790-013".equals(hostname)) path = "/WHATEVER";
		
		if ( ! path.endsWith("/")) path += "/"; 
		return null;
	};
	
	/**
	 * Provides the path of the main property file on this host
	 */
	public static final String getPropertyFilePath()  {
		String path = PROPERTYFILEDEFAULTLOCATION;

		//String hostname = Hostname.getWinHostname(); 
		//if ("avid-ox790-013".equals(hostname)) path = "/WHATEVER";
		
		if ( ! path.endsWith("/")) path += "/"; 
		return path;
	};
	
	
// acTidy  -these were old Moneycorp values. Useful for Scavenging	
//	public static String default_property_fileName = "moneycorp_patent_renewals.properties"; 
//	// deliberately corrupt above, to exercise logging
//
//	// Provide the 'hardcoded' knowledge
//	static final Map<String, String> ENVS = new HashMap<String, String>() {
//		{
//			// Merin's PC
//			put("avid-ox790-013", "/MERIN/Workspace/Latest/MoneyCorp/src/main/resources/META-INF/spring");
//			// Andy's Dell
//			put("CCP007", "/dev64/moneycorp/src/main/resources/META-INF/spring");
//		}
//	};
//
//	/*
//	 * Other known environments (for PatentExpressway?) protected final String
//	 * ABS_PATH_TO_PROPFILE_ON_TBTRIAL =
//	 * "/MERIN/Workspace/Latest/"+"temp"+"/WEB-INF/classes/META-INF/spring"; //
//	 * for tbTrial protected final String ABS_PATH_TO_PROPFILE_ON_APPSERV01 =
//	 * "/var/www/tomcatbase/patentexpressway_prod/webapps/PE/WEB-INF/classes/META-INF/spring"
//	 * ; protected final String ABS_PATH_TO_PROPFILE_ON_PETEST =
//	 * "/var/www/tomcatbase/patentexpressway_test/webapps/PEtest/WEB-INF/classes/META-INF/spring"
//	 * ; protected final String ABS_PATH_TO_PROPFILE_ON_PEDEMO =
//	 * "/var/www/tomcatbase/patentexpressway_demo/webapps/PEdemo/WEB-INF/classes/META-INF/spring"
//	 * ; protected final String ABS_PATH_TO_PROPFILE_ON_RACKSPACE_DEFAULT =
//	 * "/var/www/tomcatbase/patentexpressway_prod/webapps/PE/WEB-INF/classes/META-INF/spring"
//	 * ; // Andy's Lenovo //put("CCP019",
//	 * "/workspace2/PatentExpressway March 2015/src/main/resources/META-INF/spring"
//	 * );
//	 */

}
