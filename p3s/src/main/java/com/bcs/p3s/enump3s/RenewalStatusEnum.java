package com.bcs.p3s.enump3s;


/**
 * This is the Higher-level Status. i.e. has In-Progress value
 * 
 * Note: SHOW_PRICE & TOO_LATE would never be displayed to the user
 */
public class RenewalStatusEnum extends P3SAbstractEnum {

    public static final String RENEWAL_IN_PLACE			= "Renewal in place"; 
    public static final String SHOW_PRICE				= "Show price";
    public static final String PAYMENT_IN_PROGRESS		= "Payment in progress";
    public static final String EPO_INSTRUCTED           = "EPO Instructed";
    //public static final String ABANDONED				= "Abandoned"; // No longer supported
    /**
     * TOO_LATE means customer CAN RENEW for the current patent year. But not online; they will be provided with a contact of our partner company
     * WAY_TOO_LATE means customer CANNOT RENEW for the current patent year
     */
    public static final String TOO_LATE					= "Too late to renew";
    public static final String WAY_TOO_LATE				= "Way too late to renew";
    public static final String NO_RENEWAL_NEEDED= "No renewal needed";



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

        if (status.equalsIgnoreCase(RenewalStatusEnum.PAYMENT_IN_PROGRESS)
                || status.equalsIgnoreCase("PAYMENT IN PROGRESS") 
                || status.equalsIgnoreCase("IN_PROGRESS") 
        		|| status.equalsIgnoreCase("IN PROGRESS"))// support variants for oct2018 rename IN_PROGRESS to PAYMENT_IN_PROGRESS 
        			sofar = RenewalStatusEnum.PAYMENT_IN_PROGRESS;  
        
        if (status.equalsIgnoreCase(RenewalStatusEnum.EPO_INSTRUCTED)
                || status.equalsIgnoreCase("EPO_INSTRUCTED")) 
        			sofar = RenewalStatusEnum.EPO_INSTRUCTED;  

//        if (status.equalsIgnoreCase(RenewalStatusEnum.ABANDONED) 
//            || status.equalsIgnoreCase("ABANDONED")) 
//        			sofar = RenewalStatusEnum.ABANDONED;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.TOO_LATE) 
            || status.equalsIgnoreCase("TOO_LATE")) 
        			sofar = RenewalStatusEnum.TOO_LATE;  
        
        if (status.equalsIgnoreCase(RenewalStatusEnum.WAY_TOO_LATE) 
                || status.equalsIgnoreCase("WAY_TOO_LATE")) 
            			sofar = RenewalStatusEnum.WAY_TOO_LATE;  

        if (status.equalsIgnoreCase(RenewalStatusEnum.NO_RENEWAL_NEEDED) 
            || status.equalsIgnoreCase("NO_RENEWAL_NEEDED")) 
        			sofar = RenewalStatusEnum.NO_RENEWAL_NEEDED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("RenewalStatusEnum constructor passed invalid status: "+status);
        }
    }

    
    
    public static boolean isInProgress(RenewalStatusEnum status) {
    	return (PAYMENT_IN_PROGRESS.equals(status) || EPO_INSTRUCTED.equals(status));
    }
    public static boolean isInProgress(String asString) {
    	RenewalStatusEnum renewalStatusEnum = new RenewalStatusEnum(asString);
    	return isInProgress(renewalStatusEnum);
    }
    
}
