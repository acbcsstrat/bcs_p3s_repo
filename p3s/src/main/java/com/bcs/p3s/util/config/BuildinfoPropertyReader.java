package com.bcs.p3s.util.config;

import java.io.IOException;
import java.util.Properties;

import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;
import com.bcs.p3s.util.env.Hostname;



// acTidy
// much (all) of this should be subsumed into p3sweb/WEB-INF/classes/buildinfo.properties

// + deal with the late bolt-on - which db being used




/**
 * The Property Reader specifically for reading the buildinfo.properties file, 
 * which contains the build date/timestamp
 */
public class BuildinfoPropertyReader extends Universal {

	//protected  final String BUILDINFO_LOCATION = "WEB-INF/classes";  
	// fails
	
//	protected  final String BUILDINFO_LOCATION = "/utils/git_repos/bcs_p3s_repo/p3s/src/main/webapp/WEB-INF/classes";
	// ok
	
//	protected  final String BUILDINFO_FILENAME = "buildinfo.properties";
	
	protected  final String BUILDINFO_KEY = "build.date";
	protected  final String DB_URL = "database.url";

	protected  final String FAIL_MESSAGE = "Not Available";
	

	
	
	protected PropertyReader propertyreader = null;
	protected Properties properties = null;

	
	
	public String getBuildTimestamp() {
		String timestamp = null;
		
		//String filespec = "/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/buildinfo.properties"; // for CCP007
		P3SEnvironmentKnowledge envK = new P3SEnvironmentKnowledge();
		String filespec = envK.getBuildinfoFilespec();

		
		try {
			timestamp = getBuildInfo(filespec).getProperty(BUILDINFO_KEY);
		} 
		catch (IOException ioe) {
			logInternalError().warn("getBuildTimestamp: Unable to read properties from "+filespec);
			ioe.printStackTrace();
			timestamp = FAIL_MESSAGE; 
		}
		return timestamp;
	}

// acTidy - former tmp whilst discover paths	
	public Properties getBuildInfo(String filespec) throws IOException {
		propertyreader = new PropertyReader("", filespec);
		properties = propertyreader.getAllProperties();
		return properties;
	}
//	public Properties getBuildInfo() throws IOException {
//		propertyreader = new PropertyReader(BUILDINFO_LOCATION, BUILDINFO_FILENAME);
//		properties = propertyreader.getAllProperties();
//		return properties;
//	}


	
	
	public String whichDB() {
		String dbname = FAIL_MESSAGE;
		String fullDbStr = "";

		//String filespec = "/utils/apache-tomcat-8.5.6/webapps/p3sweb/WEB-INF/classes/META-INF/spring/database.properties"; // for CCP007
		P3SEnvironmentKnowledge envK = new P3SEnvironmentKnowledge();
		String filespec = envK.getDatabaseConfigFilespec();
		
		try {
			fullDbStr = getBuildInfo(filespec).getProperty(DB_URL);
			//	database.url=jdbc:mysql://cc-scrape:3306/p3s
			if (fullDbStr!=null) {
				int hh = fullDbStr.lastIndexOf('/');
				dbname = fullDbStr.substring(hh+1);
				
				int ii = fullDbStr.indexOf('/');
				int jj = fullDbStr.indexOf(":33");
				String append = " on " + fullDbStr.substring(ii+2, jj);
				dbname += append;
				System.out.println("created dbname = "+dbname);
			}
		} 
		catch (IOException ioe) {
			logInternalError().warn("whichDB: Unable to read properties from "+filespec);
			ioe.printStackTrace();
		}
		return dbname;
	}
	
	
	
	
}
