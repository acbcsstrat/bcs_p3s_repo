package com.bcs.p3s.model;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.bcs.p3s.enump3s.PaymentStatusEnum;

public class Txn {

	
	private String counter;  
	private String email;  
	private String fname;
	private String lname;
	private String p3sref;
	private String createdate;
	private String numpatents;
	private String status;
	private String next; 

	
	
	public Txn(Payment pay, int count) {
		P3SUser user = pay.getInitiatedByUserId();
		this.counter = ""+count;
		this.email = user.getEmailAddress();
		this.fname = user.getFirstName();
		this.lname = user.getLastName();
		this.p3sref = pay.getP3S_TransRef();

		Date dteCreated = pay.getTransStartDate();
		SimpleDateFormat format = new SimpleDateFormat("dd-MMM-yyyy hh:mm:ss");
		this.createdate = format.format(dteCreated);
		
		this.numpatents = ""+pay.getRenewals().size()+", "+pay.getEpcts().size();
		
		this.status = pay.getMC_failCode();
		if (this.status==null) {
			PaymentStatusEnum paystatus = new PaymentStatusEnum(pay.getLatestTransStatus());
			this.status = paystatus.toString();
		}
	
	
	}

	
	
	


	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getFname() {
		return fname;
	}



	public void setFname(String fname) {
		this.fname = fname;
	}



	public String getLname() {
		return lname;
	}



	public void setLname(String lname) {
		this.lname = lname;
	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	public String getP3sref() {
		return p3sref;
	}



	public void setP3sref(String p3sref) {
		this.p3sref = p3sref;
	}



	public String getCreatedate() {
		return createdate;
	}



	public void setCreatedate(String createdate) {
		this.createdate = createdate;
	}



	public String getNext() {
		return next;
	}



	public void setNext(String next) {
		this.next = next;
	}






	public String getNumpatents() {
		return numpatents;
	}






	public void setNumpatents(String numpatents) {
		this.numpatents = numpatents;
	}






	public String getCounter() {
		return counter;
	}






	public void setCounter(String counter) {
		this.counter = counter;
	}

	
	
	
}
