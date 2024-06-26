package com.bcs.p3s.util.os;

/* 
 * Determines the type of the local OS
 * 
 * Dependencies:
 *   None
 *   
 * Credits: mkyong.com : https://www.mkyong.com/java/how-to-detect-os-in-java-systemgetpropertyosname/
 */
public class WhatsMyOS {

	private static String OS = System.getProperty("os.name").toLowerCase();

	/**
	 * Raw, as full output is unpredictable
	 * @return
	 */
	public static String getRawOS() {
		return OS;
	}
	
	public static boolean isWindows() {
		return (OS.indexOf("win") >= 0);
	}

	public static boolean isMac() {
		return (OS.indexOf("mac") >= 0);
	}

	public static boolean isUnix() {
		return (OS.indexOf("nix") >= 0 || OS.indexOf("nux") >= 0 || OS.indexOf("aix") > 0 );
	}

	public static boolean isLinux() {
		return (OS.indexOf("nux") >= 0);
	}

	public static boolean isSolaris() {
		return (OS.indexOf("sunos") >= 0);
	}

}
