package com.bcs.p3s.wrap;

import com.bcs.p3s.display.PatentUI;

/**
 * Were these details to come from a configuration file (or any other variable source) this would be, by far,
 * the MOST desirable hack target in the entire system. For now, make safe by making it immutable. Values are hardcoded here.
 * @author andyc  6th November 2017
 */
public final class BankTransferPaymentDetails {

	protected String accountNumber;
	protected String item1;
	protected String item2;
	protected String item3;

	public BankTransferPaymentDetails() {
		accountNumber = "12345679";
		item1 = "ABA_Bk4_Brch146";
		item2 = "item2";
		item3 = "item3";
		
	}
	

	
	// Setters commented out for safety
	
	public String getAccountNumber() {
		return accountNumber;
	}
	public String getItem1() {
		return item1;
	}
	public String getItem2() {
	return item2;
}
	public String getItem3() {
		return item3;
	}

//	public void setAccountNumber(String accountNumber) {
//		this.accountNumber = accountNumber;
//	}
//	public void setItem1(String item1) {
//		this.item1 = item1;
//	}
//	public void setItem2(String item2) {
//		this.item2 = item2;
//	}
//	public void setItem3(String item3) {
//		this.item3 = item3;
//	}
	
	
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
