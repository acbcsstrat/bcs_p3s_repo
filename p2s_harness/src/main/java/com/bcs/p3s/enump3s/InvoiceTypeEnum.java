package com.bcs.p3s.enump3s;

public class InvoiceTypeEnum extends P3SAbstractEnum {

    public static final String PROFORMA					= "Proforma"; 
    public static final String FINAL					= "Final";
    public static final String PENALTY					= "Penalty"; 


    // Constructor - Which verifies the value provided
    public InvoiceTypeEnum(String status)  
    {
        if (status==null) fail("InvoiceTypeEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(InvoiceTypeEnum.PROFORMA)
         || status.equalsIgnoreCase("PROFORMA")) 
        			sofar = InvoiceTypeEnum.PROFORMA;  

        if (status.equalsIgnoreCase(InvoiceTypeEnum.FINAL) 
                || status.equalsIgnoreCase("FINAL")) 
            			sofar = InvoiceTypeEnum.FINAL;  

        if (status.equalsIgnoreCase(InvoiceTypeEnum.PENALTY) 
                || status.equalsIgnoreCase("PENALTY")) 
            			sofar = InvoiceTypeEnum.PENALTY;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("InvoiceTypeEnum constructor passed invalid status: "+status);
        }
    }

}

