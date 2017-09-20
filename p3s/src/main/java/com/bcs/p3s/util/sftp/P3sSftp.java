package com.bcs.p3s.util.sftp;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Vector;

import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.lang.Universal;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

public class P3sSftp extends Universal{

	
	protected Session session = null;
	protected  Channel sftpChannel;
	protected ChannelSftp channelSftp;
	boolean isOpen = false;
	
	protected final String RATES_FOLDER_NAME = "temp_createdbyavidity_Rates"; // for DEV
	protected final String RATES_PROCESSED_FOLDER_NAME = RATES_FOLDER_NAME + "/processed";
	
	protected final String ORDERS_FOLDER_NAME = "Orders"; // for DEV
	protected final String ORDERS_PROCESSED_FOLDER_NAME = ORDERS_FOLDER_NAME + "/processed";

	
	
	/** connecting to our SFTP server **/
	protected final String sftpURL = "162.13.14.125";
	protected final String username = "moneycorp";
	protected final String password = "P4t3ntFX79";

	/** connecting to moneycorp SFTP **/
	/*protected final String sftpURL = "securefile.moneycorp.com";
	protected final String username = "avidity-cfx";
	protected final String password = "2Gc9jheJ";*/
	
	
	public ChannelSftp openSftpChannel() throws JSchException {
		JSch jsch = new JSch();
    	session = jsch.getSession(username,sftpURL, 22);
        session.setConfig("StrictHostKeyChecking", "no");
        session.setPassword(password);
        log().debug("SFTPConnection: SFTP about to connect:");
        session.connect();

        sftpChannel = session.openChannel("sftp");
        sftpChannel.connect();
        channelSftp = (ChannelSftp) sftpChannel;
		
		return channelSftp;
	}
	
	public void cd(String path) throws SftpException {
		if (unsafe()) return;
		channelSftp.cd(path);
	}

	
	public void closeSftpChannel() {
		isOpen = false;
		if (channelSftp!=null) {
			channelSftp.disconnect();
		}
		if (session!=null) {
			session.disconnect();
		}
	}
	

	// Safety check
	protected boolean unsafe() {
		return ( (!isOpen) || (channelSftp==null) || (session==null) );  
	}

	public void upload(ArrayList<String> lines, String writeFileName){
		
		try {
			String readFolder = ORDERS_FOLDER_NAME;
			String tgtDir = "/";
			if (readFolder != null)
				tgtDir += readFolder;
			
			String wholeFileAsString = "";
			for (String aLine : lines) {
				wholeFileAsString += (aLine + "\r\n");
			}
			byte[] wholeFileAsBytes = wholeFileAsString.getBytes();
			
			channelSftp = openSftpChannel();
			if(channelSftp.isConnected()){
				channelSftp.cd(tgtDir);
				channelSftp.put(new ByteArrayInputStream(wholeFileAsBytes), writeFileName);
			}
		}
		
		catch(Exception e){
			log().error("Exception thrown while uploading Orders file " + e.getMessage());
		}
	}

}
