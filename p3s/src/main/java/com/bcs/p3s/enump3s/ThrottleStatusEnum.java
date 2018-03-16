package com.bcs.p3s.enump3s;

public class ThrottleStatusEnum extends P3SAbstractEnum{
	
	public static final String GREEN						= "green"; 
    public static final String YELLOW					= "yellow";
    public static final String RED					= "red";
    public static final String BLACK					= "black";


    // Constructor - Which verifies the value provided
    public ThrottleStatusEnum(String throttleColour)  
    {
        if (throttleColour==null) fail("ThrottleStatusEnum constructor passed null");

        String sofar = null;
        
        if (throttleColour.equalsIgnoreCase(ThrottleStatusEnum.GREEN)
         || throttleColour.equalsIgnoreCase("GREEN")) 
        			sofar = ThrottleStatusEnum.GREEN;  

        if (throttleColour.equalsIgnoreCase(ThrottleStatusEnum.YELLOW) 
            || throttleColour.equalsIgnoreCase("YELLOW")) 
        			sofar = ThrottleStatusEnum.YELLOW;  
        
        if (throttleColour.equalsIgnoreCase(ThrottleStatusEnum.RED) 
                || throttleColour.equalsIgnoreCase("RED")) 
            			sofar = ThrottleStatusEnum.RED;  
        
        if (throttleColour.equalsIgnoreCase(ThrottleStatusEnum.BLACK) 
                || throttleColour.equalsIgnoreCase("BLACK")) 
            			sofar = ThrottleStatusEnum.BLACK;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("ThrottleStatusEnum constructor passed invalid status: "+throttleColour);
        }
    }

}
