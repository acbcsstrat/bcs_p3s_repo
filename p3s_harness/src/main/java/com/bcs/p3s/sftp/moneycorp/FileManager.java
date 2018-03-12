package com.bcs.p3s.sftp.moneycorp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.sftp.SftpUtils;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.SftpException;


/**
 * ConnectionManager assists the client with managing the connection
 * 
 * This class adds to that functionality, useful worker methods for SFTP
 * operations
 * 
 */
public class FileManager extends ConnectionManager {

	protected final String ROOT = "/";

	// Constructor (required by ConnectionManager constructor throws clause)
	public FileManager() throws P3sSftpException {
		super();
	}

	// Worker Methods - can rely on the connection being open & ready

	/*
	 * 'ls -al' (ish) listing
	 */
	public List<String> folderListing(FoldernameEnum folderEnum, boolean isTransactionStatus) throws P3sSftpException {
		if (folderEnum == null)
			return null;
		String err = "com.bcs.p3s.sftp.moneycorp.FileManager folderListing() : ";
		String folder = folderEnum.toString();
		List<String> filenameList = new ArrayList<String>();

		try {
			sftp.cd(ROOT + folder);

			Vector<ChannelSftp.LsEntry> raw = sftp.ls(null);

			// Now sanitise that raw result
			SftpUtils su = new SftpUtils();
			filenameList = su.vectorOfLsEntryToArrayListOfFilenames(raw, isTransactionStatus);
			
			// } catch (P3SPropertyException | JSchException | SftpException ex) {
		} catch (SftpException ex) {
			throw new P3sSftpException(err, ex);
		}
		return filenameList;
	}

	public void mvFileToSubfolder(FoldernameEnum folderEnum, String filename, FoldernameSubfolderEnum archiveEnum)
			throws P3sSftpException {
		String err = "com.bcs.p3s.sftp.moneycorp.FileManager mvFileToProcessed() : ";
		if (folderEnum==null || filename==null || archiveEnum==null)
			throw new P3sSftpException(err + "Bad invoke.");

		String folder = folderEnum.toString();
		String archive = archiveEnum.toString();

		try {
			sftp.cd(ROOT + folder);
			sftp.mv(filename, archive);
		} catch (SftpException ex) {
			throw new P3sSftpException(err, ex);
		}
	}

	public List<String> readFile(FoldernameEnum folderEnum, String filename) throws P3sSftpException {
		String err = "com.bcs.p3s.sftp.moneycorp.FileManager readFile() : ";
		if (folderEnum==null || filename==null) throw new P3sSftpException(err + "Bad invoke."); 

		List<String> content = null;
		String folder = folderEnum.toString();
		try {
			sftp.cd(ROOT + folder);
			content = sftp.readFile(filename);
		} catch (SftpException ex) {
			throw new P3sSftpException(err, ex);
		}
		return content;
	}

	public void writeFile(FoldernameEnum folderEnum, String filename, List<String> lines) throws P3sSftpException {
		String err = "com.bcs.p3s.sftp.moneycorp.FileManager writeFile() : ";
		if (folderEnum==null || filename==null || lines==null || lines.size()==0) throw new P3sSftpException(err + "Bad invoke."); 

		String folder = folderEnum.toString();
		try {
			sftp.cd(ROOT + folder);
			sftp.writeFile(filename, lines);
		} catch (SftpException | IOException ex) {
			throw new P3sSftpException(err, ex);
		}
	}

}
