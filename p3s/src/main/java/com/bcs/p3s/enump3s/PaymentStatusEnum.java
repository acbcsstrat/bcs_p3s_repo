package com.bcs.p3s.enump3s;

//Values sent by Moneycorp (Which is a subset of these values) are
//-	awaitingfunds		Formerly Awaiting Funds and Pending
//-	fundsreceived		Formerly Funds Received
//-	fundssent			Formerly Funds Sent
//-	eporeceived			Formerly EPO Received
// However, below values (with space) are required by front end, so must remain
// so incoming Moneycorp values will be translated


// For now, ALL former values are accepted


public class PaymentStatusEnum extends P3SAbstractEnum {

	// P3S Payment Status values
	public static final String INITIATED = "Initiated";
	public static final String AWAITING_FUNDS = "Awaiting Funds";
	public static final String FUNDS_RECEIVED = "Funds Received";
	public static final String FUNDS_SENT = "Funds Sent";
	public static final String EPO_RECEIVED = "EPO Received";
	public static final String INSTRUCTING_EPO = "Instructing EPO";  	// added for EPO Automation
	public static final String EPO_INSTRUCTED = "EPO Instructed";
	//public static final String FAILED = "Failed"; // AC 170830 Payment:hasFailed makes this redundant
	public static final String COMPLETED = "Completed";

	// Yes - MAY BE (in future) an oddity here (with Moneycorp interface). If client pays a penalty, we may not know which
	// status they used!

	// Moneycorp status values
	public static final String MONEYCORP_AWAITING_FUNDS = "awaitingfunds"; 
	public static final String MONEYCORP_FUNDS_RECEIVED = "fundsreceived";
	public static final String MONEYCORP_FUNDS_SENT = "fundssent";
	public static final String MONEYCORP_EPO_RECEIVED = "eporeceived";
	
	
	
	// Constructor - Which verifies the value provided
	public PaymentStatusEnum(String status) {
		if (status == null)
			fail("PaymentStatusEnum constructor passed null");

		String sofar = null;

		if (status.equalsIgnoreCase(PaymentStatusEnum.INITIATED) || status.equalsIgnoreCase("INITIATED"))
					sofar = PaymentStatusEnum.INITIATED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.AWAITING_FUNDS) || status.equalsIgnoreCase("AWAITING_FUNDS")
		 || status.equalsIgnoreCase(PaymentStatusEnum.MONEYCORP_AWAITING_FUNDS))
					sofar = PaymentStatusEnum.AWAITING_FUNDS;

		if (status.equalsIgnoreCase(PaymentStatusEnum.FUNDS_RECEIVED) || status.equalsIgnoreCase("FUNDS_RECEIVED")
		 || status.equalsIgnoreCase(PaymentStatusEnum.MONEYCORP_FUNDS_RECEIVED))
					sofar = PaymentStatusEnum.FUNDS_RECEIVED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.FUNDS_SENT) || status.equalsIgnoreCase("FUNDS_SENT")
		 || status.equalsIgnoreCase(PaymentStatusEnum.MONEYCORP_FUNDS_SENT))
					sofar = PaymentStatusEnum.FUNDS_SENT;

		if (status.equalsIgnoreCase(PaymentStatusEnum.EPO_RECEIVED) || status.equalsIgnoreCase("EPO_RECEIVED")
		 || status.equalsIgnoreCase(PaymentStatusEnum.MONEYCORP_EPO_RECEIVED))
					sofar = PaymentStatusEnum.EPO_RECEIVED;
		
		if (status.equalsIgnoreCase(PaymentStatusEnum.INSTRUCTING_EPO) || status.equalsIgnoreCase("INSTRUCTING_EPO"))
							sofar = PaymentStatusEnum.INSTRUCTING_EPO;
		
		if (status.equalsIgnoreCase(PaymentStatusEnum.EPO_INSTRUCTED) || status.equalsIgnoreCase("EPO_INSTRUCTED"))
					sofar = PaymentStatusEnum.EPO_INSTRUCTED;

		//if (status.equalsIgnoreCase(PaymentStatusEnum.FAILED) || status.equalsIgnoreCase("FAILED"))
		//	sofar = PaymentStatusEnum.FAILED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.COMPLETED) || status.equalsIgnoreCase("COMPLETED"))
					sofar = PaymentStatusEnum.COMPLETED;

		
		
		// Start of Legacy / Redundant option - to be removed as soon a 'Pending' is removed from all dBs. 01-sep-2017.  190627 Update: Must be safe by now
		// AWAITING_FUNDS was formerly known as PENDING
			//if (status.equalsIgnoreCase("PENDING"))
			//			sofar = PaymentStatusEnum.AWAITING_FUNDS;
		// End of Legacy / Redundant option - to be removed as soon a 'Pending' is removed from all dBs. 


		
	
		if (sofar != null) {
			this.value = sofar.toString();
		} else {
			fail("PaymentStatusEnum constructor passed invalid status: " + status);
		}
	}

}
