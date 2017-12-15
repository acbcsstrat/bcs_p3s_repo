package com.bcs.p3s.enump3s;

/**
 * FailCodes - as defined in the MoneyCorp API v13
 */
public class McFailCodeEnum extends P3SAbstractEnum {

    public static final String TOOLATE = "toolate";
    public static final String INSUFFICIENTFUNDS = "insufficientfunds";
    public static final String OTHER = "other"; 


    // Constructor - Which verifies the value provided
    public McFailCodeEnum(String failcode)  
    {
                if (failcode==null) fail("McFailCodeEnum constructor passed null");

                String sofar = null;
                if (failcode.equalsIgnoreCase(McFailCodeEnum.TOOLATE)) sofar = McFailCodeEnum.TOOLATE;  
                if (failcode.equalsIgnoreCase(McFailCodeEnum.INSUFFICIENTFUNDS)) sofar = McFailCodeEnum.INSUFFICIENTFUNDS;  
                if (failcode.equalsIgnoreCase(McFailCodeEnum.OTHER)) sofar = McFailCodeEnum.OTHER;  

                if (sofar != null) {
                	this.value = sofar;
                } else {
                	fail("McFailCodeEnum constructor passed invalid failcode: "+failcode);
                }
    }

    
    public String toCustomerFacingString() {
    	String msg = "Transaction Failed";
    	if (TOOLATE.equals(this.value)) msg = "Funds did not arrive by the agreed time";
    	if (INSUFFICIENTFUNDS.equals(this.value)) msg = "Funds arrived but were less than the agreed amount";
    	return msg;
    }
    
}
