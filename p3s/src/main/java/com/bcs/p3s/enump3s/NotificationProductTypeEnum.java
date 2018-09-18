package com.bcs.p3s.enump3s;

public class NotificationProductTypeEnum extends P3SAbstractEnum {
	
    public static final String RENEWAL			= "renewal"; 
    public static final String EPCT				= "epct";


    // Constructor - Which verifies the value provided
    public NotificationProductTypeEnum(String productType)  
    {
        if (productType==null) fail("NotificationProductTypeEnum constructor passed null");

        String sofar = null;
        
        if (productType.equalsIgnoreCase(NotificationProductTypeEnum.RENEWAL)
                || productType.equalsIgnoreCase("RENEWAL")) 
               			sofar = NotificationProductTypeEnum.RENEWAL;

        if (productType.equalsIgnoreCase(NotificationProductTypeEnum.EPCT)
                || productType.equalsIgnoreCase("EPCT")) 
               			sofar = NotificationProductTypeEnum.EPCT;


        if (sofar != null) {
        	this.value = sofar;
        } else {
        	fail("NotificationProductTypeEnum constructor passed invalid value: "+productType);
        }
    }

}
