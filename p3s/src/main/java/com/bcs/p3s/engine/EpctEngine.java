package com.bcs.p3s.engine;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import com.bcs.p3s.display.Service;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.lang.Universal;

/**
 * Engine for calculating status and pricing for a potential E-PCT / Form1200
 *
 */
public class EpctEngine extends Universal {

	Patent patent;
	Epct epct;						// likely not exist
	Date effectivePriorityDate;
	boolean isTooEarly = false;
	boolean isTooLate = false;
	LocalDate ldToday;
	LocalDate ldEffectivePriority;
	LocalDate ld18monthsAfter;
	LocalDate ld31monthsAfter;
	String epctStatus;
	boolean isPricingAndDatesNeeded = false;
	
	// Following properties will only be set if needed
	Date greenStartDate;
	Date amberStartDate;
	Date redStartDate;
	Date redEndDate;
	String currentColour;
	
	
	
	// Start of public methods

	// Constructor - prepares data for the specified Patent
	public EpctEngine(Patent patent) {
		doConstructorProcessing(patent);
	}

	
	
	
	// acToD - LIKE to make this static - but problems with what it calls ???
	/**
	 * Generates the Service object for a patent in Filing stage
	 * @param patent in Filing stage
	 * @return
	 */
	public Service determineForm1200Service() {
    	String err = CLASSNAME + "determineForm1200Service() : ";

    	
    	Service service = new Service();
    	
    	
    	DummyForm1200Engine dummy = new DummyForm1200Engine();
		service = dummy.dummyF1200Service_variant1();
// does
//		service.setServiceStatus("Epct available");
//		service.setCurrentStageColour("Green");
//		service.setNextStageColour("Amber");
//		service.setCurrentStageCostUSD(new BigDecimal("12200.40"));
//		service.setNextStageCostUSD(new BigDecimal("14640.48"));
//		service.setCostBandEndDate(new Date("25/01/2019"));
//		service.setFailedReason(null);


    	
    	
    	return service;
	}
	
	// End of public methods


	
	

	// Start of internal methods

	protected void doConstructorProcessing(Patent patent) {
		// Populate members, as appropriate

		this.patent = patent;
    	String err = CLASSNAME + "doConstructorProcessing() : ";
    	if (patent==null) fail(err+" passed patent==null");
    	if ( ! StageManager.isInFiling(patent.getEpoPatentStatus())) fail(
    			err+" passed patent "+patent.getId()+" which is NOT IN FILING STAGE");
		
    	
    	epct = Epct.findEpctByPatent(patent);  // may be null

    	calcEffectivePriorityDate();
    	calcTooEarlyLate();
    	calcEpctStatus();
    	if (isPricingAndDatesNeeded) {
    		calcDatesAndColour();
    		calcPrice();
    	}
    	
    	
    	
    	
    	
	}
	
	protected void calcEffectivePriorityDate() {
		// If there is no PriorityDate, use International Filing Date : mpi05
		effectivePriorityDate = patent.getPriorityDate();
		if (effectivePriorityDate==null) effectivePriorityDate = patent.getInternationalFilingDate();
	}
	protected void calcTooEarlyLate() {
		ldToday = LocalDate.now();
		ldEffectivePriority = effectivePriorityDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		log().fatal("EffectivePriorityDate = "+ldEffectivePriority.toString());

		// Date at 18 months
		ld18monthsAfter =  ldEffectivePriority.plusMonths(18L);
		log().fatal("18month date = "+ld18monthsAfter.toString());
		if (ldToday.isBefore(ld18monthsAfter)) {
			isTooEarly = true;
			return;
		}
		
		// Date at 31 months
		ld31monthsAfter =  ldEffectivePriority.plusMonths(31L);
		ld31monthsAfter =  ld31monthsAfter.minusDays(1L);  // Cautious. Unsure of EPO rule
		log().fatal("18month date = "+ld31monthsAfter.toString());
		if (ldToday.isAfter(ld31monthsAfter)) {
			isTooLate = true;
			return;
		}

	}
	protected void calcEpctStatus() {
		// For each Form1200StatusEnum value, in correct order, determine if current & if needed, set isPricingAndDatesNeeded

		if (isTooEarly) epctStatus = Form1200StatusEnum.TOO_EARLY;
		else if (isTooLate) epctStatus = Form1200StatusEnum.TOO_LATE;

		else if (Form1200StatusEnum.EPCT_NOT_AVAILABLE.equalsIgnoreCase(patent.getEpctStatus()))
			epctStatus = Form1200StatusEnum.EPCT_NOT_AVAILABLE;

		else if (isMatchStatusInEitherObject(Form1200StatusEnum.ERROR))
			epctStatus = Form1200StatusEnum.ERROR;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.PAYMENT_IN_PROGRESS))
			epctStatus = Form1200StatusEnum.PAYMENT_IN_PROGRESS;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.COMPLETED))
			epctStatus = Form1200StatusEnum.COMPLETED;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_REJECTED)) {
			epctStatus = Form1200StatusEnum.EPCT_REJECTED;
			isPricingAndDatesNeeded = true;
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_BEING_GENERATED)) {
			epctStatus = Form1200StatusEnum.EPCT_BEING_GENERATED;
			isPricingAndDatesNeeded = true;
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_SAVED)) {
			epctStatus = Form1200StatusEnum.EPCT_SAVED;
			isPricingAndDatesNeeded = true;
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.PAYMENT_FAILED)) {
			epctStatus = Form1200StatusEnum.PAYMENT_FAILED;
			isPricingAndDatesNeeded = true;
		}
		
		// Which leaves EPCT_AVAILABLE. As we've already checked tooEarly/tooLate, we can now trust this 
		else if (Form1200StatusEnum.EPCT_AVAILABLE.equalsIgnoreCase(patent.getEpctStatus())) {
			epctStatus = Form1200StatusEnum.EPCT_AVAILABLE;
			isPricingAndDatesNeeded = true;
		}

		else fail(CLASSNAME+"calcEpctStatus() FAILED TO MATCH existing epct status");
	}
	protected boolean isMatchStatusInEitherObject(String statusString) { // Trust statusString not to be Null
		boolean match = false;
		if (statusString.equalsIgnoreCase(patent.getEpctStatus())) match = true;
		if ( ! match
			 && epct!=null 
			 && statusString.equalsIgnoreCase(epct.getEpctStatus())) match = true;
		return match;
	}
	protected void calcDatesAndColour() {

		// Green starts date. Later of : 18months or EPO have copied WIPO published.
		//  but cannot select patent unless EPO has published, so use the 18m date
		greenStartDate = Date.from(ld18monthsAfter.atStartOfDay(ZoneId.systemDefault()).toInstant());

		// Red is 3 days WORKING days before end. But for Thanksgiving implementation, choose simpler 5+5 CALENDAR days 
		LocalDate ldRedStart =  ld31monthsAfter.minusDays(5L);
		redStartDate = Date.from(ldRedStart.atStartOfDay(ZoneId.systemDefault()).toInstant());
		redEndDate = Date.from(ld31monthsAfter.atStartOfDay(ZoneId.systemDefault()).toInstant());
				
		LocalDate ldAmberStart =  ldRedStart.minusDays(5L);
		amberStartDate = Date.from(ldAmberStart.atStartOfDay(ZoneId.systemDefault()).toInstant());

		// what is current colour
		currentColour = RenewalColourEnum.GREY;
		if (isTodayWithinDateRange(greenStartDate, amberStartDate)) currentColour = RenewalColourEnum.GREEN;
		if (isTodayWithinDateRange(amberStartDate, redStartDate)) currentColour = RenewalColourEnum.AMBER;
		if (isTodayWithinDateRange(redStartDate, redEndDate)) currentColour = RenewalColourEnum.RED;
		// How get RedEnd as LocalDate. It's ld31monthsAfter 
		if (ldToday.isEqual(ld31monthsAfter)) currentColour = RenewalColourEnum.RED;
	}
	protected boolean isTodayWithinDateRange(Date start, Date end) {
		// Include the start date, but exclude the end date, from the range
		boolean isWithin = true;
		LocalDate ldStart = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate ldEnd = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().minusDays(1L);
		if (ldToday.isBefore(ldStart)) isWithin = false; 
		if (ldToday.isAfter(ldEnd)) isWithin = false; 
		return isWithin;
	}

	
	
	protected void calcPrice() {
		
	}
	
	
	
	
	
	
	
//	protected Form1200StatusEnum determineStatus() {
//		Form1200StatusEnum calcStatus = null;
//		
////	    public static final String TOO_EARLY			= "Too early";
////	    public static final String TOO_LATE				= "Too late";
////	    public static final String EPCT_NOT_AVAILABLE	= "Epct not available";
////	    public static final String EPCT_AVAILABLE		= "Epct available";
////	    public static final String EPCT_REJECTED		= "Epct rejected";
////	    public static final String EPCT_BEING_GENERATED	= "Epct being generated";
////	    public static final String EPCT_SAVED			= "Epct saved";
////	    public static final String PAYMENT_IN_PROGRESS	= "Payment in progress";
////	    public static final String PAYMENT_FAILED		= "Payment failed";
////	    public static final String COMPLETED			= "Completed";
////	    public static final String ERROR				= "Error";
//
//		
//		
//		return calcStatus;
//	}
	
	// End of internal methods

}
