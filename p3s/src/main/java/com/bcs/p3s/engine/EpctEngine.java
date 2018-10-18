package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.EpoRenewalFee;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.OtherEpoFeeSole;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.lang.Universal;

/**
 * Engine for calculating status and pricing for a potential E-PCT / Form1200
 *
 */
public class EpctEngine extends Universal {

	public static final String EPO_SA = "isr/EP";
	
	
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
	boolean isRenewalFeeMandated = false;
	boolean isRenewalFeeOptional = false;
	boolean isPricingAndDatesNeeded = false;
	
	// Following properties will only be set if needed
	Date greenStartDate;
	Date amberStartDate;
	Date redStartDate;
	Date redEndDate;
	Date costBandEndDate;
	String currentColour;
	String nextColour;
	Form1200Fee fee;
	boolean isRenewalFeeChosen = false;
	BigDecimal nextColourTotal_USD;
	
	Date costBandStartDate; // late addition - zaphod - use or remove
	

	// Start of public methods

	// Constructor - prepares data for the specified Patent
	public EpctEngine(Patent patent) {
		doConstructorProcessing(patent);
	}

	
	
	
	/**
	 * Generates the Form1200 Service object for a patent in Filing stage
	 * @param patent in Filing stage
	 * @return Service object
	 */
	public P3SService determineForm1200Service() {
    	String err = CLASSNAME + "determineForm1200Service() : ";

    	
    	P3SService service = new P3SService();
    	
    	
//    	DummyForm1200Engine dummy = new DummyForm1200Engine(); // acRedundant
//		service = dummy.dummyF1200Service_variant1();

		service.setServiceType(P3SProductTypeEnum.FORM1200);
		service.setServiceStatus(epctStatus);
		if (currentColour!=null) service.setCurrentStageColour(currentColour);
		if (nextColour!=null) service.setNextStageColour(nextColour);
		if (fee!=null) service.setCurrentStageCostUSD(fee.getSubTotal_USD());
		if (nextColourTotal_USD!=null) service.setNextStageCostUSD(nextColourTotal_USD);
		service.setCostBandEndDate(costBandEndDate); 
		if (epct!=null) service.setFailedReason(patent.getEpctNotAvailableReason());
    	
    	return service;
	}
	
	
	public Date getCostStartEndDate() {
		return costBandStartDate;
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

		// Determine if Year3 renewal fee is : Mandated, Optional or NotYetAvailable
		// For E-PCT applications, Year3 renewal can be paid 6 months before due. (Usually 3)
		LocalDate ld1andHalfYears =  ldEffectivePriority.plusMonths(18L);
		LocalDate ld2Years =  ldEffectivePriority.plusYears(2L);
		// boolean default values (all false) indicate NotYetAvailable
		int safetyNetDays = 11; // Need avoid taking order when optional, yet by time we instruct EPO, has become mandatory.
		  // Based on: T+3 +weekend +1nonWorkingDay(ignore Xmas), +valueDate, +day we instruct, +1 (for > becomes =>), +2 safety.
		if (ldToday.plusDays(safetyNetDays).isAfter(ld2Years))  isRenewalFeeMandated = true;
		else if (ldToday.isAfter(ld1andHalfYears)) isRenewalFeeOptional = true;

		
		// what is current colour & next colour
		currentColour = RenewalColourEnum.GREY;
		if (isTodayWithinDateRange(greenStartDate, amberStartDate)) {
			currentColour = RenewalColourEnum.GREEN;
			costBandStartDate = greenStartDate;
			costBandEndDate = amberStartDate;
		}
		if (isTodayWithinDateRange(amberStartDate, redStartDate)) {
			currentColour = RenewalColourEnum.AMBER;
			costBandStartDate = amberStartDate;
			costBandEndDate = redStartDate;
		}
		if (isTodayWithinDateRange(redStartDate, redEndDate)) {
			currentColour = RenewalColourEnum.RED;
			costBandStartDate = redStartDate;
			costBandEndDate = redEndDate;
		}
		// Below for very-last-day boundary-condition. How get RedEnd as LocalDate. It's ld31monthsAfter 
		if (ldToday.isEqual(ld31monthsAfter)) {
			currentColour = RenewalColourEnum.RED;
			costBandStartDate = redStartDate;
			costBandEndDate = redEndDate;
		}

		nextColour = ColourManager.whatColourComesNext(currentColour, P3SProductTypeEnum.FORM1200);
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
		// Pricing is 3 stage. (a) Eur prices we can calculate PRIOR to asking the questions (i.e. before EPCT being persisted), 
		//		(b) Eur due to question answers,  (c) USD fees 
		// If prior to EPCT persisted, is reasonable to assume all such latter fees are zero

		fee = new Form1200Fee(); // Used for convenience. Will not be persisted.
		OtherEpoFeeSole epoEpctFees = OtherEpoFeeSole.findOnlyOtherEpoFeeSole();

		// Stage (a) fees
		calcStageAprices(epoEpctFees);
		
		
		// Stage (b) fees
		if (epct!=null) {
			calcStageBprices(epoEpctFees);
		}
		
		// Stage (c) fees
		calcStageCprices();
	}
	protected void calcStageAprices(OtherEpoFeeSole epoEpctFees) {
		fee.setFilingFee_EUR(epoEpctFees.getFilingFee_EUR());

		if ( ! EPO_SA.equals(patent.getInternationalSearchAuthority()))
			fee.setSupplementarySearchFee_EUR(epoEpctFees.getSupplementarySearchFee_EUR());

		fee.setDesignationStatesFee_EUR(epoEpctFees.getDesignationStatesFee_EUR());
		fee.setExaminationFee_EUR(epoEpctFees.getExaminationFee_EUR());
	}
	protected void calcStageBprices(OtherEpoFeeSole epoEpctFees) {
		// Can rely on epct NOT being null
		
		// Extension States and Validation States
		BigDecimal tmp = new BigDecimal("0.0"); 
		List<String> extensionStates = epct.extensionStatesAsList();
		for (String aState : extensionStates) {
			if ("BA".equals(aState)) tmp = tmp.add(epoEpctFees.getExtensionFee_BA_EUR());   // Yes, I know ...
			if ("ME".equals(aState)) tmp = tmp.add(epoEpctFees.getExtensionFee_ME_EUR());
		}
		fee.setTotalExtensionStatesFee_EUR(tmp);

		tmp = new BigDecimal("0.0"); 
		List<String> validationStates = epct.validationStatesAsList();
		for (String aState : validationStates) {
			if ("MA".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_MA_EUR());
			if ("MD".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_MD_EUR());
			if ("TN".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_TN_EUR());
			if ("KH".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_KH_EUR());
		}
		fee.setTotalValidationStatesFee_EUR(tmp);

		// Number of Claims
		int numClaims = epct.getTotalClaims();

		tmp = new BigDecimal("0.0"); 
		int mid36 = numClaims - 14;
		if (mid36 > 36) mid36 = 36;
		if (mid36 > 0) {
			tmp = epoEpctFees.getClaimsFee1_EUR().multiply(new BigDecimal(mid36));
		}
		fee.setTotalClaimsFee1_EUR(tmp);

		tmp = new BigDecimal("0.0"); 
		int over50s = numClaims - 50;
		if (over50s > 0) {
			tmp = epoEpctFees.getClaimsFee2_EUR().multiply(new BigDecimal(over50s));
		}
		fee.setTotalClaimsFee2_EUR(tmp);

		// Excess pages fee
		int numExcessPages = epct.getTotalPages() - 35;
		tmp = epoEpctFees.getExcessPagesFee_EUR().multiply(new BigDecimal(numExcessPages));
		fee.setTotalExcessPageFee_EUR(tmp);
		
		// Renewal Fee
		boolean payYear3Renewal = false;
		if (isRenewalFeeMandated) payYear3Renewal = true;
		if (isRenewalFeeOptional && epct.getIsYear3RenewalPaying()) payYear3Renewal = true;
		if (payYear3Renewal) {
			EpoRenewalFee year3fee = EpoRenewalFee.findEpoRenewalFeesByRenewalYear(3);
			fee.setRenewalFee_EUR(year3fee.getRenewalFee_EUR());
		}
	}
	protected void calcStageCprices() {
		// epct MAY be null
		// Here, get Rate, Calc USD proces, & set the total
		GlobalVariableSole globalSole = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal rate = globalSole.getCurrent_P3S_rate();
		BigDecimal epoFeesInUSD = fee.calcTotalOfEuroFees().multiply(rate);
	
		// Processing Fee
		PricingEngine pricingEngine = new PricingEngine();
		P3SFeeSole p3sEffectiveFees = pricingEngine.getEffectiveP3sFees(patent.getBusiness());
		fee.setProcessingFee_USD(p3sEffectiveFees.getProcessingFee_USD());

		// Calc express & urgent fees, if relevant for Current colour OR Next colour
		String nextColour = ColourManager.whatColourComesNext(currentColour, P3SProductTypeEnum.FORM1200);
		if (currentColour.equals(RenewalColourEnum.GREEN) || currentColour.equals(RenewalColourEnum.AMBER)) {
			fee.setExpressFee_USD(pricingEngine.multiplyByPercentage(epoFeesInUSD, p3sEffectiveFees.getExpressFee_Percent()));
		}
		if (currentColour.equals(RenewalColourEnum.AMBER) || currentColour.equals(RenewalColourEnum.RED)) {
			fee.setUrgentFee_USD(pricingEngine.multiplyByPercentage(epoFeesInUSD, p3sEffectiveFees.getUrgentFee_Percent()));
		}

		// Calc USD total for current colour
		BigDecimal totalUSD = epoFeesInUSD;
		if (currentColour.equals(RenewalColourEnum.AMBER)) totalUSD = totalUSD.add(fee.getExpressFee_USD()); 
		else if (currentColour.equals(RenewalColourEnum.RED)) totalUSD = totalUSD.add(fee.getUrgentFee_USD()); 
		fee.setSubTotal_USD(totalUSD);
		
		// Calc USD total for next colour
		totalUSD = epoFeesInUSD;
		if (nextColour.equals(RenewalColourEnum.AMBER)) totalUSD = totalUSD.add(fee.getExpressFee_USD()); 
		else if (nextColour.equals(RenewalColourEnum.RED)) totalUSD = totalUSD.add(fee.getUrgentFee_USD()); 
		nextColourTotal_USD = totalUSD;
	}
		
	
	// End of internal methods

	
	
	
	// Ordinary getters

	public Form1200Fee getFee() {
		return fee;
	}
	
	
	
	
}
