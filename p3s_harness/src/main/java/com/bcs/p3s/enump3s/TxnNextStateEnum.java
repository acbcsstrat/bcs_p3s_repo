package com.bcs.p3s.enump3s;

import java.util.ArrayList;
import java.util.List;

// reuse PaymentStatusEnum


public class TxnNextStateEnum extends P3SAbstractEnum {

	public static final String AWAITING_FUNDS 		= "MC: Awaiting Funds";
	public static final String FUNDS_RECEIVED 		= "MC: Funds Received (Amount OK)";
	public static final String FUNDS_OVERPAID 		= "MC: Funds Received (Overpaid)";
	public static final String FUNDS_SENT 			= "MC: Funds Sent";
	public static final String EPO_RECEIVED 		= "MC: EPO Received";
	public static final String NOTRECEIVED 			= "MC: No Payment received";
	public static final String INSUFFICIENT_FUNDS 	= "MC: Insufficient funds";
	public static final String UNKNOWN_PAYMENT 		= "MC: Unexpected payment";
	public static final String EPO_INSTRUCTED 		= "P3S: EPO Instructed";
	public static final String EPO_RENEWAL_COMPLETE	= "EPO: EPO Renewal complete";
	public static final String PENALTY_PAID			= "Cust: Penalty Paid";

	
	
	
    // Constructor - Which verifies the value provided
    public TxnNextStateEnum(String instruction)  
    {
        if (instruction==null) fail("TxnNextStateEnum constructor passed null");

        String sofar = null;
        
        if (instruction.equalsIgnoreCase(TxnNextStateEnum.AWAITING_FUNDS)
                || instruction.equalsIgnoreCase("AWAITING_FUNDS")) 
               			sofar = TxnNextStateEnum.AWAITING_FUNDS;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.FUNDS_RECEIVED)
                || instruction.equalsIgnoreCase("FUNDS_RECEIVED")) 
               			sofar = TxnNextStateEnum.FUNDS_RECEIVED;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.FUNDS_OVERPAID)
                || instruction.equalsIgnoreCase("FUNDS_OVERPAID")) 
               			sofar = TxnNextStateEnum.FUNDS_OVERPAID;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.FUNDS_SENT)
                || instruction.equalsIgnoreCase("FUNDS_SENT")) 
               			sofar = TxnNextStateEnum.FUNDS_SENT;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.EPO_RECEIVED)
                || instruction.equalsIgnoreCase("EPO_RECEIVED")) 
               			sofar = TxnNextStateEnum.EPO_RECEIVED;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.NOTRECEIVED)
                || instruction.equalsIgnoreCase("NOTRECEIVED")) 
               			sofar = TxnNextStateEnum.NOTRECEIVED;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.INSUFFICIENT_FUNDS)
                || instruction.equalsIgnoreCase("INSUFFICIENT_FUNDS")) 
               			sofar = TxnNextStateEnum.INSUFFICIENT_FUNDS;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.UNKNOWN_PAYMENT)
                || instruction.equalsIgnoreCase("UNKNOWN_PAYMENT")) 
               			sofar = TxnNextStateEnum.UNKNOWN_PAYMENT;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.EPO_RECEIVED)
                || instruction.equalsIgnoreCase("EPO_RECEIVED")) 
               			sofar = TxnNextStateEnum.EPO_RECEIVED;  

        if (instruction.equalsIgnoreCase(TxnNextStateEnum.EPO_RECEIVED)
                || instruction.equalsIgnoreCase("EPO_RECEIVED")) 
               			sofar = TxnNextStateEnum.EPO_RECEIVED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("TxnNextStateEnum constructor passed invalid value: "+instruction);
        }
    }

    
    
    
    
	static public List<String> getNextStateValues() {
		List<String> vals = new ArrayList<String>();
		vals.add(TxnNextStateEnum.AWAITING_FUNDS);
		vals.add(TxnNextStateEnum.FUNDS_RECEIVED);
		vals.add(TxnNextStateEnum.FUNDS_OVERPAID);
		vals.add(TxnNextStateEnum.FUNDS_SENT);
		vals.add(TxnNextStateEnum.EPO_RECEIVED);
		vals.add(TxnNextStateEnum.NOTRECEIVED);
		vals.add(TxnNextStateEnum.INSUFFICIENT_FUNDS);
		vals.add(TxnNextStateEnum.UNKNOWN_PAYMENT);
		vals.add(TxnNextStateEnum.EPO_INSTRUCTED);
		vals.add(TxnNextStateEnum.EPO_RENEWAL_COMPLETE);
		vals.add(TxnNextStateEnum.PENALTY_PAID);
		return vals;
	}
	
	
	
}
