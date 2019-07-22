package com.bcs.p3s.sftp.service;

import java.util.ArrayList;

import com.bcs.p3s.sftp.model.Order;



/**
 * Provides client-facing, simple methods for operating the Moneycorp SFTP Interface
 *
 */
public interface MoneycorpSftpAccess {
	
//	Where required pojos do not yet exist,  an ideallised definition is provided, commented out
	
	
//	public com.bcs.p3s.sftp.model.Rate getLatestRate() throws P3sSftpException;

	public void createOrderFile(Order order) throws P3sSftpException;
	
//	public ArrayList<com.bcs.p3s.sftp.model.TxnStatus> getTxnStatuses() throws P3sSftpException;
	
//	public ArrayList<com.bcs.p3s.sftp.model.RecFile> getRecFiles() throws P3sSftpException;
	
//	public moveFileToArchiveFolder(String folder, String filename) throws P3sSftpException;
	
//	public moveFileToErrorFolder(String folder, String filename) throws P3sSftpException;

	

/*	
	Note the first 4 method will not MOVE existing SFTP files.
	Upon processing (successful or otherwise) of data returned (for Rate, TxnStatus(es), & RecFile)
	THE CLIENT IS RESPONSIBLE for deciding whether to call either of the last 2 methods - the MOVE existing SFTP file methods


	WHERE APPROPRIATE: If above SFTP processing discovers an invalid file, *IT* may move that file to errors folder
	  whereupon IT is responsible for appropriate logging and alarm-raising
	[Not least because the pojos provide no mechanism for conveying this bad-file information to the client]



	However:
	-	getLatestRate() – if this discovers more than one rate file, it WILL move the not-Latest file(s) into the ERRORS folder (thereby indicating that it was not processed)
	[ok – is not an strictly a bad file, but this SHOULD never occur, & this indicates there was something odd with the file]
*/

}
