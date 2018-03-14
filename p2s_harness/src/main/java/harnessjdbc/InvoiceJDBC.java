/**
 * 
 */
package harnessjdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
//import com.bcs.p3s.modelDBConnecction.DBConnection;
import com.bcs.p3s.util.lang.Universal;

/**
 * @author MerinP
 *
 */
public class InvoiceJDBC extends Universal{
	
	public Invoice createInvoice(Invoice invoice){
		
		Invoice newPersistedInv = new Invoice();
		int newInv_id ;
		Connection conn = null;
		ResultSet rs = null;
		ResultSet rs1 = null;
		String msg = "InvoiceJDBC : createInvoice()";
		try {
			
			log().debug(msg +" invoked");
			DBConnection obj = new DBConnection();
	      	conn = obj.connectToDB();
	      	
	      	if(conn == null){
	      		log().warn("DB Connection is null. So aborting further operations");
	      		return newPersistedInv;
	      	}
	      	
		    String query = "INSERT INTO invoice (payment, invoice_number , issue_date , invoice_status , preceeding_invoice_id , "
		    		+ "invoice_type ,  doc_path , filename , invoice_template_id , version) VALUES (?, ?, ?, ? ,? ,? ,? ,? ,? ,?)";

	        // create the mysql insert preparedstatement
	        PreparedStatement preparedStmt = conn.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);
	        preparedStmt.setLong(1, invoice.getPayment().getId());
	        preparedStmt.setString(2, invoice.getInvoiceNumber());
	        //preparedStmt.setDate(3, new java.sql.Date(invoice.getIssueDate().getTime()));
	        preparedStmt.setTimestamp(3, new java.sql.Timestamp(invoice.getIssueDate().getTime()));
	        preparedStmt.setString(4, invoice.getInvoiceStatus());
	        preparedStmt.setLong(5, invoice.getPreceedingInvoiceId().getId());
	        preparedStmt.setString(6, invoice.getInvoiceType());
	        preparedStmt.setString(7, invoice.getDocPath());
	        preparedStmt.setString(8, invoice.getFilename());
	        preparedStmt.setString(9, invoice.getInvoiceTemplateId());
	        preparedStmt.setInt(10, 0);
	        
	        /*int affectedRows = preparedStmt.executeUpdate();
	        
	        if (affectedRows == 0) {
	            throw new SQLException("Creating invoice failed, no rows affected.");
	        }*/

	        preparedStmt.executeUpdate();
	        
	        rs = preparedStmt.getGeneratedKeys();
	       	if (rs.next()) {
	       		System.out.println(rs.getInt(1));
	       		newInv_id = rs.getInt(1);
	       		log().debug("New invoice persisted and returned generated key as " + newInv_id);
	       		
	       		//FETCHING DATA FOR ID = newInv_id
	       		query = "SELECT * FROM invoice WHERE id = ?";
		   	     
		      	PreparedStatement ps1 = conn.prepareStatement(query);
		        ps1.setLong(1, newInv_id);
		        
		        rs1 = ps1.executeQuery();
		      	
		      	if (rs1.next()){
		      		newPersistedInv.setId((long) newInv_id);
		      		newPersistedInv.setPayment(invoice.getPayment());
		      		newPersistedInv.setInvoiceNumber(rs1.getString("invoice_number"));
		      		newPersistedInv.setIssueDate(rs1.getTimestamp("issue_date"));
		      		newPersistedInv.setInvoiceStatus(rs1.getString("invoice_status"));
		      	}
	         }
	         rs.close();
		    
		}
		catch (Exception e) {
			logErrorAndContinue(msg +" failed", e);
		}
		
		finally{
			try {
				conn.close();
				rs.close();
				rs1.close();
				log().debug("DB Connection closed");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return newPersistedInv;
		
	}
	
	public void updateInvoiceStatus(Invoice updatedInvObj){
		
		Connection conn = null;
		String msg = "InvoiceJDBC : updateInvoiceStatus()";
		try {
			
			log().debug(msg +" invoked");
			DBConnection obj = new DBConnection();
	      	conn = obj.connectToDB();
	      	
	      	if(conn == null){
	      		log().warn("DB Connection is null. So aborting further operations");
	      		return;
	      	}
	      	
		    String query = "UPDATE invoice SET invoice_status = ? where id = ? ";
		    PreparedStatement preparedStmt = conn.prepareStatement(query);
		    preparedStmt.setString(1, updatedInvObj.getInvoiceStatus());
		    preparedStmt.setLong(2,updatedInvObj.getId());
		    
		    preparedStmt.executeUpdate();
		}
		catch (Exception e) {
			logErrorAndContinue(msg +" failed", e);
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
	
	public Invoice findInvoice(long id){
		
		Invoice invoice = new Invoice();
		
		Connection conn = null;
		ResultSet rs = null;
		String msg = "InvoiceJDBC : findInvoice("+id+")";
		try {
			
			DBConnection obj = new DBConnection();
	      	conn = obj.connectToDB();
	      	
	      	if(conn == null){
	      		log().warn("DB Connection is null. So aborting further operations");
	      		return invoice;
	      	}
	      	
	      	String query = "SELECT * FROM invoice WHERE id = ?";
	     
	      	PreparedStatement ps = conn.prepareStatement(query);
	        ps.setLong(1, id);
	        
	        rs = ps.executeQuery();
	      	
	      	if (rs.next())
	      	{
	      		invoice.setId(rs.getLong("id"));
	      		invoice.setPayment(invoice.getPayment());
	      		invoice.setInvoiceNumber(rs.getString("invoice_number"));
	      		invoice.setIssueDate(rs.getTimestamp("issue_date"));
	      		invoice.setInvoiceStatus(rs.getString("invoice_status"));
		    }
	      	
		}
		catch (Exception e) {
			logErrorAndContinue(msg +" failed", e);
		}
		
		finally{
			try {
				conn.close();
				rs.close();
				log().debug("DB Connection closed");
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return invoice;
	}

}
