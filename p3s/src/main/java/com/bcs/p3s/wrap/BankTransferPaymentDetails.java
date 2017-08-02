package com.bcs.p3s.wrap;

import com.bcs.p3s.display.PatentUI;

/**
 * We don't yet know what items will appear here, or how many, let alone their values
 * so encapsulate in its own class & provide dummy values
 * @author andyc  1st August 2017
 */
public class BankTransferPaymentDetails {

	protected String accountNumber;
	protected String item1;
	protected String item2;
	protected String item3;

	
	
	
	public String getAccountNumber() {
		return accountNumber;
	}
	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	public String getItem1() {
		return item1;
	}
	public void setItem1(String item1) {
		this.item1 = item1;
	}
	public String getItem2() {
		return item2;
	}
	public void setItem2(String item2) {
		this.item2 = item2;
	}
	public String getItem3() {
		return item3;
	}
	public void setItem3(String item3) {
		this.item3 = item3;
	}
	
	
	// convenience, for debugging & logging
	public String toString() {
		String CRLF = "\n";
		String tos = "   BankTransferPaymentDetails is:"+CRLF;
		tos += accountNumber+CRLF;
		tos += item1+CRLF;
		tos += item2+CRLF;
		tos += item3+CRLF;
		return tos;
	}
	
}
