package com.bcs.p3s.sftp.moneycorp;

import com.bcs.p3s.enump3s.P3SAbstractEnum;
import com.bcs.p3s.enump3s.PaymentStatusEnum;

//Values sent by Moneycorp are
//-	awaitingfunds		
//-	fundsreceived		
//-	fundssent			
//-	eporeceived			
//-	notreceived
//-	insufficientfunds
//- otherfail			
//-	unknownpayment


public class MoneycorpPaymentStatusEnum extends P3SAbstractEnum {

	// This is a spin-off of PaymentStatusEnum
	
	// Moneycorp status values (valid, ongoing transaction)
	public static final String MONEYCORP_AWAITING_FUNDS = "awaitingfunds"; 
	public static final String MONEYCORP_FUNDS_RECEIVED = "fundsreceived";
	public static final String MONEYCORP_FUNDS_SENT = "fundssent";
	public static final String MONEYCORP_EPO_RECEIVED = "eporeceived";
	// the failure codes
	public static final String MONEYCORP_NOTRECEIVED = "notreceived";
	public static final String MONEYCORP_INSUFFICIENTFUNDS = "insufficientfunds";
	public static final String MONEYCORP_OTHERFAIL = "otherfail";
	// & unexpected payment
	public static final String MONEYCORP_UNKNOWNPAYMENT = "unknownpayment";
	
	protected boolean isBad = false;
	
	
	// Constructor - Which verifies the value provided
	public MoneycorpPaymentStatusEnum(String status) {
		if (status == null)
			fail("MoneycorpPaymentStatusEnum constructor passed null");

		String sofar = null;

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_AWAITING_FUNDS))
					sofar = MoneycorpPaymentStatusEnum.MONEYCORP_AWAITING_FUNDS;

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_RECEIVED))
					sofar = MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_RECEIVED;

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_SENT))
					sofar = MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_SENT;

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_EPO_RECEIVED))
			sofar = MoneycorpPaymentStatusEnum.MONEYCORP_EPO_RECEIVED;


		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_NOTRECEIVED)) {
			sofar = MoneycorpPaymentStatusEnum.MONEYCORP_NOTRECEIVED;
			isBad = true;
		}

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_INSUFFICIENTFUNDS)) {
			sofar = MoneycorpPaymentStatusEnum.MONEYCORP_INSUFFICIENTFUNDS;
			isBad = true;
		}

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_OTHERFAIL)) {
			sofar = MoneycorpPaymentStatusEnum.MONEYCORP_OTHERFAIL;
			isBad = true;
		}

		if (status.equalsIgnoreCase(MoneycorpPaymentStatusEnum.MONEYCORP_UNKNOWNPAYMENT)) {
			sofar = MoneycorpPaymentStatusEnum.MONEYCORP_UNKNOWNPAYMENT;
			isBad = true;
		}

	
		if (sofar != null) {
			this.value = sofar.toString();
		} else {
			fail("MoneycorpPaymentStatusEnum constructor passed invalid status: " + status);
		}
	}


	
	public boolean isBad() {
		return isBad;
	}

	public boolean isBadAndFailMessageIsMandated() {
		if (MONEYCORP_OTHERFAIL.equals(this.value)) return true;
		return false;
	}

	/**
	 * Does this Enum have the same value as the offered Enum
	 * @return true if same
	 */
	public boolean matches(MoneycorpPaymentStatusEnum other) {
		if (other==null) return false;
		if (this.value.equals(other.value)) return true;
		return false;
	}

		
	// Convenient method - may never be needed ? - acTidy
	/** Convert this MoneycorpPaymentStatusEnum to equivalent PaymentStatusEnum **/ 
	public String mcStatusToTxnStatus() {
		if (this.value==null) return null;  // self-protect. Should never be needed

		if (MoneycorpPaymentStatusEnum.MONEYCORP_AWAITING_FUNDS.equals(value.toString())) 
			return new PaymentStatusEnum(PaymentStatusEnum.AWAITING_FUNDS).toString();

		if (MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_RECEIVED.equals(value.toString())) 
			return new PaymentStatusEnum(PaymentStatusEnum.FUNDS_RECEIVED).toString();

		if (MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_SENT.equals(value.toString())) 
			return new PaymentStatusEnum(PaymentStatusEnum.FUNDS_SENT).toString();

		if (MoneycorpPaymentStatusEnum.MONEYCORP_EPO_RECEIVED.equals(value.toString())) 
			return new PaymentStatusEnum(PaymentStatusEnum.EPO_RECEIVED).toString();

		// If a fail status is sent - PaymentStatusEnum deliberately has no Failed status. Use payment:has_failed instead. So return null. 
		if (MoneycorpPaymentStatusEnum.MONEYCORP_NOTRECEIVED .equals(value.toString())) 
			return null;
		if (MoneycorpPaymentStatusEnum.MONEYCORP_INSUFFICIENTFUNDS.equals(value.toString())) 
			return null;
		if (MoneycorpPaymentStatusEnum.MONEYCORP_OTHERFAIL.equals(value.toString())) 
			return null;

		
		fail("MoneycorpPaymentStatusEnum mcStatusToTxnStatus impossible"); return null;
	}

	
	
	
	/**
	 * Determines if a given String (e.g. filename) contains the current value, case-independent
	 */
	public boolean isContainedIn(String provided) {
		boolean match = false;
		if (isEmpty(provided) || this.value==null) return match;
		int poz = provided.toLowerCase().indexOf(this.value.toLowerCase());
		if (poz > -1) match = true;
		return match;
	}

}
