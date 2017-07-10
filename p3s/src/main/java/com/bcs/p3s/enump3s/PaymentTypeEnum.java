package com.bcs.p3s.enump3s;

public class PaymentTypeEnum extends P3SAbstractEnum {

    public static final String BANK_TRANSFER			= "Bank Transfer"; 
    public static final String CARD_PAYMENT				= "Card Payment";
    public static final String PENALTY_TRANSACTION		= "Penalty Transaction";

    // Yes - is an oddity here. If client pays a penalty, we may not know which paymentType they used!


    // Constructor - Which verifies the value provided
    public PaymentTypeEnum(String paymentType)  
    {
        if (paymentType==null) fail("PaymentTypeEnum constructor passed null");

        String sofar = null;
        
        if (paymentType.equalsIgnoreCase(PaymentTypeEnum.BANK_TRANSFER)
         || paymentType.equalsIgnoreCase("BANK_TRANSFER")) 
        			sofar = PaymentTypeEnum.BANK_TRANSFER;  

        if (paymentType.equalsIgnoreCase(PaymentTypeEnum.CARD_PAYMENT) 
            || paymentType.equalsIgnoreCase("CARD_PAYMENT")) 
        			sofar = PaymentTypeEnum.CARD_PAYMENT;  

        if (paymentType.equalsIgnoreCase(PaymentTypeEnum.PENALTY_TRANSACTION)
                || paymentType.equalsIgnoreCase("PENALTY_TRANSACTION")) 
        			sofar = PaymentTypeEnum.PENALTY_TRANSACTION;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("PaymentTypeEnum constructor passed invalid status: "+paymentType);
        }
    }

}

