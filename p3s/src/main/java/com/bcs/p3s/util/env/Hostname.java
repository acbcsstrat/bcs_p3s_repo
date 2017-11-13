package com.bcs.p3s.util.env;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.UnknownHostException;

import com.bcs.p3s.util.log.BcsLogger;

/* 
 * Accesses the host's hostname

 * Supported O/S : Windows & Linux. Probably more
 * 
 * Dependencies:
 *   BcsLogger
 */
public class Hostname {

	
	/**
	 * getHostname
	 * @return Hostname, as a String
	 */
	public static String getHostname() {
		String name = null;
		BcsLogger bcsLogger = new BcsLogger();
		try {
			name = java.net.InetAddress.getLocalHost().getHostName();
		} catch (UnknownHostException e) {
			// Here, static method calls non-static method, so
			bcsLogger.logInternalError().error("P3S Hostname has failed to access hostname", e);
		}
		bcsLogger.log().debug("P3S Hostname returns "+name);
		return name;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		// Default constructor takes no action.
	
	
	/**
	 * Provides the hostname of this Windows host
	 * @return hostname
	 * @throws InterruptedException
	 */
	public static String getWinHostnameWithException() 
				throws InterruptedException, IOException  {

		BcsLogger bcsLogger = new BcsLogger();
		
		  String hostname="";
		  // System.out.println("Before hostname");
		  
		  bcsLogger.log().debug("Hostname:getWinHostnameWithException about to issue OS cmd");
		  ProcessBuilder cdBuilder = new ProcessBuilder(
		            "cmd.exe", "/c", "hostname");
		  bcsLogger.log().debug("Hostname:getWinHostnameWithException has issued OS cmd");
		  // System.out.println("After hostname");
		  cdBuilder.redirectErrorStream(true);
		  Process p = cdBuilder.start();
		  BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
		  String line;
		  while ((line = r.readLine())!=null) {
		      /*line = r.readLine();
		  	  if (line == null) { break; }*/
			  hostname=line;
			  //System.out.println(hostname);
		  }
		  bcsLogger.log().debug("Hostname:getWinHostnameWithException returns hostname of: "+hostname);
		  return hostname;
	}

	/**
	 * Provides the hostname of this Windows host. 
	 * Convenience method. Will not throw exception. Succeeds or returns null
	 * @return hostname or null
	 */
	public static String getWinHostname()  {
		String hostname=null;
		try {
			hostname = getWinHostnameWithException();
		}
		catch (Exception e) {
			e.printStackTrace();
			(new BcsLogger()).log().warn("Hostname:getWinHostname experienced: ", e);
		}
		return hostname;
	}
	
}
