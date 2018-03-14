package com.bcs.p3s.sftp.moneycorp;

import java.util.List;

import com.bcs.p3s.sftp.moneycorp.model.TransactionStatus;
import com.bcs.p3s.sftp.service.P3sSftpException;

/**
 * Reminder: Any class extending SftpManager TAKES RESPONSIBILITY for opening and closing connections.
 *
 * but also, any client catching a P3sSftpException is responsible for calling close()
 */
public class TransactionStatusSftpManager extends SftpManager {

	protected final FoldernameEnum transactionStatusFolder = new FoldernameEnum(FoldernameEnum.TRANSACTIONSTATUS);
	protected final String CSV					= ".csv";

	// Provide a listing of the files in the TransactionStatus folder
	public List<String> folderListing() throws P3sSftpException {
		boolean isTransactionStatus = true;
		return folderListing(transactionStatusFolder, isTransactionStatus);
	}

		
	public void archiveProcessedTransactionStatusFile(String filename) throws P3sSftpException {
		boolean allOk = true;
		archiveFile(transactionStatusFolder, filename, allOk); 
	}
	public void archiveFailedTransactionStatusFile(String filename) throws P3sSftpException {
		boolean allOk = false;
		archiveFile(transactionStatusFolder, filename, allOk); 
	}

	
	public List<String> readTransactionStatusFile(String filename) throws P3sSftpException {
		return readFile(transactionStatusFolder, filename);
	}

	// This, specifically for HARNESS
	public void writeTransactionStatusFile(TransactionStatus pojo) throws P3sSftpException {
		if (pojo==null||pojo.getPatentPlaceRef()==null) fail("Pojo is or contains NUll");


		String tsFilename = pojo.getPatentPlaceRef()+"_"+pojo.getStatus() + CSV;

		List<String> lines = pojo.toFormettedOutput();
		
		writeFile(transactionStatusFolder, tsFilename, lines);
			
	}

	
}
