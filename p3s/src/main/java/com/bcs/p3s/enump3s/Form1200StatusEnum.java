package com.bcs.p3s.enump3s;

/**
 * The values that may appear in Epct.epctStatus
 *
 * This is our P3S E-PCT status. 1 of the 11 values from 
 * T:\PatentPlace\pp-release-2.1\Specifications\Fees and Status Values\180807b Status Values - GRID.xlsx 
 */
public class Form1200StatusEnum extends P3SAbstractEnum {

    public static final String TOO_EARLY			= "Too early";
    public static final String TOO_LATE				= "Too late";
    public static final String EPCT_NOT_AVAILABLE	= "Epct not available";
    public static final String EPCT_AVAILABLE		= "Epct available";
    public static final String EPCT_REJECTED		= "Epct rejected";
    public static final String AWAIT_PDF_TRIGGER 	= "Await pdf trigger";    // Epct created but Cron not yet started generating PDF. May prove to be redundant. acTidy 
    public static final String EPCT_BEING_GENERATED	= "Epct being generated";
    public static final String EPCT_SAVED			= "Epct saved";
    public static final String PAYMENT_IN_PROGRESS	= "Payment in progress";
    public static final String PAYMENT_FAILED		= "Payment failed";
    public static final String COMPLETED			= "Completed";
    public static final String ERROR				= "Error";


    // Constructor - Which verifies the value provided
    public Form1200StatusEnum(String status)  
    {
        if (status==null) fail("Form1200StatusEnum constructor passed null");

        String sofar = null;

        
        if (status.equalsIgnoreCase(Form1200StatusEnum.TOO_EARLY)
                || status.equalsIgnoreCase("TOO_EARLY")) 
            			sofar = Form1200StatusEnum.TOO_EARLY;

        if (status.equalsIgnoreCase(Form1200StatusEnum.TOO_LATE)
                || status.equalsIgnoreCase("TOO_LATE")) 
            			sofar = Form1200StatusEnum.TOO_LATE;

        if (status.equalsIgnoreCase(Form1200StatusEnum.EPCT_NOT_AVAILABLE)
                || status.equalsIgnoreCase("EPCT_NOT_AVAILABLE")) 
            			sofar = Form1200StatusEnum.EPCT_NOT_AVAILABLE;

        if (status.equalsIgnoreCase(Form1200StatusEnum.EPCT_AVAILABLE)
                || status.equalsIgnoreCase("EPCT_AVAILABLE")) 
            			sofar = Form1200StatusEnum.EPCT_AVAILABLE;

        if (status.equalsIgnoreCase(Form1200StatusEnum.EPCT_REJECTED)
                || status.equalsIgnoreCase("EPCT_REJECTED")) 
            			sofar = Form1200StatusEnum.EPCT_REJECTED;

        if (status.equalsIgnoreCase(Form1200StatusEnum.EPCT_BEING_GENERATED)
                || status.equalsIgnoreCase("EPCT_BEING_GENERATED")) 
            			sofar = Form1200StatusEnum.EPCT_BEING_GENERATED;

        if (status.equalsIgnoreCase(Form1200StatusEnum.EPCT_SAVED)
                || status.equalsIgnoreCase("EPCT_SAVED")) 
            			sofar = Form1200StatusEnum.EPCT_SAVED;

        if (status.equalsIgnoreCase(Form1200StatusEnum.PAYMENT_IN_PROGRESS)
                || status.equalsIgnoreCase("PAYMENT_IN_PROGRESS")) 
            			sofar = Form1200StatusEnum.PAYMENT_IN_PROGRESS;

        if (status.equalsIgnoreCase(Form1200StatusEnum.PAYMENT_FAILED)
                || status.equalsIgnoreCase("PAYMENT_FAILED")) 
            			sofar = Form1200StatusEnum.PAYMENT_FAILED;

        if (status.equalsIgnoreCase(Form1200StatusEnum.COMPLETED))
            			sofar = Form1200StatusEnum.COMPLETED;

        if (status.equalsIgnoreCase(Form1200StatusEnum.ERROR))
            			sofar = Form1200StatusEnum.ERROR;


        
        if (sofar != null) {
        	this.value = sofar.toString();
        } else {
        	fail("Form1200StatusEnum constructor passed invalid status: "+status);
        }
    }

    public boolean canInitiateForm1200() {
    	return (value.equals(EPCT_AVAILABLE)
    			|| value.equals(EPCT_REJECTED)
    			|| value.equals(PAYMENT_FAILED));
    }
}
