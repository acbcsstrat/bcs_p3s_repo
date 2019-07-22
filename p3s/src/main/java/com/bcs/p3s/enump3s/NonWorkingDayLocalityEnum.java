package com.bcs.p3s.enump3s;

/**
 * See NonWorkingDay
 *
 */
public class NonWorkingDayLocalityEnum extends P3SAbstractEnum {

    public static final String EPO		= "EPO"; 
    public static final String US		= "US";
    public static final String UK		= "UK";


    // Constructor - Which verifies the value provided
    public NonWorkingDayLocalityEnum(String value)  
    {
        if (value==null) fail(CLASSNAME+"constructor passed null");

        String sofar = null;
        
        if (value.equalsIgnoreCase(NonWorkingDayLocalityEnum.EPO)) 
            			sofar = NonWorkingDayLocalityEnum.EPO;  

        if (value.equalsIgnoreCase(NonWorkingDayLocalityEnum.US)) 
            			sofar = NonWorkingDayLocalityEnum.US;  

        if (value.equalsIgnoreCase(NonWorkingDayLocalityEnum.UK)) 
            			sofar = NonWorkingDayLocalityEnum.UK;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail(CLASSNAME+"constructor passed invalid value: "+value);
        }
    }


}
