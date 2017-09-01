package com.bcs.p3s.enump3s;

public class PaymentStatusEnum extends P3SAbstractEnum {

	public static final String INITIATED = "Initiated";

	
//obs public static final String PENDING = "Pending"; // Wouldn't 'Awaiting Funds'
	public static final String AWAITING_FUNDS = "Awaiting Funds"; // Wouldn't 'Awaiting Funds'
													// be a better title? acTidy

	
	
	
	public static final String FUNDS_RECEIVED = "Funds Received";
	public static final String FUNDS_SENT = "Funds Sent";
	public static final String EPO_RECEIVED = "EPO Received";
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

		// Start of Legacy / Redundant option - to be removed as soon a 'Pending' is removed from all dBs. // acToDo 01-sep-2017
		// AWAITING_FUNDS was formerly known as PENDING
		if (status.equalsIgnoreCase("PENDING"))
			sofar = PaymentStatusEnum.AWAITING_FUNDS;
		// End of Legacy / Redundant option - to be removed as soon a 'Pending' is removed from all dBs. // acToDo 01-sep-2017

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

		if (status.equalsIgnoreCase(PaymentStatusEnum.COMPLETED) || status.equalsIgnoreCase("COMPLETED"))
			sofar = PaymentStatusEnum.COMPLETED;

		if (sofar != null) {
			this.value = sofar.toString();
		} else {
			fail("PaymentStatusEnum constructor passed invalid status: " + status);
		}
	}

}
