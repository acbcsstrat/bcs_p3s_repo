package com.bcs.p3s.enump3s;

public class EPCTnotAvailableReasonEnum extends P3SAbstractEnum {
	
    public static final String NATURALPERSON			= "NaturalPerson"; 
    public static final String AMENDED					= "Amended";
    public static final String DOCSREQUIRED			= "DocsRequired";


    // Constructor - Which verifies the value provided
    public EPCTnotAvailableReasonEnum(String status)  
    {
        if (status==null) fail("EPCTnotAvailableReasonEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.NATURALPERSON)
                || status.equalsIgnoreCase("NATURALPERSON") 
                || status.equalsIgnoreCase("NATURAL PERSON")) 
            			sofar = EPCTnotAvailableReasonEnum.NATURALPERSON;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.AMENDED)
                || status.equalsIgnoreCase("AMENDED")) 
            			sofar = EPCTnotAvailableReasonEnum.AMENDED;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.DOCSREQUIRED)
                || status.equalsIgnoreCase("DOCSREQUIRED") 
                || status.equalsIgnoreCase("DOCS REQUIRED")) 
            			sofar = EPCTnotAvailableReasonEnum.DOCSREQUIRED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("EPCTnotAvailableReasonEnum constructor passed invalid status: "+status);
        }
    }


}
