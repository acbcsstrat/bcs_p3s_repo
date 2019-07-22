package com.bcs.p3s.enump3s;

public class InvoiceStatusEnum extends P3SAbstractEnum {

    public static final String OPEN						= "Open"; 
    public static final String CLOSED					= "Closed";


    // Constructor - Which verifies the value provided
    public InvoiceStatusEnum(String status)  
    {
        if (status==null) fail("InvoiceStatusEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(InvoiceStatusEnum.OPEN)
         || status.equalsIgnoreCase("OPEN")) 
        			sofar = InvoiceStatusEnum.OPEN;  

        if (status.equalsIgnoreCase(InvoiceStatusEnum.CLOSED) 
            || status.equalsIgnoreCase("CLOSED")) 
        			sofar = InvoiceStatusEnum.CLOSED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("InvoiceStatusEnum constructor passed invalid status: "+status);
        }
    }

}

