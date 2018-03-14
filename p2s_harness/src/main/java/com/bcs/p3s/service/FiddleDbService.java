package com.bcs.p3s.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.enump3s.InvoiceStatusEnum;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.TxnNextStateEnum;
import com.bcs.p3s.util.lang.Universal;

import harnessjdbc.DBConnection;


/**
 * Simple service to make database changes, as per the reuired harness action
 * @author andyc
 */
public class FiddleDbService extends Universal {

	protected String PREFIX = this.getClass().getName() + " : "; 

	protected final String SUDO = "sudo ";

	
	public FiddleDbService() {
		// Will need access db. May wanna do stuff here ..
	}
	
	
	public void processHarnessInstruction(String p3sRef, String instruction) throws Exception  { // throws P3sSftpException
		
		String err = PREFIX + "processHarnessInstruction("+p3sRef+","+instruction+")";
		log().debug(err+" invoked.");
		
		TxnNextStateEnum enumInstruction = new TxnNextStateEnum(instruction); 
		String cmd = enumInstruction.toString();

		
		if (cmd.equals(TxnNextStateEnum.EPO_INSTRUCTED)) 
		{ 
			setEpoInstructedFlag(p3sRef);
		}
		else if (cmd.equals(TxnNextStateEnum.EPO_RENEWAL_COMPLETE)) 
		{ 
			fiddleEpoSaysRenewalIsComplete(p3sRef);
		}
		else if (cmd.equals(TxnNextStateEnum.PENALTY_PAID)) 
		{ 
			setPenaltyPaid(p3sRef);
		}
		else  
		{ 
			throw new Exception("Not gonna happen");
		}
	}
		
		
		
		
		
	protected void setEpoInstructedFlag(String p3sRef) {
		String err = PREFIX + "setEpoInstructedFlag("+p3sRef+") ";
		Connection conn = null;
		String newPayStatus = PaymentStatusEnum.EPO_INSTRUCTED;
		try {
			
			log().debug(err +" invoked");
			DBConnection obj = new DBConnection();
	      	conn = obj.connectToDB();
	      	
	      	if(conn == null){
	      		log().warn("DB Connection is null. So aborting further operations "+err);
	      		throw new Exception("DB Connection is null. So aborting further operations "+err);
	      	}
	      	
		    //String query = "UPDATE invoice SET invoice_status = ? where id = ? ";
		    String query = "UPDATE payment SET latest_trans_status = ? where p3s_trans_ref = ? ";
		    PreparedStatement preparedStmt = conn.prepareStatement(query);
		    preparedStmt.setString(1, newPayStatus);
		    preparedStmt.setString(2,p3sRef);
		    
		    preparedStmt.executeUpdate();
		}
		catch (Exception e) {
			logErrorAndContinue(err +" failed", e);
		}
		
		finally{
			try {
				conn.close();
				log().debug("DB Connection closed");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	
	protected void fiddleEpoSaysRenewalIsComplete(String p3sRef) {
		String err = PREFIX + "fiddleEpoSaysRenewalIsComplete("+p3sRef+") ";
		Connection conn = null;

		// Tricky one this
		// Required action appears to be to set Patent:last_renewed_year_epo to Patent:renewal_year - 1

		long paymentId = -1;
      	List<Long> renewalIds = new ArrayList<Long>();
      	List<Long> patentIds = new ArrayList<Long>();
      	List<Integer> existingRenewalYears = new ArrayList<Integer>();

      	try {
			
			log().debug(err +" invoked");
			DBConnection obj = new DBConnection();
	      	conn = obj.connectToDB();
	      	
	      	if(conn == null){
	      		log().warn("DB Connection is null. So aborting further operations "+err);
	      		throw new Exception("DB Connection is null. So aborting further operations "+err);
	      	}

	      	// Step 1 - get the paymentId
			String query = "SELECT id FROM payment WHERE p3s_trans_ref = ?";
		  	PreparedStatement ps1 = conn.prepareStatement(query);
		    ps1.setString(1, p3sRef);
		    ResultSet rs1 = ps1.executeQuery();
		  	
		  	if (rs1.next()){
		  		paymentId = rs1.getLong("id");
		  	} else throw new Exception(err+" failed at step 1");
	      	
	      	// Step 2 - get the affected Renewals
	      	query = "SELECT renewals FROM payment_renewals WHERE payment = ?";
	      	PreparedStatement ps2 = conn.prepareStatement(query);
	        ps2.setLong(1, paymentId);
	        ResultSet rs2 = ps2.executeQuery();
	      	
	      	while (rs2.next()){
	      		renewalIds.add(rs2.getLong("renewals"));
	      	}
	      	
	      	// Step 3 - get the affected Patents
	      	for (Long renewal : renewalIds) {	
				query = "SELECT patent FROM renewal WHERE id = ?";
			  	PreparedStatement ps3 = conn.prepareStatement(query);
			    ps3.setLong(1, renewal);
			    ResultSet rs3 = ps3.executeQuery();
			  	
			  	if (rs3.next()){
			  		patentIds.add(rs3.getLong("patent"));
			  	} else throw new Exception(err+" failed at step 3");
	      	}
	      	
	      	// Step 4 - for each patent, read renewal_year
	      	for (Long patent : patentIds) {	
				query = "SELECT renewal_year FROM patent WHERE id = ?";
			  	PreparedStatement ps4 = conn.prepareStatement(query);
			    ps4.setLong(1, patent);
			    ResultSet rs4 = ps4.executeQuery();
			  	
			  	if (rs4.next()){
			  		existingRenewalYears.add(rs4.getInt("renewal_year"));
			  	} else throw new Exception(err+" failed at step 4");
	      	}

	      	// Step 5 - for each patent, set renewal_year
	      	int count = 0;
	      	for (Long patent : patentIds) {	

	      		int existingRenewalYear = existingRenewalYears.get(count++); 
	      		System.out.println("existingRenewalYear wqas "+existingRenewalYear);
	      		int newRenewalYear = existingRenewalYear - 2;
	      		System.out.println("existingRenewalYear wqas "+existingRenewalYear+"   new="+newRenewalYear);
	      		
	      		//String query = "UPDATE payment SET latest_trans_status = ? where p3s_trans_ref = ? ";
				query = "UPDATE patent SET last_renewed_year_epo = ? WHERE id = ?";
			  	PreparedStatement ps5 = conn.prepareStatement(query);
			    ps5.setLong(1, newRenewalYear);
			    ps5.setLong(2, patent);
			    ps5.executeUpdate();
	      	}
		}
		catch (Exception e) {
			logErrorAndContinue(err +" failed", e);
		}
		
		finally{
			try {
				conn.close();
				log().debug("DB Connection closed");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}


	protected void setPenaltyPaid(String p3sRef) {
		String err = PREFIX + "setPenaltyPaid("+p3sRef+") ";
		Connection conn = null;
		String newInvoiceStatus = InvoiceStatusEnum.CLOSED;
		long invoiceId = -1;
		try {
			
			log().debug(err +" invoked");
			DBConnection obj = new DBConnection();
		  	conn = obj.connectToDB();
		  	
		  	if(conn == null){
		  		log().warn("DB Connection is null. So aborting further operations "+err);
		  		throw new Exception("DB Connection is null. So aborting further operations "+err);
		  	}
		  	
		  	// Step 1 - get the ID of the Invoice
			String query1 = "SELECT latest_invoice FROM payment WHERE p3s_trans_ref = ?";
		  	PreparedStatement ps1 = conn.prepareStatement(query1);
		    ps1.setString(1, p3sRef);
		    ResultSet rs1 = ps1.executeQuery();
		  	
		  	if (rs1.next()){
		  		invoiceId = rs1.getLong("latest_invoice");
		  	}
		  	
		  	// Step 2 - change the Invoice status
		    String query2 = "UPDATE invoice SET invoice_status = ? where id = ? ";
		    PreparedStatement ps2 = conn.prepareStatement(query2);
		    ps2.setString(1, newInvoiceStatus);
		    ps2.setLong(2,invoiceId);
		    ps2.executeUpdate();
		}
		catch (Exception e) {
			logErrorAndContinue(err +" failed", e);
		}
		
		finally {
			try {
				conn.close();
				log().debug("DB Connection closed");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}
