package com.bcs.p3s.enump3s;


/**
 * This Enum class must hold a value corresponding to each row in Notification Table
 * To be extended if we are extending Notification tbl 
 */
public class NotificationNameEnum extends P3SAbstractEnum {

    public static final String GREEN_STARTS			= "Green starts"; 
    public static final String GREEN_6WEEKS_TO_GO	= "Green 6 weeks";
    public static final String GREEN_2WEEKS_TO_GO	= "Green 2 weeks";
    public static final String GREEN_1WEEK_TO_GO    = "Green 1 week";
    public static final String GREEN_2DAYS_TO_GO    = "Green 2 days";
    
    public static final String AMBER_3DAYS_TO_GO    = "Amber 3 days";
    public static final String AMBER_1DAY_TO_GO     = "Amber 1 day";
   
    //CHANCES ARE BELOW TO CHANGE TO RED_STARTS
    public static final String RED_3DAYS_TO_GO     = "Red 3 days";
    
    public static final String BLUE_STARTS			= "Blue starts"; 
    public static final String BLUE_12WEEKS_TO_GO	= "Blue 12 weeks";
    public static final String BLUE_6WEEKS_TO_GO	= "Blue 6 weeks";
    public static final String BLUE_2WEEKS_TO_GO	= "Blue 2 weeks";
    public static final String BLUE_1WEEK_TO_GO     = "Blue 1 week";
    public static final String BLUE_2DAYS_TO_GO     = "Blue 2 days";

    public static final String BLACK_STARTS			= "Black starts";
    public static final String BLACK_PHONE_UP_STARTS= "Black phone up starts";

    
    public NotificationNameEnum(String status)  
    {
        if (status==null) fail("NotificationNameEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(NotificationNameEnum.GREEN_STARTS)
         || status.equalsIgnoreCase("GREEN_STARTS")) 
        			sofar = NotificationNameEnum.GREEN_STARTS;  

        if (status.equalsIgnoreCase(NotificationNameEnum.GREEN_6WEEKS_TO_GO) 
            || status.equalsIgnoreCase("GREEN_6WEEKS_TO_GO")) 
        			sofar = NotificationNameEnum.GREEN_6WEEKS_TO_GO;  

        if (status.equalsIgnoreCase(NotificationNameEnum.GREEN_2WEEKS_TO_GO)
                || status.equalsIgnoreCase("GREEN_2WEEKS_TO_GO")) 
        			sofar = NotificationNameEnum.GREEN_2WEEKS_TO_GO;  
        
        if (status.equalsIgnoreCase(NotificationNameEnum.GREEN_1WEEK_TO_GO)
                || status.equalsIgnoreCase("GREEN_1WEEK_TO_GO")) 
        			sofar = NotificationNameEnum.GREEN_1WEEK_TO_GO;  

        if (status.equalsIgnoreCase(NotificationNameEnum.GREEN_2DAYS_TO_GO) 
            || status.equalsIgnoreCase("GREEN_2DAYS_TO_GO")) 
        			sofar = NotificationNameEnum.GREEN_2DAYS_TO_GO;  
        
        if (status.equalsIgnoreCase(NotificationNameEnum.AMBER_3DAYS_TO_GO) 
                || status.equalsIgnoreCase("AMBER_3DAYS_TO_GO")) 
            			sofar = NotificationNameEnum.AMBER_3DAYS_TO_GO;  

        if (status.equalsIgnoreCase(NotificationNameEnum.AMBER_1DAY_TO_GO) 
            || status.equalsIgnoreCase("AMBER_1DAY_TO_GO")) 
        			sofar = NotificationNameEnum.AMBER_1DAY_TO_GO;  
        //RED To Come
        
        if (status.equalsIgnoreCase(NotificationNameEnum.RED_3DAYS_TO_GO)
                || status.equalsIgnoreCase("RED_3DAYS_TO_GO")) 
               			sofar = NotificationNameEnum.RED_3DAYS_TO_GO; 
        
        if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_STARTS)
                || status.equalsIgnoreCase("BLUE_STARTS")) 
               			sofar = NotificationNameEnum.BLUE_STARTS; 
        
        if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_12WEEKS_TO_GO) 
                || status.equalsIgnoreCase("BLUE_12WEEKS_TO_GO")) 
            			sofar = NotificationNameEnum.BLUE_12WEEKS_TO_GO;  

       if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_6WEEKS_TO_GO) 
                   || status.equalsIgnoreCase("BLUE_6WEEKS_TO_GO")) 
               			sofar = NotificationNameEnum.BLUE_6WEEKS_TO_GO;  

       if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_2WEEKS_TO_GO)
                       || status.equalsIgnoreCase("BLUE_2WEEKS_TO_GO")) 
               			sofar = NotificationNameEnum.BLUE_2WEEKS_TO_GO;  
               
       if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_1WEEK_TO_GO)
                       || status.equalsIgnoreCase("BLUE_1WEEK_TO_GO")) 
               			sofar = NotificationNameEnum.BLUE_1WEEK_TO_GO;  

       if (status.equalsIgnoreCase(NotificationNameEnum.BLUE_2DAYS_TO_GO) 
                   || status.equalsIgnoreCase("BLUE_2DAYS_TO_GO")) 
               			sofar = NotificationNameEnum.BLUE_2DAYS_TO_GO;  
      
       if (status.equalsIgnoreCase(NotificationNameEnum.BLACK_STARTS)
              || status.equalsIgnoreCase("BLACK_STARTS")) 
             			sofar = NotificationNameEnum.BLACK_STARTS; 
      
       if (status.equalsIgnoreCase(NotificationNameEnum.BLACK_PHONE_UP_STARTS)
              || status.equalsIgnoreCase("BLACK_PHONE_UP_STARTS")) 
             			sofar = NotificationNameEnum.BLACK_PHONE_UP_STARTS; 
      
       if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("NotificationNameEnum constructor passed invalid status: "+status);
        }
    }

}
