package com.bcs.p3s.harness.harnessspecific;

import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.log.BcsLogger;



public class HarnessP3SEnvironmentKnowledge extends BcsLogger {

	
	/**
	 * Provides the folder of the HARNESS BuildInfo property file on this host
	 */
	public String getHarnessBuildinfoFolder()  {
		
		String path = null; 
		String host = Hostname.getHostname();
		
		
		// Logic: If Lenovo or Merin : is under eclipse, else Dell or Pat or TomcatA [or scrape]. 
		if ("CCP020".equals(host)) {
			//path = "C:/utils/git_repos/bcs_p3s_repo/p3s/src/main/resources/";
			path = "C:/utils/apache-tomcat-8.5.6/webapps/p3sharness/WEB-INF/classes/";
			path = null;
		}
		if ("avid-ox790-013".equals(host)) {
			path = "C:/MERIN/Documents/PatentPlace/P3S local repo/bcs_cron_repo/cron/src/main/resources/"; // Expect Wrong
			path = null;
		}
		if ("DESKTOP-H575IU3".equals(host)) {
			path = "C:/xampp/tomcat/webapps/p3sharness/WEB-INF/classes/";
		}
		if ("CCP007".equals(host) ) {
			// C:/utils/apache-tomcat-8.5.20/webapps/p3sweb/WEB-INF/classes/
			//path = "C:/gitrepos/github/project-repo/cron/cron/src/main/resources/";
			//path = "C:/dev64/maven.1520878637375/p3s/src/main/resources/";
			path = "C:/gitrepos/github/project-repo/p3s_harness_v2.1/p2s_harness/src/main/resources/";  
		}
		if ("reviewsystem".equals(host) || "tomcatb".equals(host)) {
			path = "/opt/tomcat8/webapps/p3sharness/WEB-INF/classes/";
		}
		if ("tomcatu".equals(host) || "tomcatv".equals(host)) {
			path = "/var/lib/tomcat8/webapps/p3sharness/WEB-INF/classes/";
		}
		if ("nodea".equals(host) || "nodeb".equals(host)) {
			path = "/opt/tomcat/latest/webapps/p3sharness/WEB-INF/classes/";
		}
		
		if (path==null) {
			logInternalError().warn("HarnessP3SEnvironmentKnowledge getHarnessBuildinfoFolder given unexpected host : "+host);
			path = ""; // Prevent NPE - as this is only from the buildinfo file
		}
		log().debug("HarnessP3SEnvironmentKnowledge getHarnessBuildinfoFolder predicts "+path);
		
		return path;
	};

	
}
