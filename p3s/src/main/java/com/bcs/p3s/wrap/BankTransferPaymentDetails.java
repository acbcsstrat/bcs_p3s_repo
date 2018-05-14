package com.bcs.p3s.wrap;


/**
 * Were these details to come from a configuration file (or any other variable source) this would be, by far,
 * the MOST desirable hack target in the entire system. For now, make safe by making it immutable. Values are hardcoded here.
 * @author andyc  14th Feb 2018
 */
public final class BankTransferPaymentDetails {


	
	private String account1PaymentType;
	private String account1BranchCode;
	private String account1AcctNumber;
	private String account1field1;
	private String account1field2;
	private String account1AcctType;
	private String account1CustomerName;
	
	private String account2PaymentType;
	private String account2BranchCode;
	private String account2AcctNumber;
	private String account2field1;
	private String account2field2;
	private String account2AcctType;
	private String account2CustomerName;
	

	// Fields becoming redundant from 180514
	private String account1Type;
	private String account2Type;
	private String account1Number;
	private String account2Number;
	// account1field1 will not be redundant, but will revert to being empty
	
	

	public BankTransferPaymentDetails() {

		account1PaymentType = "Fedwire";
		account1BranchCode = "021001033";   							// ABA // former : 026073150 
		account1Number = "04951460";   									// former : 2715100256 
		account1field1 = "Deutsche Bank Trust Company Americas"; // Bank name	// former : Community Federal Savings Bank, New York, NY 
		account1field2 = "";
		account1AcctType = "Checking";
		account1CustomerName = "Moneycorp Ltd";
		
		account2PaymentType = "ACH";
		account2BranchCode = "021001033";								// ABA
		account2Number = "04951460";
		account2field1 = "Deutsche Bank Trust Company Americas"; // Bank name
		account2field2 = "";
		account2AcctType = "Checking";
		account2CustomerName = "Moneycorp Ltd";

		// Fields becoming redundant from 180514
		account1Type = "Fedwire-O";
		account1Number = "04951460";   									// former : 2715100256 
		//account1field2 = "";
		account2Type = "ACH-O";
		account2Number = "04951460";
		//account2field1 = "Deutsche Bank Trust Company Americas"; // Bank name

		
//		account1Type = "ACH";
//		account1BranchCode = "026073150";   							// former : 026073150 
//		account1Number = "2715100256";   								// former : 2715100256 
//		account1field1 = "Community Federal Savings Bank, New York, NY";// former : Community Federal Savings Bank, New York, NY 
//		account1field2 = "";
//		account1AcctType = "zaph";
//		account1CustomerName = "zaph";
//		
//		//account2Type = "FedWire";
//		account2Type = "Alternative Payment";
//		account2BranchCode = "Not yet available";
//		account2Number = "Not yet available";
//		account2field1 = "Not yet available";
//		account2field2 = "";
//		account2AcctType = "zaph";
//		account2CustomerName = "zaph";
}

	
	public String toString() {
		String CRLF = "\n";
		String tos = "   BankTransferPaymentDetails is:"+CRLF;
		tos += account1PaymentType+CRLF;
		tos += account1BranchCode+CRLF;
		tos += account1AcctNumber+CRLF;
		tos += account1field1+CRLF;
		tos += account1field2+CRLF;
		tos += account1AcctType+CRLF;
		tos += account1CustomerName+CRLF;
		tos += " & "+CRLF;
		tos += account2PaymentType+CRLF;
		tos += account2BranchCode+CRLF;
		tos += account2AcctNumber+CRLF;
		tos += account2field1+CRLF;
		tos += account2field2+CRLF;
		tos += account2AcctType+CRLF;
		tos += account2CustomerName+CRLF;
		return tos;
	}

	
//	Whole block discontinued from 180511
//	// 171208 - short term bodges until frontend removes obsolete refs to these obsolete fields
//	protected final String obs = "OBSOLETE_FIELD";
//	public String getAccountHoldersName() { return obs; }
//	public String getAccountNumber() { return obs; }
//	public String getItem1() { return obs; }
//	public String getItem2() { return obs; }
	
	
	
	// Getters. No setters
	
	public String getAccount1PaymentType() {
		return account1Type;
	}
	public String getAccount1BranchCode() {
		return account1BranchCode;
	}
	public String getAccount1AcctNumber() {
		return account1Number;
	}
	public String getAccount1field1() {
		return account1field1;
	}
	public String getAccount1field2() {
		return account1field2;
	}
	public String getAccount1AcctType() {
		return account1AcctType;
	}
	public String getAccount1CustomerName() {
		return account1CustomerName;
	}


	
	public String getAccount2PaymentType() {
		return account2Type;
	}
	public String getAccount2BranchCode() {
		return account2BranchCode;
	}
	public String getAccount2AcctNumber() {
		return account2Number;
	}
	public String getAccount2field1() {
		return account2field1;
	}
	public String getAccount2field2() {
		return account2field2;
	}
	public String getAccount2AcctType() {
		return account2AcctType;
	}
	public String getAccount2CustomerName() {
		return account2CustomerName;
	}


	// Getters becoming redundant from 180514
	public String getAccount1Type() {
		return account1Type;
	}
	public String getAccount1Number() {
		return account1Number;
	}
	public String getAccount2Type() {
		return account2Type;
	}
	public String getAccount2Number() {
		return account2Number;
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
