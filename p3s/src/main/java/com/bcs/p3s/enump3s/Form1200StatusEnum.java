package com.bcs.p3s.enump3s;

// This file is common to all products (web, cron, harness)

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
    public static final String AWAIT_PDF_GEN_START 	= "Await pdf gen start";    // Epct created but Cron not yet started generating PDF. May yet prove to be redundant. 
    public static final String EPCT_BEING_GENERATED	= "Epct being generated";
    public static final String EPCT_SAVED			= "Epct saved";
    public static final String PAYMENT_IN_PROGRESS	= "Payment in progress";
    public static final String PAYMENT_FAILED		= "Payment failed";
    public static final String COMPLETED			= "Completed";
    public static final String ERROR				= "Error";

    // For internal development and/or testing ONLY
    public static final String SIMULATE_F1200_COMPLETION	= "Simulate f1200 completion";  // Such that Epo appears to indicate Euro-PCT is successfully completed
    

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

        if (status.equalsIgnoreCase(Form1200StatusEnum.AWAIT_PDF_GEN_START)
                || status.equalsIgnoreCase("AWAIT_PDF_GEN_START")) 
            			sofar = Form1200StatusEnum.AWAIT_PDF_GEN_START;

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
    // includeInAService() - Is not determined here. See isNotAvailable is EpctEngine

    public boolean canSellForm1200() {
    	return (value.equals(AWAIT_PDF_GEN_START)
    			|| value.equals(EPCT_BEING_GENERATED)
    			|| value.equals(EPCT_SAVED));
    }

    public boolean canCalcCostAnalysisData() {
    	return (value.equals(TOO_EARLY)
    	     || value.equals(EPCT_AVAILABLE)
    	     || value.equals(EPCT_REJECTED)
    	     || value.equals(AWAIT_PDF_GEN_START)
    	     || value.equals(EPCT_BEING_GENERATED)
    	     || value.equals(EPCT_SAVED)
    	     || value.equals(PAYMENT_IN_PROGRESS)
    	     || value.equals(PAYMENT_FAILED));
    }

    public static boolean isDeletable(String code) {
    	// Consider: A persisted Epct (et al) can never be created for some status values
    	return (EPCT_REJECTED.equalsIgnoreCase(code)
    		 || AWAIT_PDF_GEN_START.equalsIgnoreCase(code)
    		 || EPCT_SAVED.equalsIgnoreCase(code));
    }
    public static boolean isRejectable(String code) {
    	return (EPCT_AVAILABLE.equalsIgnoreCase(code)
           		|| EPCT_REJECTED.equalsIgnoreCase(code)
           		|| AWAIT_PDF_GEN_START.equalsIgnoreCase(code)
           		|| EPCT_SAVED.equalsIgnoreCase(code));
    }
    public static boolean isInactive(String code) { // Epct is Inactive (rightNow) so can be ignored for all purpose
    	return (TOO_EARLY.equalsIgnoreCase(code)
       		 || TOO_LATE.equalsIgnoreCase(code)
    		 || EPCT_NOT_AVAILABLE.equalsIgnoreCase(code)
    		 || PAYMENT_FAILED.equalsIgnoreCase(code)
    		 || COMPLETED.equalsIgnoreCase(code));
    }
    /**
     * Don't show FE the awaitingCron message.
     * Note: Is safe - even if given an unrecognised (ie Non-Form1200) status value
     */
    public static String statusForUI(String rawStatus) {
    	if (AWAIT_PDF_GEN_START.equals(rawStatus)) return EPCT_BEING_GENERATED;
    	else return rawStatus;
    }
}
