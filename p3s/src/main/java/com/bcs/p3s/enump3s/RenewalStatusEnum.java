package com.bcs.p3s.enump3s;


/**
 * This is the Higher-level Status. i.e. has In-Progress value
 * 
 * Note: SHOW_PRICE would never be displayed to the user
 */
public class RenewalStatusEnum extends P3SAbstractEnum {

    public static final String RENEWAL_IN_PLACE			= "Renewal in place"; 
    public static final String SHOW_PRICE				= "Show price";
    public static final String IN_PROGRESS				= "Payment in progress";
    public static final String EPO_INSTRUCTED           = "EPO Instructed";
    //public static final String ABANDONED				= "Abandoned"; // No longer supported
    public static final String TOO_LATE					= "Too late to renew";
    public static final String NO__RENEWAL_NEEDED= "No renewal needed";



    // Constructor - Which verifies the value provided
    public RenewalStatusEnum(String status)  
    {
        if (status==null) fail("RenewalStatusEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(RenewalStatusEnum.RENEWAL_IN_PLACE)
         || status.equalsIgnoreCase("RENEWAL_IN_PLACE")) 
        			sofar = RenewalStatusEnum.RENEWAL_IN_PLACE;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.SHOW_PRICE) 
            || status.equalsIgnoreCase("SHOW_PRICE")) 
        			sofar = RenewalStatusEnum.SHOW_PRICE;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.IN_PROGRESS)
                || status.equalsIgnoreCase("IN_PROGRESS")) 
        			sofar = RenewalStatusEnum.IN_PROGRESS;  
        
        if (status.equalsIgnoreCase(RenewalStatusEnum.EPO_INSTRUCTED)
                || status.equalsIgnoreCase("EPO_INSTRUCTED")) 
        			sofar = RenewalStatusEnum.EPO_INSTRUCTED;  

//        if (status.equalsIgnoreCase(RenewalStatusEnum.ABANDONED) 
//            || status.equalsIgnoreCase("ABANDONED")) 
//        			sofar = RenewalStatusEnum.ABANDONED;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.TOO_LATE) 
            || status.equalsIgnoreCase("TOO_LATE")) 
        			sofar = RenewalStatusEnum.TOO_LATE;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.NO__RENEWAL_NEEDED) 
            || status.equalsIgnoreCase("NO__RENEWAL_NEEDED")) 
        			sofar = RenewalStatusEnum.NO__RENEWAL_NEEDED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("RenewalStatusEnum constructor passed invalid status: "+status);
        }
    }

}
