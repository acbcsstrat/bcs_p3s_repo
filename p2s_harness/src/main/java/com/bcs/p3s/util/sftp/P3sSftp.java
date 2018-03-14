package com.bcs.p3s.util.sftp;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Vector;

import com.bcs.p3s.cron.cronspecific.CronP3SPropertyReader;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.Universal;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.HostKey;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.jcraft.jsch.UserInfo;


//	P3S uses the Jsch library to implement SFTP
//	For a new Host, the *_fx_key (in cron.properties) can be determined from the new host.
//	Likely from cat /root(or user)/.ssh/known_hosts | grep localhost) - or from /etc/ssh/ssh_host_rsa_key.pub


/**
 * Provides low-level SFTP operations. Calling class will provide processing and know file structure
 * 
 * Client is responsible for opening & closing connections,
 * & ensuring no connections are left open
 */
public class P3sSftp extends Universal {

	protected String fx_url;
	protected String fx_un;
	protected String fx_key;
	protected String fx_pwd;
	
	protected JSch jsch;
	protected Session session;  
	protected ChannelSftp channelSftp;
	protected boolean isOpen = false;
	

	
	public P3sSftp() throws P3SPropertyException {
		// Populate SFTP data
		//CronP3SPropertyReader propertyReader = new CronP3SPropertyReader(); -- inherited by Harness. Wrong!
		P3SPropertyReader propertyReader = new P3SPropertyReader();
		//Below converted to JDBC
		GlobalVariableSole global = GlobalVariableSole.findOnlyGlobalVariableSole();
		//Respective JDBC code below
//		GlobalVariableSole global = new GlobalVariableSoleJDBC().findOnlyRow(); 
		String which_sftp_service = propertyReader.getESProperty(P3SPropertyNames.WHICH_FX_SFTP_SITE);
		if ("MC".equals(which_sftp_service)) {
			// Retrieve access details for the Moneycorp SFTP site
			this.fx_url = propertyReader.getGenericProperty(P3SPropertyNames.MC_FX_SFTP_SITE_URL);
			this.fx_un  = propertyReader.getGenericProperty(P3SPropertyNames.MC_FX_SFTP_SITE_USERNAME);
			this.fx_pwd = (new SftpUtils()).getKey(global.getMoneycorpKey());
			this.fx_key = propertyReader.getGenericProperty(P3SPropertyNames.MC_FX_SFTP_SITE_SECURE_FINGERPRINT);
		} else if ("BCS".equals(which_sftp_service)) {
			// Retrieve access details for the BCS SFTP site
			this.fx_url = propertyReader.getGenericProperty(P3SPropertyNames.BCS_FX_SFTP_SITE_URL);
			this.fx_un  = propertyReader.getGenericProperty(P3SPropertyNames.BCS_FX_SFTP_SITE_USERNAME);
			this.fx_pwd = (new SftpUtils()).getKey(global.getMoneycorpKey());
			this.fx_key = propertyReader.getGenericProperty(P3SPropertyNames.BCS_FX_SFTP_SITE_SECURE_FINGERPRINT);
		}
		else throw new P3SPropertyException("Missing cron property : WHICH_SFTP_SITE of "+P3SPropertyNames.WHICH_FX_SFTP_SITE);
	}
	
	
	
	public ChannelSftp openSftpChannel() throws JSchException {
		if (!unsafe()) closeSftpChannel();
		// parse the key
		byte[] key = Base64.getDecoder().decode(fx_key);

		jsch = new JSch();
		// make secure
		HostKey hostKey = new HostKey(fx_url, key);
		UserInfo userInfo = null; // No user interaction required
		jsch.getHostKeyRepository().add(hostKey, userInfo);

		// Now connect
		session = jsch.getSession(fx_un, fx_url, 22);  
		session.setPassword(fx_pwd);

		session.setConfig("StrictHostKeyChecking", "no");
		
		session.connect();
		System.out.println("Session Connected ! ");
		
		Channel channel = session.openChannel("sftp");
		channel.connect();
		channelSftp = (ChannelSftp) channel;
		System.out.println("Channel opened ! ");
		isOpen  = true;
		
		return channelSftp;
	}
	
	public String pwd() throws SftpException, P3sSftpException {
		log().info("P3sSftp pwd() invoked");
		if (unsafe()) throw new P3sSftpException("P3sSftp pwd() unsafe");
		String pwd = channelSftp.pwd();
		return pwd;
	}

	public void cd(String path) throws SftpException, P3sSftpException {
		log().info("P3sSftp cd() invoked with path"+path);
		if (unsafe()) throw new P3sSftpException("P3sSftp cd() unsafe");
		channelSftp.cd(path);
	}

	/**
	 * Returns a raw listing. Expect filename in field 9. Includes the . & .. rows.
	 * @param filespec. Optional. MAY BE UNTESTED. Wildcard?
	 * @return Vector of file listing
	 * @throws SftpException
	 */
	public Vector<ChannelSftp.LsEntry> ls(String filter) throws SftpException, P3sSftpException {
		if (filter==null) filter = ".";
		log().info("P3sSftp ls() invoked with filter="+filter);
		if (unsafe()) throw new P3sSftpException("P3sSftp ls() unsafe");
	    Vector<ChannelSftp.LsEntry> listing = channelSftp.ls(filter);
	    return listing;
	}

	public List<String> readFile(String filename) throws SftpException, P3sSftpException {
		log().info("P3sSftp readFile() invoked with filename="+filename);
		if (unsafe()) throw new P3sSftpException("P3sSftp readFile() unsafe");
		ArrayList<String> content = new ArrayList<String>();

		BufferedReader reader = null;
		try {
			InputStream is = channelSftp.get(filename);
			reader = new BufferedReader(new InputStreamReader(is));
	        //StringBuilder stringBuilder = new StringBuilder();
			
	        String line;
	        while ((line = reader.readLine()) != null) {
	        	//stringBuilder.append(line);
	            content.add(line); // Add Line in the list
	        }
        }
	    catch (IOException io) {
	    	throw new P3sSftpException(io.getMessage(), io);
	    }
		finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
					throw new P3sSftpException("sftp readFile failed in finally", e);
				}
			}
		}
		return content;
	}

	
	
	
	public void writeFile(String filename, List<String> content) throws SftpException, P3sSftpException, IOException {
		log().info("P3sSftp writeFile() invoked with filename "+filename+" (+content)");
		if (unsafe()) throw new P3sSftpException("P3sSftp writeFile() unsafe");
		// convert content to byte array
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		DataOutputStream out = new DataOutputStream(baos);
		for (String element : content) {
		    //out.writeUTF(element);
		    out.writeBytes(element);
		    out.writeByte(13);
		    out.writeByte(10);
		    // Note: Must write in this order (CR then LF) for recipient system = Microsoft (ie Moneycorp)
		}
		byte[] bytes = baos.toByteArray();
		InputStream is = new ByteArrayInputStream(bytes);
		
		channelSftp.put(is, filename);
	}

	
	
	
	
	public void mv(String srcFile, String dstFolder) throws SftpException, P3sSftpException {
		log().info("P3sSftp mv() invoked with "+srcFile+" and dstFolder="+dstFolder);
		if (unsafe()) throw new P3sSftpException("P3sSftp mv() unsafe");
		if (srcFile==null || dstFolder==null) return;
		String dstFilespec = dstFolder+"/"+srcFile;
		channelSftp.rename(srcFile, dstFilespec);
	}
	
	
	
	public void closeSftpChannel() {
		isOpen = false;
		if (channelSftp!=null) {
			channelSftp.disconnect();
			System.out.println("Channel Disconnected  ");
		}
		if (session!=null) {
			session.disconnect();
			System.out.println("Session Disconnected ");
		}
	}
	

	// Safety check
	public boolean unsafe() {
		return ( (!isOpen) || (channelSftp==null) || (session==null) );  
	}

}
