package com.bcs.p3s.util.config;

import java.io.IOException;
import java.util.Properties;

import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.Universal;




/**
 * Environment-specific PropertyReader. Intended Not-project-specific.
 * Every property file item is preceded by either GENERIC_ or {hostname}_
 * Hence the property file can (& should) hold properties for Every host the app runs on.
 * 
 * Dependencies:
 *   Hostname, PropertyReader, Logging (via Universal) & Universal
 *   
 * @author andyc
 */
public class EnvironmentSpecificProperties extends Universal {

	protected PropertyReader propertyreader = null;
	protected Properties properties = null;
	protected String host = Hostname.getHostname();
	protected final String SEPARATOR = "_";
	protected final String GENERIC = "GENERIC"+SEPARATOR;

	
	
	/**
	 * Instantiate & Attempt to open specified property file
	 * @param path Optional path. Preferably without trailing forwardslash. Note: Forwardslashes, NOT backslashes. Even on windows.
	 * @param filename of property file to read
	 * @throws IOException 
	 */
	public EnvironmentSpecificProperties(String propPath, String filename) throws IOException {

		//actmp
		propertyreader = new PropertyReader(propPath, filename);
		properties = propertyreader.getAllProperties(); 
		if (isEmpty(host) || propertyreader==null || properties==null) {
			log().error("EnvironmentSpecificProperties Constructor failed !");
		}
	}
	private EnvironmentSpecificProperties() {} // Inhibit default constructor

	

	/**
	 * Read a named NON-Environment-specific property from the currently loaded Properties  
	 * @param propertyname WITHOUT the prefix
	 * @return The property value for key = GENERIC_propertyname
	 */
	public String getGenericProperty(String propertyname) {
		if (properties==null || isEmpty(propertyname)) {
			log().warn("EnvironmentSpecificProperties:getGenericProperty failed:"+propertyname);
			return null;
		}
		return properties.getProperty(GENERIC+propertyname);
	}

	/**
	 * Read a named Environment-specific property from the currently loaded Properties  
	 * @param propertyname WITHOUT the prefix
	 * @return The property value for key = {Hostname}_propertyname
	 */
	public String getESProperty(String propertyname) {
		if (properties==null || isEmpty(propertyname) || isEmpty(host)) {
			log().warn("EnvironmentSpecificProperties:getESProperty failed:"+propertyname);
			return null;
		}
		String key = host+SEPARATOR+propertyname;
		return properties.getProperty(key);
	}
	
	public Properties getAllProperties() {
		return properties;
	}

}
