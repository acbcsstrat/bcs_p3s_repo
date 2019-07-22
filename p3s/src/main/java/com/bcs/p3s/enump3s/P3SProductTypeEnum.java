package com.bcs.p3s.enump3s;

public class P3SProductTypeEnum extends P3SAbstractEnum {

	public static final String RENEWAL				= "Renewal";  // i.e. 'our traditional' renewal of an EPO Patent. Since P3S v1
	public static final String FORM1200				= "Form1200";  // i.e. Performing E-PCT. Since P3S v2.1


    // Constructor - Which verifies the value provided
    public P3SProductTypeEnum(String status)  
    {
        if (status==null) fail("P3SProductType constructor passed null");

        String sofar = null;

        
        if (status.equalsIgnoreCase(P3SProductTypeEnum.RENEWAL)) 
            			sofar = P3SProductTypeEnum.RENEWAL;

        if (status.equalsIgnoreCase(P3SProductTypeEnum.FORM1200)
                || status.equalsIgnoreCase("FORM 1200")) 
            			sofar = P3SProductTypeEnum.FORM1200;



        
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("P3SProductType constructor passed invalid status: "+status);
        }
    }



}
