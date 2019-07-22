package com.bcs.p3s.util.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import com.bcs.p3s.util.lang.Universal;


/**
 * Simple Property-File reader
 * 
 * Dependencies:
 *   Logging (via Universal) & Universal
 *   
 * @author andyc
 */
public class PropertyReader extends Universal {

	protected Properties safeProperties = null;  // either null or reliable
	

	
	private PropertyReader () { ; /* Inhibit Default constructor */ } 

	/**
	 * Instantiate & Attempt to open specified property file
	 * @param path Optional path. Preferably without trailing forwardslash. 
	 * Note: Forwardslashes, NOT backslashes. Even on windows.
	 * @param filename of property file to read
	 * @throws IOException 
	 */
	public PropertyReader(String path, String filename) throws IOException {
		readProperties(path, filename);
	}

	
	/**
	 * Attempts to open specified property file. Stores properties to safeProperties member. 
	 * @param path Optional path. Preferably without trailing forwardslash. Note: Forwardslashes, NOT backslashes. Even on windows.
	 * @param filename of property file to read
	 * @return null indicates problem reading file
	 * @throws IOException 
	 */
	protected Properties readProperties(String path, String filename) throws IOException {
		if (notEmpty(path)) path+="/"; else path = "";
		if (filename==null) return null;

		safeProperties = null;
		Properties prop = new Properties();
		InputStream input = null;
		try {
			input = new FileInputStream(path+filename);
			prop.load(input);
			safeProperties = prop;
	 
		} catch (IOException io) {
			logInternalError().fatal("Failed read Propfile at "+path+" : "+filename, io);
			throw io;
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					;
				}
			}
		}
		return safeProperties;
	  }

	
	 
// actmp - Imminent Dev? - This below method was to replace (augment?) the above method
// THIS method would find the property file in the CLASSPATH, rather than needing an explicit location
//	/**
//	 * An alternative to the above readProperties(String path, String filename)
//	 * This attempts to find the named prorerty file in the classpath 
//	 * @param filename
//	 * @return Properties
//	 * @throws IOException
//	 */
//	protected Properties readProperties(String filename) throws IOException {
//		if (filename==null) return null;
//
//		safeProperties = null;
//		Properties prop = new Properties();
//		InputStream input = null;
//
//		try {
//    		//input = App3.class.getClassLoader().getResourceAsStream(filename);
//			
//    		input = getClass().getClassLoader().getResourceAsStream(filename);
//    		if(input==null){
//    	            System.out.println(" TODO    Sorry, unable to find " + filename);
//    		    return null;
//    		}
//			
//			
//			//input = new FileInputStream(path+filename);
//			prop.load(input);
//			safeProperties = prop;
//	 
//		} catch (IOException io) {
//			logInternalError().fatal("Failed read Propfile at "+path+" : "+filename, io);
//			throw io;
//		} finally {
//			if (input != null) {
//				try {
//					input.close();
//				} catch (IOException e) {
//					;
//				}
//			}
//		}
//		return safeProperties;
//	  }
	
	

	/**
	 * Read a named property from the currently loaded Properties  
	 * @param propertyname
	 * @return The property value for key = propertyname
	 */
	public String getProperty(String propertyname) {
		if (safeProperties==null || isEmpty(propertyname)) {
			log().warn("PropertyReader:getProperty Invoked with null"); // Nice if could log stacktrace
			return null;
		}
		return safeProperties.getProperty(propertyname);
	}

	
	protected Properties getAllProperties() {
		return safeProperties;
	}

}
