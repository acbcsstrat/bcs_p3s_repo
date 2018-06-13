package com.bcs.p3s.enump3s;

public class EPOSearchTypeEnum extends P3SAbstractEnum {

    public static final String REGISTER_RETRIEVAL_RENEWAL					= "Register Retrieval Renewal"; 
    public static final String REGISTER_RETRIEVAL_FORM1200					= "Register Retrieval Form1200";
    public static final String PUBLISHED_DATA_CLAIMS					= "Published Data Claims"; 
    public static final String PUBLISHED_DATA_ABSTRACT					= "Published Data Abstract"; 


    // Constructor - Which verifies the value provided
    public EPOSearchTypeEnum(String status)  
    {
        if (status==null) fail("EPOSearchTypeEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(EPOSearchTypeEnum.REGISTER_RETRIEVAL_RENEWAL)
         || status.equalsIgnoreCase("REGISTER_RETRIEVAL_RENEWAL")) 
        			sofar = EPOSearchTypeEnum.REGISTER_RETRIEVAL_RENEWAL;  

        if (status.equalsIgnoreCase(EPOSearchTypeEnum.REGISTER_RETRIEVAL_FORM1200) 
                || status.equalsIgnoreCase("REGISTER_RETRIEVAL_FORM1200")) 
            			sofar = EPOSearchTypeEnum.REGISTER_RETRIEVAL_FORM1200;  

        if (status.equalsIgnoreCase(EPOSearchTypeEnum.PUBLISHED_DATA_CLAIMS) 
                || status.equalsIgnoreCase("PUBLISHED_DATA_CLAIMS")) 
            			sofar = EPOSearchTypeEnum.PUBLISHED_DATA_CLAIMS;  
        
        if (status.equalsIgnoreCase(EPOSearchTypeEnum.PUBLISHED_DATA_ABSTRACT) 
                || status.equalsIgnoreCase("PUBLISHED_DATA_ABSTRACT")) 
            			sofar = EPOSearchTypeEnum.PUBLISHED_DATA_ABSTRACT;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("EPOSearchTypeEnum constructor passed invalid status: "+status);
        }
    }

}
