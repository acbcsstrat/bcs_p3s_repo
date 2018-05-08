package com.bcs.p3s.util;

import java.net.UnknownHostException;

public class Hostname {

	
	/**
	 * getHostname
	 * @return Hostname, as a String
	 */
	public static String getHostname() {
		String name = null;
		try {
			name = java.net.InetAddress.getLocalHost().getHostName();
		} catch (UnknownHostException e) {
			// Here, static method calls non-static method, so
		}
		return name;
	}

}
