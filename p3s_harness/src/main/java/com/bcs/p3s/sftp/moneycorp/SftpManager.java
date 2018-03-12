package com.bcs.p3s.sftp.moneycorp;

import java.util.Date;
import java.util.List;

import com.bcs.p3s.sftp.service.P3sSftpException;
import com.bcs.p3s.util.lang.Universal;


/**
 * Takes responsibility for opening and closing connections.
 * Does this by implementing atomic commands. 
 * So No connection-management needed by clients, at all.
 *
 */
public abstract class SftpManager extends Universal {

	protected FileManager mgr;
	
	// Don't need a method to check if connection open or not, as methods here (& subclassed) are atomic 
	// - so will be careful to clean up after themselves 

	// ALL methods contain both an open & close
	// though if exception thrown up - catcher is responsible for calling close()


	
	// Higher level functions

	public List<String> folderListing(FoldernameEnum folder, boolean isTransactionStatus) throws P3sSftpException {
		if (folder==null) return null;
		List<String> filenames = null;
		
		open();
		
		filenames = mgr.folderListing(folder, isTransactionStatus);
		
		close();

		return filenames;
	}
	
	
	
	
	
	// The named file should be moved to Processed. Any others move to Errors
	public void archiveRatesFiles(
				FoldernameEnum topFolder, String latestFile, List<String> allFiles) throws P3sSftpException 
	{
		if (topFolder==null || latestFile==null || allFiles==null) throw new P3sSftpException("BadParam"); 
		FoldernameSubfolderEnum processedSub = new FoldernameSubfolderEnum("processed");
		FoldernameSubfolderEnum errorSub = new FoldernameSubfolderEnum("error");
		
		int num = allFiles.size();
		if (num>1) {
			allFiles.remove(latestFile);
			System.out.println("OTHER files are");
			for (String xfile:allFiles) {
				System.out.println(" - "+xfile);
			}
		}
		
		open();

		// First, move the processed file to Procecessed
		mgr.mvFileToSubfolder(topFolder, latestFile, processedSub);
		
		
		// As there should not be any other files, move such to Errors
		if (num>1) {
			for (String badFile : allFiles) {
				System.out.println("BadFile heading to Errror subfolder is  - "+badFile); // delib misplt
				mgr.mvFileToSubfolder(topFolder, badFile, errorSub);
			}
			
		}
		
		close();
		
	}

	public void archiveFile(FoldernameEnum topFolder, String filename, 
					boolean allOk) throws P3sSftpException 
	{
		if (topFolder==null || filename==null) throw new P3sSftpException("BadParam"); 

		FoldernameSubfolderEnum destinationEnum = null;
		if (allOk) destinationEnum = new FoldernameSubfolderEnum("processed");
		else destinationEnum = new FoldernameSubfolderEnum("error");
		
		open();

		// Move the file 
		mgr.mvFileToSubfolder(topFolder, filename, destinationEnum);
		
		close();
		
	}

	
	public List<String> readFile(FoldernameEnum topFolder, String filename) throws P3sSftpException {
		if (topFolder==null || filename==null) throw new P3sSftpException("BadParam"); 
		List<String> content = null;
		
		open();
		
		content = mgr.readFile(topFolder, filename);
		
		close();

		return content;
	}
	
	
	public void writeFile(FoldernameEnum topFolder, String filename, List<String> lines) throws P3sSftpException {
		if (topFolder==null || filename==null || lines==null || lines.size()==0) throw new P3sSftpException("BadParam"); 

		open();
		
		mgr.writeFile(topFolder, filename, lines);
		
		close();
	}

	
	
	// Lower level functions
	protected void open() throws P3sSftpException {
		long startTime = (new Date()).getTime();
		if (mgr==null) mgr = new FileManager();
		if (mgr.isConnectionOpen()) mgr.closeConnection(); // Should never happen
		mgr.openConnection();
		long msDuration = (new Date()).getTime() - startTime;
		log().debug("SftpManager open() took "+(msDuration/1000)+" seconds");
	}
	public void close() throws P3sSftpException {
		if (mgr==null) return;
		mgr.closeConnection();
		mgr = null;
	}
	
}
