package com.bcs.p3s.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

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
	

	protected final String SUDO = "sudo ";
	protected final String CMD_ROOT = "/usr/bin/java -jar /opt/p3scron/p3scron.jar ";
	protected final String ACTION_READ_MC = "readMcTxnStatus";
	protected final String ACTION_READ_EPO = "readEpoStatus";
	protected final String ACTION_FOLLOWON = "epoInstructedFollowon";
	// readMcTxnStatus / mcReadAndWrite / readMcRate / epoInstructedFollowon / readEpoStatus

	
	public OSCommandService() {
		if (P3SEnvironmentKnowledge.isDeveloperPC()) isLinux = false; 
		// System.out.println("OSCommandService has determined isLinux  ="+isLinux);
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

		if ( ! isLinux) {
				log().debug("buildFullCommand invoked with "+type+".  BUT isLinux = "+isLinux+" so ABORTING");
				return null;
		}
		
		if (ACTION_READ_MC.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			fullCommand = SUDO + CMD_ROOT + ACTION_READ_MC;
		}
		else if (ACTION_READ_EPO.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			fullCommand = SUDO + CMD_ROOT + ACTION_READ_EPO;
		}
		if (ACTION_FOLLOWON.equalsIgnoreCase(type)) {
			log().info("buildFullCommand invoked with "+type+". ACTIONING");
			fullCommand = SUDO + CMD_ROOT + ACTION_FOLLOWON;
		}
		else {
			log().info("buildFullCommand invoked with "+type+". *** NOT YET SUPPORTED ********");
			return null;
		}
		
		return fullCommand ;
		// readMcTxnStatus / mcReadAndWrite / readMcRate / epoInstructedFollowon / readEpoStatus
	}
	
	protected void issueCommand(String cmd) throws IOException {
		if (cmd==null) throw new IOException("Command to issue was invalid. isNull.");
		log().info("P3S Harness about to issue O/S cmd: "+cmd);
		java.lang.Runtime.getRuntime().exec(cmd);	
	}
	
	
	//protected String separator() {
	//	String fs = System.getProperty("file.separator");
	//	// OR String fs = File.separator
	//	System.out.println("separator is ret "+fs);
	//	return fs;
	//}
}
