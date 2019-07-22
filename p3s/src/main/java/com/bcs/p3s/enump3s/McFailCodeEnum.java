package com.bcs.p3s.enump3s;

/**
 * FailCodes - as defined in the MoneyCorp API v13
 */
public class McFailCodeEnum extends P3SAbstractEnum {

	
	// acToDo - investigate McFailCodeEnum - isnt this made redundant by MoneycorpPaymentStatusEnum - Tho latter not exist in web

	
	
    public static final String NOTRECEIVED = "notreceived";
    public static final String INSUFFICIENTFUNDS = "insufficientfunds";
    public static final String OTHERFAIL = "otherfail"; 

    // Previously, ...
    // public static final String TOOLATE = "toolate"; 180207 renamed to NOTRECEIVED 
    // public static final String OTHER = "other"; 180207 renamed to OTHERFAIL


    // Constructor - Which verifies the value provided
    public McFailCodeEnum(String failcode)  
    {
                if (failcode==null) fail("McFailCodeEnum constructor passed null");

                String sofar = null;
                if (failcode.equalsIgnoreCase(McFailCodeEnum.NOTRECEIVED)) sofar = McFailCodeEnum.NOTRECEIVED;  
                if (failcode.equalsIgnoreCase(McFailCodeEnum.INSUFFICIENTFUNDS)) sofar = McFailCodeEnum.INSUFFICIENTFUNDS;  
                if (failcode.equalsIgnoreCase(McFailCodeEnum.OTHERFAIL)) sofar = McFailCodeEnum.OTHERFAIL;  

                if (sofar != null) {
                	this.value = sofar;
                } else {
                	fail("McFailCodeEnum constructor passed invalid failcode: "+failcode);
                }
    }

    
    public String toCustomerFacingString() {
    	String msg = "Transaction Failed";
    	if (NOTRECEIVED.equals(this.value)) msg = "Funds did not arrive by the agreed time";
    	if (INSUFFICIENTFUNDS.equals(this.value)) msg = "Funds arrived but were less than the agreed amount";
    	return msg;
    }
    
}
