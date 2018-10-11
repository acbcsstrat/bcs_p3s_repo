package com.bcs.p3s.enump3s;

public class EPCTnotAvailableReasonEnum extends P3SAbstractEnum {
	
	
    // if epctStatus is EPCT_AVAILABLE, the reason explains why an E-PCT application cannot be started  
    public static final String NOT_ENGLISH		= "Not English"; 
    public static final String BAD_IPC_CODE		= "Bad ipc code"; // Unsupported code / code ranges 

    // if epctStatus is EPCT_REJECTED,  the reason explains why the E-PCT application started earlier, failed. 
    public static final String NATURAL_PERSON	= "Natural Person"; 
    public static final String AMENDED			= "Amended";
    public static final String DOCS_REQUIRED	= "Docs Required";

    // Maps from shortCodes (for use within entities and persisting) to Longer text for passing to the FE - potentially for display to the user
    // This array must contain a value for each item above
    protected final String[][] shortAndLong = {
		  { "Not English", 		"Certain IPC codes cannot be processed online" } 
		, { "Bad ipc code", 	"Application is in a language other than English" } 
		, { "Natural Person",	"Applicant is not an entity nor a natural person" }
		, { "Amended", 			"Claim has been amended" }
		, { "Docs Required",	"Additional copies of the documents cited in the supplementary European search report are required" } 
    };
    
    
    
    

    // Constructor - Which verifies the value provided
    public EPCTnotAvailableReasonEnum(String status)  
    {
        if (status==null) fail("EPCTnotAvailableReasonEnum constructor passed null");

        String sofar = null;
        
        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.NOT_ENGLISH)
                || status.equalsIgnoreCase("NOTENGLISH") 
        		|| status.equalsIgnoreCase("NOT ENGLISH")) 
            			sofar = EPCTnotAvailableReasonEnum.NOT_ENGLISH;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.BAD_IPC_CODE)
                || status.equalsIgnoreCase("BADIPCCODE") 
        		|| status.equalsIgnoreCase("BAD IPC CODE")) 
            			sofar = EPCTnotAvailableReasonEnum.BAD_IPC_CODE;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.NATURAL_PERSON)
                || status.equalsIgnoreCase("NATURALPERSON") 
                || status.equalsIgnoreCase("NATURAL PERSON")) 
            			sofar = EPCTnotAvailableReasonEnum.NATURAL_PERSON;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.AMENDED)
                || status.equalsIgnoreCase("AMENDED")) 
            			sofar = EPCTnotAvailableReasonEnum.AMENDED;  

        if (status.equalsIgnoreCase(EPCTnotAvailableReasonEnum.DOCS_REQUIRED)
                || status.equalsIgnoreCase("DOCSREQUIRED") 
                || status.equalsIgnoreCase("DOCS REQUIRED")) 
            			sofar = EPCTnotAvailableReasonEnum.DOCS_REQUIRED;  

        			
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("EPCTnotAvailableReasonEnum constructor passed invalid status: "+status);
        }
    }


    
    
    /**
     * Where fail reason is from scrape - This is terminal. The EPO data does not match our requirements.
     * However, if the fail reason was because of data the user entered, the user might like to have another go (!)
     * @return true if Terminal.
     */
    public boolean isNotAvailableReasonTerminal() {
    	return (NOT_ENGLISH.equals(value) || BAD_IPC_CODE.equals(value)); 
    }
    
    public String toLongerString() {
    	String txtReason = "Internal Error";
    	for (int ii=0 ; ii<shortAndLong.length ; ii++) {
    		if (this.value.equals(shortAndLong[ii][0])) {
    			txtReason = shortAndLong[ii][1];
    			break;
    		}
    	}
    	return this.value;
    }

}
