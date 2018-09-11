package com.bcs.p3s.util.env;

import com.bcs.p3s.harness.harnessspecific.HarnessP3SEnvironmentKnowledge;
import com.bcs.p3s.util.lang.Universal;

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
public class P3SEnvironmentKnowledge extends Universal {

	public static final String DATABASECONFIGFILENAME = "database.properties";
	public static final String BUILDINFO_FILENAME = "buildinfo.properties";
	public              String P3S_PROPERTYFILE_FILENAME = "p3s.properties";

//	public static final String PROPERTYFILENAME = "PatentExpressway.properties";
//	public static final String PROPERTYFILEDEFAULTLOCATION = "/utils";
	
	
	public static final String Hostnames[] = {
			  "CCP020"					// Andy's Lenovo 
			, "CCP007"					// Andy's Dell 
			, "avid-ox790-013"			// Merin's PC
			// Pat's WAS "patrickwork" - now seems DESKTOP-H575IU3
			, "DESKTOP-H575IU3"			// Patrick's PC
			, "reviewsystem"			// Tomacat-A (on Linode)
			// YET TO INCLUDE: other Linux Hosts? Dev, Test, Demo & Production
			, "tomcatb"					// Tomacat-B (on Linode). Clone of TomcatA, with postfix Nov17
	};
		

	
	/**
	 * Provides the filespec of the database property file on this host
	 */
	public final String getDatabaseConfigFilespec()  {
		String defaultpath = "C:/utils/apache-tomcat-8.5.20/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";  // Deafult PC tomcat
		String path = null;
		String host = Hostname.getHostname();
		
		
		// Logic: If Lenovo or Merin : is under eclipse, else Dell or Pat or TomcatA [or scrape]. 
		if ("CCP020".equals(host)) {
			// path = "C:/utils/git_repos/bcs_p3s_repo/p3s/src/main/resources/META-INF/spring/"; 		// OBS: If running from eclipse. Oct17update - this is now Obsolete
			// path = "C:/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";	// If running from war 
			path = "C:/gitrepos/github/project-repo/p3s/src/main/resources/META-INF/spring/";    		// If running from eclipse
			// trying to commit this fix !
		}
		if ("avid-ox790-013".equals(host)) {
			path = "C:/MERIN/Documents/PatentPlace/P3S local repo/bcs_p3s_repo_final_final/p3s/src/main/resources/META-INF/spring/";
		}
		if ("DESKTOP-H575IU3".equals(host)) {
			// Original: path = "C:/xampp/tomcat/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";
			path = "C:/utils/apache-tomcat-8.5.14/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";
		}
		if ("reviewsystem".equals(host) || "tomcatb".equals(host)) {
			path = "/opt/tomcat8/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";
		}
		if ("CCP007".equals(host)) {
			// path = defaultpath; // now redundant, but shows purpose of defaultpath 
			// path = "C:/utils/apache-tomcat-8.5.20/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";	// If running from war 	
			//path = "C:/gitrepos/github/project-repo/working-branch/p3s/src/main/resources/META-INF/spring/"; // If running from eclipse
			path = "C:/dev64/maven.1520878637375/p2s_harness/src/main/resources/META-INF/spring/";  
		}
		if ("tomcatu".equals(host) || "tomcatv".equals(host)) {
			path = "/var/lib/tomcat8/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";
		}
		if ("nodea".equals(host) || "nodeb".equals(host)) {
			path = "/opt/tomcat/latest/webapps/p3sweb/WEB-INF/classes/META-INF/spring/";
		}
		
		if (path==null) {
			logInternalError().warn("P3SEnvironmentKnowledge getDatabaseConfigFilespec given unexpected host : "+host);
		}
		log().debug("P3SEnvironmentKnowledge getDatabaseConfigFilespec predicts that db conf file is in "+path);
		
		return appendFilenameToPath(path, DATABASECONFIGFILENAME);
	};
	
	

	/**
	 * Provides the filespec of the BuildInfo property file on this host
	 */
	public final String getBuildinfoFilespec()  {
		//	String filespec = appendFilenameToPath(getMainPropertyFilePath(), BUILDINFO_FILENAME);
		//	log().debug("P3SEnvironmentKnowledge getBuildinfoFilespec predicts that buildinfo file is at "+filespec);

		HarnessP3SEnvironmentKnowledge knowHarness = new HarnessP3SEnvironmentKnowledge();
		String folder = knowHarness.getHarnessBuildinfoFolder();
		String filespec = appendFilenameToPath(folder, BUILDINFO_FILENAME);
		log().debug("P3SEnvironmentKnowledge getBuildinfoFilespec predicts that buildinfo file is at "+filespec);
		
		return filespec ;
	};
	
	

	/**
	 * Provides the filespec of the main P3S property file on this host
	 */
//	public final String OBS_getP3SPropertyFileFilespec()  {
//		// for now, & likely always, this is the same as getBuildinfoFilespec() 
//		String filespec = appendFilenameToPath(getMainPropertyFilePath(), P3S_PROPERTYFILE_FILENAME);
//		log().debug("P3SEnvironmentKnowledge getP3SPropertyFileFilespec predicts that p3s property file is at "+filespec);
//		return filespec ;
//	};
	
	

	/**
	 * Provides the path of the main properties file folder on this host
	 */
	public String getMainPropertyFilePath()  {
		String path = null; // "C:/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/";  // UNUSED Default PC tomcat
		String host = Hostname.getHostname();
		
		
		// Logic: If Lenovo or Merin : is under eclipse, else Dell or Pat or TomcatA [or scrape]. 
		if ("CCP020".equals(host)) {
			//path = "C:/utils/git_repos/bcs_p3s_repo/p3s/src/main/resources/";
			path = "C:/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/";
		}
		if ("avid-ox790-013".equals(host)) {
			path = "C:/MERIN/Documents/PatentPlace/P3S local repo/bcs_p3s_repo_final_final/p3s/src/main/resources/";
		}
		if ("DESKTOP-H575IU3".equals(host)) {
			//path = "C:/xampp/tomcat/webapps/p3sweb/WEB-INF/classes/";
			path = "C:/utils/apache-tomcat-8.5.14/webapps/p3sweb/WEB-INF/classes/";
		}
		if ("reviewsystem".equals(host) || "tomcatb".equals(host)) {
			path = "/opt/tomcat8/webapps/p3sweb/WEB-INF/classes/";
		}
		if ("tomcatu".equals(host) || "tomcatv".equals(host)) {
			path = "/var/lib/tomcat8/webapps/p3sweb/WEB-INF/classes/";
		}
		if ("CCP007".equals(host) ) {
			// C:/utils/apache-tomcat-8.5.20/webapps/p3sweb/WEB-INF/classes/
			//path = "C:/gitrepos/github/project-repo/working-branch/p3s/src/main/resources/";
			path = "C:/dev64/maven.1520878637375/p2s_harness/src/main/resources/";
		}
		if ("nodea".equals(host) || "nodeb".equals(host)) {
			path = "/opt/tomcat/latest/webapps/p3sweb/WEB-INF/classes/";
		}

		if (path==null) {
			logInternalError().warn("P3SEnvironmentKnowledge getMainPropertyFilePath given unexpected host : "+host);
		}
		log().debug("P3SEnvironmentKnowledge getMainPropertyFilePath predicts "+path);
		
		return path;
	};
	
	
	/**
	 * Provides the path to BCD scripts
	 */
	public static String getScriptsFilePath()  {
		String path = "/root/scripts/";
		String host = Hostname.getHostname();
		if (host!=null && host.startsWith("tomcat")) {
			path = "/var/bcd/scripts/";
		}
		return path;
	};
	
	
	/**
	 * Indicates if P3Sweb is running on a developer PC or not. 
	 */
	public static boolean isDeveloperPC() {
		String host = Hostname.getHostname();
		if ( ("CCP020".equals(host)) || ("avid-ox790-013".equals(host))
		|| ("DESKTOP-H575IU3".equals(host)) || ("CCP007".equals(host)) ) {
			return true;
		}
		else return false;
	}
	
	
	
	
	
	
	
	/**
	 * Environment-Specific (i.e. Host Specific) Properties which must exist for every environment. 
	 */
//	public static final String MandatedESProperties[] = {
//			  "Dummy1"					// role ...
//			// YET TO INCLUDE: Everything     acToDo
//	};
		
	/**
	 * Non-Environment-Specific Properties which must exist. 
	 */
//	public static final String MandatedGenericProperties[] = {
//			  "Universal1"					// role ...
//			// YET TO INCLUDE: Everything
//	};
		
		
	/**
	 * Location of the main property file on this host
	 * Will end with forwardslash, ready for filename to be prepended
	 */
//	public static final String pathToPropertyFile()  {  // acTidy
//		String path = PROPERTYFILEDEFAULTLOCATION;
//
//		//String hostname = Hostname.getWinHostname(); 
//		//if ("avid-ox790-013".equals(hostname)) path = "/WHATEVER";
//		
//		if ( ! path.endsWith("/")) path += "/"; 
//		return null;
//	};
	
	/**
	 * Provides the path of the main property file on this host
	 */
//	public static final String getPropertyFilePath()  { // acTidy
//		String path = PROPERTYFILEDEFAULTLOCATION;
//
//		//String hostname = Hostname.getWinHostname(); 
//		//if ("avid-ox790-013".equals(hostname)) path = "/WHATEVER";
//		
//		if ( ! path.endsWith("/")) path += "/"; 
//		return path;
//	};
	
	

	
	public String appendFilenameToPath(String path, String filename) {
		final String SEPARATOR = "/";
		String composite = path;
		if (isEmpty(path)) {
			composite = "";
		} else {
			if ( ! path.endsWith(SEPARATOR))
			composite += SEPARATOR;
		}
		return composite+filename;
	}
	
}
