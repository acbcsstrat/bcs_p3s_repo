package com.bcs.p3s.enump3s;

import com.bcs.p3s.util.lang.Universal;

public class RenewalColourEnum extends Universal {

    public static final String GREEN = "Green";
    public static final String AMBER = "Amber";
    public static final String RED   = "Red"; 
    public static final String BLUE  = "Blue";
    public static final String BROWN = "Brown";

    private String colour;


    // Constructor - Which verifies the value provided
    public RenewalColourEnum(String colour) // actmp throws P3SEnumException  
    {
                System.out.println("RenewalColourEnum constructor invoked with colour: "+colour);
                if (colour==null) fail("RenewalColourEnum constructor passed null");

                String sofar = null;
                if (colour.equalsIgnoreCase(RenewalColourEnum.GREEN)) sofar = RenewalColourEnum.GREEN;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.AMBER)) sofar = RenewalColourEnum.AMBER;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.RED)) sofar = RenewalColourEnum.RED;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.BLUE)) sofar = RenewalColourEnum.BLUE;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.BROWN)) sofar = RenewalColourEnum.BROWN;  

                if (sofar != null) {
                	this.colour = sofar.toString();
                } else {
                	fail("RenewalColourEnum constructor passed invalid colour: "+colour);
                }
    }

    
    protected void fail(String message) {
    	logInternalError().fatal(message);
    	throw new P3SEnumException(message);
    }
    
    public String toString() {
                return this.colour;
    }

}
