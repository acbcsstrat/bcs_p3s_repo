package com.bcs.p3s.util.config;

import java.io.IOException;

import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;


	/**
	 * The Property Reader specific to the P3S application.
	 * It has knowledge of what properties to expect, what environment to expect
	 * and can test for missing properties
	 * 
	 * Dependencies:
	 *   EnvironmentSpecificProperties, P3SenvironmentKnowledge & Universal
	 *   
	 * @author andyc
	 *
	 *
	 * <b>Discussion re throwing exception when reading property files.</b>
	 *  If opening the property file fails, then the application cannot function. We're dead.
	 *  Consequently, as long as this occurrence is detected by the application and logged at least once, 
	 *  then it is acceptable for all subsequent accesses to not be inconvenienced by exceptions.
	 *  
	 *  Hence, the main constructor will throw an exception if a problem is encountered.
	 *  An alternative constructor is provided that swallows any such exceptions. This can be 
	 *  used as a convenience feature. However, it's likely to subsequently cause NPEs. But then, 
	 *  as stated, we're dead anyway.
	 *  
	 *  As for 'logged at least once' - this is done automatically by PropertyReader, which logs 
	 *  any such exception, then rethrows it.
	 *  
	 *  
	 *  So what alternative constructor? Cannot change its method name. So overload. 
	 *  Add a parameter which is ignored.
	 *  
	 *  SEPARATE ISSUE: If properties is working, but a specific property is requested, 
	 *  but is missing, then that can, and should, throw an exception. Hence it is NOT appropriate  
	 *  to provide convenience methods which ignore such exceptions.
	 *  
	 *  However, as an aide, a different exception (P3SPropertyException) is created for this scenario.
	 */
	public class P3SPropertyReader extends Universal {

		protected EnvironmentSpecificProperties esp = null;
		
		/**
		 * Instantiate & Attempt to open & read the main P3S property file
		 * @throws IOException 
		 */
		public P3SPropertyReader() throws IOException {
			doConstructorStuff();
		}
		
		/**
		 * As mentioned in Discussion above, this convenience constructor (which takes a parameter, which is ignored)
		 * does the same as the normal constructor, but swallows any exception thrown 
		 * 
		 * @param ignored
		 */
		public P3SPropertyReader(int ignored) {
			try {
				doConstructorStuff();
			}
			catch (IOException ioe) { /* swallow */ }
		}
		private void doConstructorStuff() throws IOException {
			P3SEnvironmentKnowledge envKnowledge = new P3SEnvironmentKnowledge();
			String path = envKnowledge.getMainPropertyFilePath(); 
			String filename = P3SEnvironmentKnowledge.P3S_PROPERTYFILE_FILENAME;
			esp = new EnvironmentSpecificProperties(path, filename);
		}
	
		
		
		/**
		 * Clients can rely on esp being populated, as they'll have already suffered an exception if it isn't
		 * @return the EnvironmentSpecificProperties instance. Will NOT be null if no prior exception instantiating this class
		 */
		public EnvironmentSpecificProperties getEsp() { 
			if (esp==null) logInternalError().fatal("P3SPropertyReader:getEsp is null. Expect NPE.");
			return esp; 
		}
	
		/**
		 * Read a named NON-Environment-specific property from the currently loaded Properties  
		 * @param propertyname WITHOUT the prefix
		 * @return The property value for key = GENERIC_propertyname
		 * @throws P3SPropertyException
		 * @throws NPE if we are dead anyway (see discussion in class javadoc). Otherwise NPE-safe 
		 */
		public String getGenericProperty(String propertyname) throws P3SPropertyException {
			String val = getEsp().getGenericProperty(propertyname); 
			if (val==null) throw new P3SPropertyException("Generic Property called "+propertyname+" NOT FOUND");
			return val;
		}
		
		/**
		 * Read a named Environment-specific property from the currently loaded Properties  
		 * @param propertyname WITHOUT the prefix
		 * @return The property value for key = {Hostname}_propertyname
		 * @throws NPE if we are dead anyway (see discussion in class javadoc). Otherwise NPE-safe 
		 */
		public String getESProperty(String propertyname) throws P3SPropertyException {
			String val = getEsp().getESProperty(propertyname); 
			if (val==null) throw new P3SPropertyException("ES Property called "+propertyname+" NOT FOUND");
			return val;
		}
	
		/**
		 * as per getGenericProperty, but does not throw exception, and log, if the property is missing
		 */
		public String getOptionalGenericProperty(String propertyname) {
			return getEsp().getGenericProperty(propertyname);
		}
	
		/**
		 * as per getESProperty, but does not throw exception, and log, if the property is missing
		 */
		public String getOptionalESProperty(String propertyname) {
			return getEsp().getESProperty(propertyname);
		}
	
	
	
	
//		/**
//		 * For This environment, checks that all mandated EnvironmentSpecific property values are populated.
//		 * 
//		 * Logs as Fatal if any missing.
//		 * 
//		 * @return true is OK
//		 */
//		public boolean isNeededESPropertiesPresent() {
//			boolean isSafe = false;
//			String missing = "";
//			String thisOne = null;
//			for (String esprop : P3SEnvironmentKnowledge.MandatedESProperties) {
//				thisOne = esp.getESProperty(esprop);
//				System.out.println("isNeededESPropertiesPresent checking "+esprop);
//				if (isEmpty(thisOne)) missing += (esprop+"  ");
//			}
//			if (notEmpty(missing)) {
//				log().fatal("PEPropertyReader:isNeededESPropertiesPresent Detected MISSING: "+missing);
//			} else isSafe = true;
//			return isSafe;
//		}
//		public boolean isNeededGenericPropertiesPresent() {
//			boolean isSafe = false;
//			String missing = "";
//			String thisOne = null;
//			for (String esprop : P3SEnvironmentKnowledge.MandatedGenericProperties) {
//				thisOne = esp.getGenericProperty(esprop);
//				System.out.println("isNeededGenericPropertiesPresent checking "+esprop);
//				if (isEmpty(thisOne)) missing += (esprop+"  ");
//			}
//			if (notEmpty(missing)) {
//				log().fatal("PEPropertyReader:isNeededGenericPropertiesPresent Detected MISSING: "+missing);
//			} else isSafe = true;
//			return isSafe;
//		}
//		public boolean isAllNeededPropertiesPresent() {
//			boolean esok = isNeededESPropertiesPresent();
//			boolean gok = isNeededGenericPropertiesPresent();
//			return esok & gok;
//		}
	

	}
