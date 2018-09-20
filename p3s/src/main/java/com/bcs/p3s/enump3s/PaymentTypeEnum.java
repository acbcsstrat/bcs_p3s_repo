package com.bcs.p3s.enump3s;

public class PaymentTypeEnum extends P3SAbstractEnum {

    public static final String STANDARD_PAYMENT			= "Standard Payment"; 
    public static final String PENALTY_PAYMENT			= "Penalty Payment";


    // Constructor - Which verifies the value provided
    public PaymentTypeEnum(String paymentType)  
    {
        if (paymentType==null) fail("PaymentTypeEnum constructor passed null");

        String sofar = null;
        
        if (paymentType.equalsIgnoreCase(PaymentTypeEnum.STANDARD_PAYMENT)
            || paymentType.equalsIgnoreCase("STANDARD_PAYMENT")
            || paymentType.equalsIgnoreCase("STANDARD PAYMENT")) 
        			sofar = PaymentTypeEnum.STANDARD_PAYMENT;  

        if (paymentType.equalsIgnoreCase(PaymentTypeEnum.PENALTY_PAYMENT)
            || paymentType.equalsIgnoreCase("PENALTY_PAYMENT")
            || paymentType.equalsIgnoreCase("PENALTY PAYMENT")) 
        			sofar = PaymentTypeEnum.PENALTY_PAYMENT;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("PaymentTypeEnum constructor passed invalid status: "+paymentType);
        }
    }

}

