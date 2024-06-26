package com.bcs.p3s.wrap;


/**
 * Were these details to come from a configuration file (or any other variable source) this would be, by far,
 * the MOST desirable hack target in the entire system. For now, make safe by making it immutable. Values are hardcoded here.
 * @author andyc  14th Feb 2018
 */
public final class BankTransferPaymentDetails {


	
	private String account1Type;
	private String account1BranchCode;
	private String account1Number;
	private String account1field1;
	private String account1field2;
	
	private String account2Type;
	private String account2BranchCode;
	private String account2Number;
	private String account2field1;
	private String account2field2;
	

	public BankTransferPaymentDetails() {

		account1Type = "ACH";
		account1BranchCode = "026073150";
		account1Number = "2715100256";
		account1field1 = "Community Federal Savings Bank, New York, NY";
		account1field2 = "";

		//account2Type = "FedWire";
		account2Type = "Alternative Payment";
		account2BranchCode = "Not yet available";
		account2Number = "Not yet available";
		account2field1 = "Not yet available";
		account2field2 = "";
}

	
	public String toString() {
		String CRLF = "\n";
		String tos = "   BankTransferPaymentDetails is:"+CRLF;
		tos += account1Type+CRLF;
		tos += account1BranchCode+CRLF;
		tos += account1Number+CRLF;
		tos += account1field1+CRLF;
		tos += account1field2+CRLF;
		tos += " & "+CRLF;
		tos += account2Type+CRLF;
		tos += account2BranchCode+CRLF;
		tos += account2Number+CRLF;
		tos += account2field1+CRLF;
		tos += account2field2+CRLF;
		return tos;
	}

	
	
	// 171208 - short term bodges until frontend removes obsolete refs to these obsolete fields
	protected final String obs = "OBSOLETE_FIELD";
	public String getAccountHoldersName() { return obs; }
	public String getAccountNumber() { return obs; }
	public String getItem1() { return obs; }
	public String getItem2() { return obs; }
	
	
	
	// Getters. No setters
	
	public String getAccount1Type() {
		return account1Type;
	}
	public String getAccount1BranchCode() {
		return account1BranchCode;
	}
	public String getAccount1Number() {
		return account1Number;
	}
	public String getAccount1field1() {
		return account1field1;
	}
	public String getAccount1field2() {
		return account1field2;
	}
	public String getAccount2Type() {
		return account2Type;
	}
	public String getAccount2BranchCode() {
		return account2BranchCode;
	}
	public String getAccount2Number() {
		return account2Number;
	}
	public String getAccount2field1() {
		return account2field1;
	}
	public String getAccount2field2() {
		return account2field2;
	}


	
	
	// convenience, for debugging & logging
//	public String toString() {
//		String CRLF = "\n";
//		String tos = "   BankTransferPaymentDetails is:"+CRLF;
//		tos += accountNumber+CRLF;
//		tos += item1+CRLF;
//		tos += item2+CRLF;
//		tos += item3+CRLF;
//		return tos;
//	}
	
}
