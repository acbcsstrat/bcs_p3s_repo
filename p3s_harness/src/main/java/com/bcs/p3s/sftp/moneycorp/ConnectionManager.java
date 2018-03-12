package com.bcs.p3s.sftp.moneycorp;

import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.sftp.P3sSftp;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSchException;

/**
 * Client (SftpManager) is responsible for opening & closing connections,
 * & ensuring no connections are left open
 * 
 * This class assists the client in that role
 * 
 * Yes! - I've named the client - for your convenience
 * 
 */
public class ConnectionManager extends Universal {

	P3sSftp sftp;
	ChannelSftp channel;

	// Constructor
	public ConnectionManager() throws P3sSftpException {
		try {
			P3sSftp sftp = new P3sSftp();
			if (3==4) throw new P3SPropertyException("TMP dummy to keep compiler quiet");
		} catch (P3SPropertyException e) {
			throw new P3sSftpException("Error reading SFTP properties", e);
		}
	}
	
	// Methods related to managing the Connection
	public void openConnection() throws P3sSftpException {
		try {
			log().debug("Connection Opening");
			sftp = new P3sSftp();
			channel = sftp.openSftpChannel();
			if (3==4) throw new P3SPropertyException("TMP dummy to keep compiler quiet");
		} catch (P3SPropertyException | JSchException e) {
			throw new P3sSftpException("FileManager openConnection() failed.", e);
		}
	}
	public void closeConnection() {
		log().debug("Connection Closing");
		if (sftp!=null) {
			sftp.closeSftpChannel();
		}
	}
	public boolean isConnectionOpen() throws P3sSftpException {
		boolean open = false;
		if (sftp!=null) open = ! sftp.unsafe();
		return open;
	}
	
	
	

}
