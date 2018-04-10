package com.bcs.p3s.service;

import java.io.IOException;

import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;
import com.bcs.p3s.util.lang.Universal;

/**
 * Simple service to issue O/S commands (windows or linux)
 * Purely issue. Nor capture of response.
 * @author andyc
 */
public class OSCommandService extends Universal {

	protected String PREFIX = this.getClass().getName() + " : "; 

	boolean isLinux = true;
	String dosRootCmd = null;
	

	protected final String SUDO = "sudo ";
	protected final String CMD_ROOT = "/usr/bin/java -jar /opt/p3scron/p3scron.jar ";
	protected final String ACTION_WRITE_MC = "writeOrder";
	protected final String ACTION_READ_MC = "readMcTxnStatus";
	protected final String ACTION_READ_EPO = "readEpoStatus";
	protected final String ACTION_FOLLOWON = "epoInstructedFollowon";
	// readMcTxnStatus / mcReadAndWrite / readMcRate / epoInstructedFollowon / readEpoStatus

	
	public OSCommandService() {
		if (P3SEnvironmentKnowledge.isDeveloperPC()) {
			isLinux = false;
			
			// so read cmd from property file
			// Retrieve data from property file
			try {
				P3SPropertyReader reader = new P3SPropertyReader();
				dosRootCmd = reader.getESProperty(P3SPropertyNames.HARNESS_DOS_CMD_ROOT); 
			} catch (P3SPropertyException e) {
				fail("OSCommandService constructor() property read of dosRootCmd failed",e);
			}
			System.out.println("OSCommandService has determined dosRootCmd  ="+dosRootCmd);
		}
		// System.out.println("OSCommandService has determined isLinux  ="+isLinux);
	}

	
	public void WriteToMC() throws IOException {
		String fullCmd = buildFullCommand(ACTION_WRITE_MC);
		issueCommand(fullCmd);
	}
	public void ReadFromMC() throws IOException {
		String fullCmd = buildFullCommand(ACTION_READ_MC);
		issueCommand(fullCmd);
	}
	public void ReadFromEPO() throws IOException {
		String fullCmd = buildFullCommand(ACTION_READ_EPO);
		issueCommand(fullCmd);
	}
	public void Followon() throws IOException {
		String fullCmd = buildFullCommand(ACTION_FOLLOWON);
		issueCommand(fullCmd);
	}
	
	
	
	
	
	
	protected String buildFullCommand(String type) {
		String err = PREFIX + "buildFullCommand("+type+")";
		String fullCommand = null;

		//if ( ! isLinux) {
		//		log().debug("buildFullCommand invoked with "+type+".  BUT isLinux = "+isLinux+" so ABORTING");
		//		return null;
		//}
		
		if (ACTION_WRITE_MC.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			if (isLinux) fullCommand = SUDO + CMD_ROOT + ACTION_WRITE_MC;
			else fullCommand = dosRootCmd + " " + ACTION_WRITE_MC;
		}
		else if (ACTION_READ_MC.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			if (isLinux) fullCommand = SUDO + CMD_ROOT + ACTION_READ_MC;
			else fullCommand = dosRootCmd + " " + ACTION_READ_MC;
		}
		else if (ACTION_FOLLOWON.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			if (isLinux) fullCommand = SUDO + CMD_ROOT + ACTION_FOLLOWON;
			else fullCommand = dosRootCmd + " " + ACTION_FOLLOWON;
		}
		else if (ACTION_READ_EPO.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			if (isLinux) {
				//fullCommand = SUDO + CMD_ROOT + ACTION_READ_EPO;
				// If tomcat, via sudo, issues 'sudo /usr/bin/java -jar /opt/p3scron/p3scron.jar readEpoStatus'
				// it hangs, if log4j logging to STD log at debug is enabled! Hence this workaround
				String scriptDir = P3SEnvironmentKnowledge.getScriptsFilePath();
				fullCommand = SUDO + "/usr/bin/touch "+scriptDir +"p3s/tomcatcronAntiHangWorkaround.go";
			}
			else fullCommand = dosRootCmd + " " + ACTION_READ_EPO;
		}
		else {
			log().info("buildFullCommand invoked with "+type+". *** NOT SUPPORTED ********");
			return null;
		}
		
		return fullCommand ;
		// readMcTxnStatus / mcReadAndWrite / readMcRate / epoInstructedFollowon / readEpoStatus
	}
	
	protected void issueCommand(String cmd) throws IOException {
		if (cmd==null) throw new IOException("Command to issue was invalid. isNull.");
		String os = (isLinux) ? "Linux" : "Windows";
		log().info("P3S Harness, on "+os+", about to issue O/S cmd: "+cmd);
		java.lang.Runtime.getRuntime().exec(cmd);	
		log().info("After issue O/S cmd ");
	}
	
	
	//protected String separator() {
	//	String fs = System.getProperty("file.separator");
	//	// OR String fs = File.separator
	//	System.out.println("separator is ret "+fs);
	//	return fs;
	//}
}
