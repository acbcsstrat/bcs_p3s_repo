package com.bcs.p3s.cron.cronspecific;

import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;

public class CronP3SEnvironmentKnowledge extends P3SEnvironmentKnowledge {

	//	This class needs to override. with appropriate values: (from P3SPropertyReader:69)
	//	String path = envKnowledge.getMainPropertyFilePath(); 
	//	String filename = envKnowledge.P3S_PROPERTYFILE_FILENAME;


	public CronP3SEnvironmentKnowledge() {
		// P3SEnvironmentKnowledge has no constructor. So all we need here is
		this.P3S_PROPERTYFILE_FILENAME = "cron.properties";
	}
	
	/**
	 * Provides the path of the (Alien) main properties file folder on this host
	 */
	public String getMainPropertyFilePath()  {
		String path = null; // "C:/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/";  // UNUSED Default PC tomcat
		String host = Hostname.getHostname();
		
		
		// Logic: If Lenovo or Merin : is under eclipse, else Dell or Pat or TomcatA [or scrape]. 
		if ("CCP020".equals(host)) {
			//path = "C:/utils/git_repos/bcs_p3s_repo/p3s/src/main/resources/";
			path = "C:/utils/apache-tomcat-8.5.6/webapps/p3scron/WEB-INF/classes/";
		}
		if ("avid-ox790-013".equals(host)) {
			path = "C:/MERIN/Documents/PatentPlace/P3S local repo/bcs_cron_repo/cron/src/main/resources/"; // Expect Wrong
		}
		if ("DESKTOP-H575IU3".equals(host)) {
			path = "C:/xampp/tomcat/webapps/p3scron/WEB-INF/classes/";
		}
		if ("AVID-3590-026".equals(host)) { // Pat's new Laptop - ip is .87 on 6/3/2019
			// TBV - path below yet to be Verified
			path = "C:/xampp/tomcat/webapps/p3scron/WEB-INF/classes/";
		}
		if ("reviewsystem".equals(host)) {
			path = "/opt/tomcat8/webapps/p3scron/WEB-INF/classes/";
		}
		

		if ("CCP007".equals(host) ) {
			// C:/utils/apache-tomcat-8.5.20/webapps/p3sweb/WEB-INF/classes/
			path = "C:/gitrepos/github/project-repo/cron/cron/src/main/resources/";
		}

		if (path==null) {
			logInternalError().warn("CronP3SEnvironmentKnowledge getMainPropertyFilePath given unexpected host : "+host);
		}
		log().debug("CronP3SEnvironmentKnowledge getMainPropertyFilePath predicts "+path);
		
		return path;
	};

}
