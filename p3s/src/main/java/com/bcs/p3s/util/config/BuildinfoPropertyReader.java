package com.bcs.p3s.util.config;

import java.io.IOException;
import java.util.Properties;

import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;






/**
 * The Property Reader specifically for reading the buildinfo.properties file, 
 * which contains the build date/timestamp
 */
public class BuildinfoPropertyReader extends Universal {

	//protected  final String BUILDINFO_LOCATION = "WEB-INF/classes";  
	// fails
	
	protected  final String BUILDINFO_LOCATION = "/utils/git_repos/bcs_p3s_repo/p3s/src/main/webapp/WEB-INF/classes";
	// ok
	
	
	
	protected  final String BUILDINFO_FILENAME = "buildinfo.properties";
	protected  final String BUILDINFO_KEY = "build.date";
	protected  final String FAIL_MESSAGE = "Not Available";
	
	
	protected PropertyReader propertyreader = null;
	protected Properties properties = null;

	public String getBuildTimestamp() {
		String timestamp = null;
		try {
			timestamp = getBuildInfo().getProperty(BUILDINFO_KEY);
		} 
		catch (IOException ioe) {
			logInternalError().warn("Unable to read properties from "+BUILDINFO_FILENAME);
			ioe.printStackTrace();
			timestamp = FAIL_MESSAGE; 
		}
		return timestamp;
	}

	
	public Properties getBuildInfo() throws IOException {
		propertyreader = new PropertyReader(BUILDINFO_LOCATION, BUILDINFO_FILENAME);
		properties = propertyreader.getAllProperties();
		return properties;
	}

	
}
