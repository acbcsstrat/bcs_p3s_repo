package com.bcs.p3s.enump3s;

public class RenewalColourEnum extends P3SAbstractEnum {

    public static final String GREEN = "Green";
    public static final String AMBER = "Amber";
    public static final String RED   = "Red"; 
    public static final String BLUE  = "Blue";
    public static final String BLACK = "Black";
    
    public static final String GREY = "GREY";


    // Constructor - Which verifies the value provided
    public RenewalColourEnum(String colour)  
    {
                if (colour==null) fail("RenewalColourEnum constructor passed null");

                String sofar = null;
                if (colour.equalsIgnoreCase(RenewalColourEnum.GREEN)) sofar = RenewalColourEnum.GREEN;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.AMBER)) sofar = RenewalColourEnum.AMBER;  
                if (colour.equalsIgnoreCase("Yellow")) sofar = RenewalColourEnum.AMBER;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.RED)) sofar = RenewalColourEnum.RED;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.BLUE)) sofar = RenewalColourEnum.BLUE;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.BLACK)) sofar = RenewalColourEnum.BLACK;  
                if (colour.equalsIgnoreCase(RenewalColourEnum.GREY)) sofar = RenewalColourEnum.GREY;  

            	// Start of Legacy / Redundant code. To be removed after 'brown' has been removed from all DbS
                if (colour.equalsIgnoreCase("Brown")) sofar = RenewalColourEnum.BLACK;  
                // End of Legacy / Redundant code. 

                if (sofar != null) {
                	this.value = sofar;
                } else {
                	fail("RenewalColourEnum constructor passed invalid colour: "+colour);
                }
    }

    
    /**
     * Simple repeatable test. Is the value stored in this Enum: Red or not ?
     * @return True is colour is Red.  False for any other scenario
     */
    public boolean isRed() {
    	return this.value.equals(RED);
    }
    
}
