package com.bcs.p3s.sftp.moneycorp.model;

import java.util.ArrayList;

import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.sftp.moneycorp.MoneycorpPaymentStatusEnum;
import com.bcs.p3s.util.lang.Universal;

/**
 * POJO for a Transaction Status message from Moneycorp
 *
 */
public class TransactionStatus extends Universal implements MoneycorpSftpPojo {

	
	protected String patentPlaceRef;

	protected String moneycorpRef;
	
	protected String status;
	
	protected String ccy1AmountProvided;
	
	protected String moneycorpTimestamp;

	protected String failMessage;

	protected String incomingRef;

	protected boolean transactionHasFailed = false;
	

	// Special getter
	public boolean hasFailed() {
		return (notEmpty(failMessage) || 
				(new MoneycorpPaymentStatusEnum(status)).isBad()
			); // Can trust this. Already validated by parser.
	}
	
	// Regular Getters & Setters
	public String getPatentPlaceRef() {
		return patentPlaceRef;
	}

	public void setPatentPlaceRef(String patentPlaceRef) {
		this.patentPlaceRef = patentPlaceRef;
	}

	public String getMoneycorpRef() {
		return moneycorpRef;
	}

	public void setMoneycorpRef(String moneycorpRef) {
		this.moneycorpRef = moneycorpRef;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCcy1AmountProvided() {
		return ccy1AmountProvided;
	}

	public void setCcy1AmountProvided(String ccy1AmountProvided) {
		this.ccy1AmountProvided = ccy1AmountProvided;
	}

	public String getMoneycorpTimestamp() {
		return moneycorpTimestamp;
	}

	public void setMoneycorpTimestamp(String moneycorpTimestamp) {
		this.moneycorpTimestamp = moneycorpTimestamp;
	}

	public String getFailMessage() {
		return failMessage;
	}

	public void setFailMessage(String failMessage) {
		this.failMessage = failMessage;
	}

	public String getIncomingRef() {
		return incomingRef;
	}

	public void setIncomingRef(String incomingRef) {
		this.incomingRef = incomingRef;
	}

	public String[] getLabel() {
		return label;
	}

	public void setLabel(String[] label) {
		this.label = label;
	}

	public boolean isTransactionHasFailed() {
		return transactionHasFailed;
	}

	public void setTransactionHasFailed(boolean transactionHasFailed) {
		this.transactionHasFailed = transactionHasFailed;
	}
	
	
	
	protected String[] label = { 
			"PPKey", 
			"MCPayRef", 
			"MCStatus", 
			"CCY1AmountProvided", 
			"CreatedOn",
			"FailMessage", 
			"IncomingRef"
	};
	
	
	public String toString() {
		String CRLF = "\r\n";
		String str = "Transaction Status content is:";
		str = str + CRLF + label[0] + " = " + this.getPatentPlaceRef();
		str = str + CRLF + label[1] + " = " + this.getMoneycorpRef();
		str = str + CRLF + label[2] + " = " + this.getStatus();
		str = str + CRLF + label[3] + " = " + this.getCcy1AmountProvided();
		str = str + CRLF + label[4] + " = " + this.getMoneycorpTimestamp();
		str = str + CRLF + label[5] + " = " + this.getFailMessage();
		str = str + CRLF + label[6] + " = " + this.getIncomingRef(); 
		return str;
	}
	
	// AC: This never tested. Not needed (May be useful sometime..)
	public ArrayList<String> toFormettedOutput() {
		ArrayList<String> op = new ArrayList<String>(label.length + 1);
		StringBuffer line1buff = new StringBuffer(label[0]);
		for (int ii=1; ii<(label.length+0); ii++) {
			line1buff.append(',');
			line1buff.append(label[ii]);
		}
		op.add(line1buff.toString());

		StringBuffer line2buff = new StringBuffer("");
		line2buff.append(this.getPatentPlaceRef());
		line2buff.append(','+this.getMoneycorpRef());
		line2buff.append(','+this.getStatus());
		line2buff.append(','+this.getCcy1AmountProvided());
		line2buff.append(','+this.getMoneycorpTimestamp());
		line2buff.append(','+this.getFailMessage());
		line2buff.append(','+this.getIncomingRef()); 
		op.add(line2buff.toString());

		return op;
	}
}
