package com.bcs.p3s.cron.cronspecific;

import java.io.IOException;

import com.bcs.p3s.util.config.EnvironmentSpecificProperties;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;

/**
 * Provides a working P3SPropertyReader for the Cron project
 */
public class CronP3SPropertyReader extends P3SPropertyReader {

//	public static final String WHICH_FX_SFTP_SITE = "fx_provider";
//	public static final String MC_FX_SFTP_SITE_URL = "mc_fx_url";
//	public static final String MC_FX_SFTP_SITE_USERNAME = "mc_fx_un";
//	public static final String MC_FX_SFTP_SITE_SECURE_FINGERPRINT = "mc_fx_key";
//	public static final String BCS_FX_SFTP_SITE_URL = "bcs_fx_url";
//	public static final String BCS_FX_SFTP_SITE_USERNAME = "bcs_fx_un";
//	public static final String BCS_FX_SFTP_SITE_SECURE_FINGERPRINT = "bcs_fx_key";
	
	
	
	public CronP3SPropertyReader() throws P3SPropertyException {
		super();
		P3SEnvironmentKnowledge alienEnvironmentKnowledge = new CronP3SEnvironmentKnowledge();
		String path = alienEnvironmentKnowledge.getMainPropertyFilePath(); 
		//String filename = alienEnvironmentKnowledge.P3S_PROPERTYFILE_FILENAME;
		String filename = alienEnvironmentKnowledge.P3S_PROPERTYFILE_FILENAME;
		try {
			esp = new EnvironmentSpecificProperties(path, filename);
			// Hereby overwriting the P3Sweb properties with the desired 'alien' properties 
		} catch (IOException io) {
			String eMsg = "[Failed to open cron property file] CronP3SPropertyReader Constructor ";
			String msg = logExceptionPreRethrow(eMsg,io);
			throw new P3SPropertyException(msg, io);
		}
	}

	// CLient would typically access properties with command like
	// String which_sftp_service = propertyReader.getESProperty(CronP3SPropertyReader.WHICH_FX_SFTP_SITE);
	
}
