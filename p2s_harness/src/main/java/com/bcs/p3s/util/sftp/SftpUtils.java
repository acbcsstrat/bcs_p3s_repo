package com.bcs.p3s.util.sftp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Vector;

import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.lang.Universal;
import com.jcraft.jsch.ChannelSftp;

public class SftpUtils extends Universal {


	public ArrayList<String> vectorOfLsEntryToArrayListOfFilenames(
			Vector<ChannelSftp.LsEntry> raw, boolean isTransactionStatus) {
		ArrayList<String> lines = new ArrayList<String>();
	    if(raw != null) {
		      for(int ii=0; ii<raw.size(); ii++){
		    	  // Assume content is LsEntry. Will throw ClassCastException if not
		    	  Object obj = raw.elementAt(ii);
		    	  if (obj != null) {
		    		  String fullline = ((com.jcraft.jsch.ChannelSftp.LsEntry) obj).getLongname();
		    		  String filename = extractFilename(fullline, isTransactionStatus); 
		    		  if (filename != null) lines.add(filename);
	              }
		      }
	    }
	    if (lines.size() > 1) lines.sort(String::compareToIgnoreCase);
	    return lines ;
	}

	
	
	

	/**
	 * Extracts filename from the 'ls -al' style line listing
	 * Will return null if no match, or passed null
	 * Will replace  . & .. 'files' with null
	 * @param raw The ls -al line listing as provided by lsal()
	 * @param isTransactionStatus true if this is for TransactionStatus files (so tolerate a space)
	 * @return The filename
	 */
	public String extractFilename(String raw, boolean isTransactionStatus) {
		if (raw==null) return null;
		String fileOrDir = null;
		String filename = null;
		final String EMPTY = "";
		// System.out.println("SftpUtils extractFilename("+raw+") invoked");
		
		String[] fields = raw.split("\\s+");
		int numFields = fields.length;
		if (numFields>=9) {
			fileOrDir = fields[0];
			filename = fields[8]; 
			
			if (isTransactionStatus) filename += filenameForTransactionStatusFile(raw, filename);
			
			//System.out.println(" set filename to = "+filename );
		}
		
		// Strip the . & .. entries & directories
		if (filename==null || (filename.replaceAll("\\.", EMPTY)).equals(EMPTY)) filename = null;
		if (filename!=null && fileOrDir!=null && fileOrDir.startsWith("d") ) filename = null;
		
		// System.out.println("SftpUtils extractFilename() returning filename :"+filename);
		return filename;
	}
	
	
	protected String filenameForTransactionStatusFile(String raw, String filenameSoFar) {
		if (raw==null || filenameSoFar==null) return "";
		String tsFileExtra = "";
		int startnamePoz = raw.indexOf(filenameSoFar);
		int candidateSpacePoz = startnamePoz+filenameSoFar.length();
		char lastChar = raw.charAt(candidateSpacePoz-1);  //expect v, but may be _
		if (lastChar=='_' && raw.charAt(candidateSpacePoz)==' ') {
			int nextspace = raw.indexOf(' ', candidateSpacePoz+1);
			if (nextspace==-1) nextspace=raw.length();
			tsFileExtra = raw.substring(candidateSpacePoz, nextspace);
		}
		return tsFileExtra;
	}
	
	/**
	 * Checks proposed filename has no spaces and ends .csv (lowercase)
	 * Intended for writing file to SFTP server - i.e. the file is an Order file
	 * @param filename
	 * @throws P3sSftpException if filename is bad
	 */
	public void checkFilenameForSpacesAndExtension(String filename) throws P3sSftpException {
		boolean failed = isEmpty(filename);
		if ( ! failed) {
			if (filename.indexOf(" ") > -1) failed = true;
			if ( ! filename.endsWith(".csv")) failed = true;
		}
		
		if (failed) throw new P3sSftpException("SftpUtils checkFilename passed invalid filename of >"+filename+"<");
	}

	
	
	/**
	 * Given a List of names, sorts & returns the name of the latest/highest name
	 * @param names
	 * @return The latest name, or null if the list is empty
	 */
	public String getLatestFilename(List<String> names) {
		if (names==null) return null;
		int num = names.size();
		if (num==0) return null;
		else if (num==1) return names.get(0);
		else {
			String latest = null;
			Collections.sort(names);
			latest = names.get(num-1);
			return latest;
		}
	}
	
	
	
	
	
	
	
	
	
	
	// Rock on Obfuscation!
	public String getKey(String existing) {
		if (existing==null) return existing;
		StringBuffer buf = new StringBuffer(""); 
		int len = existing.length();
		for (int ii=0; ii<len; ii++) {
			buf.append(existing.charAt(len-ii-1));
		}
		return buf.toString();
	}
	
	
}
