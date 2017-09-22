package com.bcs.p3s.enump3s;


//	Values sent by Moneycorp (Which is a subset of these values) are
//	-	awaitingfunds		Formerly Awaiting Funds and Pending
//	-	fundsreceived		Formerly Funds Received
//	-	fundssent			Formerly Funds Sent
//	-	eporeceived			Formerly EPO Received
// For now, ALL former values are accepted


public class PaymentStatusEnum extends P3SAbstractEnum {

	public static final String INITIATED = "Initiated";

	
	public static final String AWAITING_FUNDS = "awaitingfunds"; 
	public static final String FUNDS_RECEIVED = "fundsreceived";
	public static final String FUNDS_SENT = "fundssent";
	public static final String EPO_RECEIVED = "eporeceived";
	public static final String EPO_INSTRUCTED = "EPO Instructed";
	//public static final String FAILED = "Failed"; // AC 170830 Payment:hasFailed makes this redundant
	public static final String COMPLETED = "Completed";

	// Yes - is an oddity here. If client pays a penalty, we may not know which
	// status they used!

	// Constructor - Which verifies the value provided
	public PaymentStatusEnum(String status) {
		if (status == null)
			fail("PaymentStatusEnum constructor passed null");

		String sofar = null;

		if (status.equalsIgnoreCase(PaymentStatusEnum.INITIATED) || status.equalsIgnoreCase("INITIATED"))
			sofar = PaymentStatusEnum.INITIATED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.AWAITING_FUNDS) || status.equalsIgnoreCase("AWAITING_FUNDS"))
			sofar = PaymentStatusEnum.AWAITING_FUNDS;

		if (status.equalsIgnoreCase(PaymentStatusEnum.FUNDS_RECEIVED) || status.equalsIgnoreCase("FUNDS_RECEIVED"))
			sofar = PaymentStatusEnum.FUNDS_RECEIVED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.FUNDS_SENT) || status.equalsIgnoreCase("FUNDS_SENT"))
			sofar = PaymentStatusEnum.FUNDS_SENT;

		if (status.equalsIgnoreCase(PaymentStatusEnum.EPO_RECEIVED) || status.equalsIgnoreCase("EPO_RECEIVED"))
			sofar = PaymentStatusEnum.EPO_RECEIVED;

		if (status.equalsIgnoreCase(PaymentStatusEnum.EPO_INSTRUCTED) || status.equalsIgnoreCase("EPO_INSTRUCTED"))
			sofar = PaymentStatusEnum.EPO_INSTRUCTED;

		//if (status.equalsIgnoreCase(PaymentStatusEnum.FAILED) || status.equalsIgnoreCase("FAILED"))
		//	sofar = PaymentStatusEnum.FAILED;

		
		
		
		// Start of Legacy / Redundant option - to be removed as soon as redundant values no longer exist
		if (status.equalsIgnoreCase("PENDING") || status.equalsIgnoreCase("Awaiting Funds") || status.equalsIgnoreCase("Awaiting_Funds"))
			sofar = PaymentStatusEnum.AWAITING_FUNDS;

		if (status.equalsIgnoreCase("Funds Received") || status.equalsIgnoreCase("Funds_Received"))
			sofar = PaymentStatusEnum.FUNDS_RECEIVED;
		
		if (status.equalsIgnoreCase("Funds Sent") || status.equalsIgnoreCase("Funds_Sent"))
			sofar = PaymentStatusEnum.FUNDS_SENT;
		
		if (status.equalsIgnoreCase("EPO Received") || status.equalsIgnoreCase("EPO_Received"))
			sofar = PaymentStatusEnum.EPO_RECEIVED;
		// End of Legacy / Redundant option - to be removed as soon a 'Pending' is removed from all dBs. // acToDo 01-sep-2017
		
		
		
		
		
		if (status.equalsIgnoreCase(PaymentStatusEnum.COMPLETED) || status.equalsIgnoreCase("COMPLETED"))
			sofar = PaymentStatusEnum.COMPLETED;

		if (sofar != null) {
			this.value = sofar.toString();
		} else {
			fail("PaymentStatusEnum constructor passed invalid status: " + status);
		}
	}

}
