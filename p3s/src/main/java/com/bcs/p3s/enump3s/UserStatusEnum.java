package com.bcs.p3s.enump3s;

public class UserStatusEnum extends P3SAbstractEnum{

	public static final String DISABLED = "disabled";
    public static final String ENABLED = "enabled";


    // Constructor - Which verifies the value provided
    public UserStatusEnum(String status)  
    {
        if (status==null) fail("UserStatusEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(UserStatusEnum.DISABLED)
         || status.equalsIgnoreCase("DISABLED")) 
        			sofar = UserStatusEnum.DISABLED;  

        if (status.equalsIgnoreCase(UserStatusEnum.ENABLED) 
                || status.equalsIgnoreCase("ENABLED")) 
            			sofar = UserStatusEnum.ENABLED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("UserStatusEnum constructor passed invalid status: "+status);
        }
    }

}