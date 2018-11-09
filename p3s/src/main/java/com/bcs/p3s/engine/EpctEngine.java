package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.enump3s.EPCTnotAvailableReasonEnum;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
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
 * Upon creation, performs all date calculation, which also provides the Year3 renewal booleans.
 * Thereafter, offers:
 *  calcEpctStatusAndReason()
 *  calcEpctPersistPricingOnly()
 *  prepareForm1200Service()
 */
public class EpctEngine extends Universal {

	public static final String EPO_SA = "isr/EP";
	public static final String ACCEPTABLE_APPLICATION_LANGUAGE = "en";
	public static final String[] UNACCEPTABLE_IPC_CODE_PREFIXES = 
		{ "A61", "A99", "C01", "C05", "C06", "C07", "C08", "C12", "C40", "C99" };
		// Specification from slide ERPA01 in pp-release-2.1.v4.2.pptx
	public static final BigDecimal zero = BigDecimal.ZERO;  
	
	
	Patent patent;
	Epct epct;		// likely not exist
	boolean reasonIsTerminal = false;
	boolean isNotAvailable = false;
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
//	boolean isPricingAndDatesNeeded = false;
	
	// Following properties will only be set if needed
	Date greenStartDate;
	Date amberStartDate;
	Date redStartDate;
	//Date redStartDateMinus1;
	Date redEndDate;
	Date costBandStartDate;
	Date costBandEndDate;
	String currentColour;
	String nextColour;
	Form1200Fee fee;
	boolean isRenewalFeeChosen = false;
	BigDecimal nextColourTotal_USD;
	BigDecimal fxRate;
	

	// Start of public methods

	/**
	 * Constructor - performs all date calculation, which also provides the Year3 renewal booleans
	 * Thereafter offers methods:
	 * - calcEpctStatusAndReason()
	 * - calcEpctPersistPricingOnly()
	 * - prepareForm1200Service() 		[Prepares the Service object. Calculates further prices]
	 * 
	 * @param patent The patent being processed
	 */
	public EpctEngine(Patent patent) {
		this.patent = patent;

		// Check for No-Hopers first
    	if ( ( ! StageManager.isInFiling(patent.getEpoPatentStatus())) 
    	  || (isEpctNotAvailableReasonTerminal()) )
    	{
    		patent.setEpctStatus(Form1200StatusEnum.EPCT_NOT_AVAILABLE);
    		isNotAvailable = true;
    	}
		this.patent = patent;
		if (isNotAvailable) return;

    	doAllDateCalculations(patent);
	}

	
	
	
	
	
	 public void calcEpctStatusAndReason() {

		 if (isNotAvailable) return; // E=PCT Status will already have been set
		 
		 String reallyBad = epctNoGoReason();  // Hopefully is null
		 patent.setEpctNotAvailableReason(reallyBad);
		 calcEpctStatus();
	 }
	 
	 /**
	  * Ensures that fee (a Form1200Fee) is fully populated, ready for persisting
	  * @param optionalFxRate if null, this class accesses the db. Otherwise, a db access is avoided
	  */
	 public Form1200Fee calcEpctPersistPricingOnly(Epct unpersistedEpct, BigDecimal optionalFxRate) {
		if (isNotAvailable) return null; 
		calcDatesAndColour(); // will have calc currentColour & nextColour
		Form1200Fee newFee = calcEpctEntityOnlyPricing(unpersistedEpct, optionalFxRate);
		return newFee;
	 }

	 

	 /**
	 * Generates the Form1200 Service object for a patent in Filing stage
	 * @param patent in Filing stage
	 * @return Service object
	 */
	public P3SService prepareForm1200Service() {
    	//String err = CLASSNAME + "prepareForm1200Service() : ";
    	
    	// Service needs current AND next, colour AND price. So calc ..
		
		// Don't recalcuate pricing if already been done
		if (fee==null) calcEpctPersistPricingOnly(new Epct(), null);
    	
		// some short term checks
		if (currentColour==null) fail("currentColour==null");
		if (nextColour==null) fail("nextColour==null");
		if (fee==null || fee.getSubTotal_USD()==null) fail("(fee==null || fee.getSubTotal_USD()==null)");
		if (nextColourTotal_USD==null) fail("(nextColourTotal_USD==null)");
		
		
    	P3SService service = new P3SService();
    	
		service.setServiceType(P3SProductTypeEnum.FORM1200);
		service.setServiceStatus(epctStatus);
		if (currentColour!=null) service.setCurrentStageColour(currentColour);  // acTidy !!
		if (nextColour!=null) service.setNextStageColour(nextColour);
		service.setCurrentStageCostUSD(fee.getSubTotal_USD());
		service.setNextStageCostUSD(nextColourTotal_USD);
		service.setCostBandEndDate(costBandEndDate); 
		service.setFailedReason(patent.getEpctNotAvailableReason());
		
    	return service;
	}

	
	
	// End of public methods (apart from getters)


	
	

	// Start of internal methods

	/**
	 * If Patent:epctNotAvailableReason is a terminal reason, 
	 * is no need for ANY processing
	 */
	protected boolean isEpctNotAvailableReasonTerminal() {
		boolean isTerminal = false;
		if (patent==null) isTerminal = true;
		else {
			String reason = patent.getEpctNotAvailableReason();
			if (notEmpty(reason)) {
				EPCTnotAvailableReasonEnum eeenum = new EPCTnotAvailableReasonEnum(reason);
				if (eeenum.isNotAvailableReasonTerminal()) isTerminal = true;
			}
		}
		reasonIsTerminal = isTerminal; 
		return isTerminal;
	}

		
	// Invoked unconditionally by constructor
	protected void doAllDateCalculations(Patent patent) {
		// Populate members, as appropriate

		this.patent = patent;
    	String err = CLASSNAME + "doAllDateCalculations() : ";
    	if (patent==null) fail(err+" passed patent==null");
    	
    	// Perform the unconditional calculations. Mostly dates
    	calcEffectivePriorityDate();
    	calcTooEarlyLate();

    	epct = Epct.findEpctByPatent(patent);  // may be null
    	calcEpctStatus();

    	calcYear3RenewalBooleans();
    	
    	// End of unconditional processing
    	
	}

	
	protected void calcEffectivePriorityDate() {
		// If there is no PriorityDate, use International Filing Date : mpi05
		effectivePriorityDate = patent.getPriorityDate();
		if (effectivePriorityDate==null) effectivePriorityDate = patent.getInternationalFilingDate();
	}
	protected void calcTooEarlyLate() {
		ldToday = LocalDate.now();
		ldEffectivePriority = effectivePriorityDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		log().debug("calc f1200 dates: EffectivePriorityDate = "+ldEffectivePriority.toString());

		// Date at 18 months
		ld18monthsAfter =  ldEffectivePriority.plusMonths(18L);
		log().debug("calc f1200 dates: 18month date = "+ld18monthsAfter.toString());
		if (ldToday.isBefore(ld18monthsAfter)) {
			isTooEarly = true;
    		isNotAvailable = true;
			return;
		}
		
		// Date at 31 months
		ld31monthsAfter =  ldEffectivePriority.plusMonths(31L);
		ld31monthsAfter =  ld31monthsAfter.minusDays(1L);  // Cautious. Unsure of EPO rule
		log().debug("calc f1200 dates: 31month date = "+ld31monthsAfter.toString());
		if (ldToday.isAfter(ld31monthsAfter)) {
			isTooLate = true;
    		isNotAvailable = true;
			return;
		}

	}
	
	
	
	protected void calcEpctStatus() {
		// For each Form1200StatusEnum value, in appropriate order, 
		//  determine which status value is appropriate, & if needed, set isPricingAndDatesNeeded
		if (reasonIsTerminal) {
			epctStatus = Form1200StatusEnum.EPCT_NOT_AVAILABLE;
    		isNotAvailable = true;
		}
		else if (isTooEarly) epctStatus = Form1200StatusEnum.TOO_EARLY;
		else if (isTooLate) epctStatus = Form1200StatusEnum.TOO_LATE;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.ERROR))
			epctStatus = Form1200StatusEnum.ERROR;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.PAYMENT_IN_PROGRESS))
			epctStatus = Form1200StatusEnum.PAYMENT_IN_PROGRESS;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.COMPLETED))
			epctStatus = Form1200StatusEnum.COMPLETED;
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_REJECTED)) {
			epctStatus = Form1200StatusEnum.EPCT_REJECTED;
			if (isEmpty(patent.getEpctNotAvailableReason())) logErrorAndContinue("Status=Rejected, yet REASON is empty. Patent="+patent.getId());
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_BEING_GENERATED)
				|| isMatchStatusInEitherObject(Form1200StatusEnum.AWAIT_PDF_TRIGGER)) {
			epctStatus = Form1200StatusEnum.EPCT_BEING_GENERATED;
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.EPCT_SAVED)) {
			epctStatus = Form1200StatusEnum.EPCT_SAVED;
		}
		else if (isMatchStatusInEitherObject(Form1200StatusEnum.PAYMENT_FAILED)) {
			epctStatus = Form1200StatusEnum.PAYMENT_FAILED;
		}
		else {
			// If none of above triggered, status must be EPCT_AVAILABLE
			epctStatus = Form1200StatusEnum.EPCT_AVAILABLE;
		}
		patent.setEpctStatus(epctStatus);
	}
	protected boolean isMatchStatusInEitherObject(String statusString) { // Trust statusString not to be Null
		boolean match = false;
		if (statusString.equalsIgnoreCase(patent.getEpctStatus())) match = true;
		if ( ! match
			 && epct!=null 
			 && statusString.equalsIgnoreCase(epct.getEpctStatus())) match = true;
		return match;
	}

	protected void calcYear3RenewalBooleans() {
		// Determine if Year3 renewal fee is : Mandated, Optional or NotYetAvailable
		// For E-PCT applications, Year3 renewal can be paid 6 months before due. (Usually 3)
		LocalDate ld1andHalfYears =  ldEffectivePriority.plusMonths(18L);
		LocalDate ld2Years =  ldEffectivePriority.plusYears(2L);
		// boolean default values (all false) indicate NotYetAvailable
		int safetyNetDays = 11; // Need avoid taking order when optional, yet by time we instruct EPO, has become mandatory.
		  // Based on: T+3 +weekend +1nonWorkingDay(ignore Xmas), +valueDate, +day we instruct, +1 (for > becomes =>), +2 safety.
		if (ldToday.plusDays(safetyNetDays).isAfter(ld2Years))  isRenewalFeeMandated = true;
		else if (ldToday.isAfter(ld1andHalfYears)) isRenewalFeeOptional = true;
	}
	

	protected void calcDatesAndColour() {

		// Green starts date. Later of : 18months or EPO have copied WIPO published.
		//  but cannot select patent unless EPO has published, so use the 18m date
		greenStartDate = Date.from(ld18monthsAfter.atStartOfDay(ZoneId.systemDefault()).toInstant());

		// Red is 3 days WORKING days before end. But for Thanksgiving implementation, choose simpler 5+5 CALENDAR days 
		LocalDate ldRedStart =  ld31monthsAfter.minusDays(5L);
		redStartDate = Date.from(ldRedStart.atStartOfDay(ZoneId.systemDefault()).toInstant());
		//redStartDateMinus1 = Date.from((ldRedStart.minusDays(1L)).atStartOfDay(ZoneId.systemDefault()).toInstant()); - acTidy
		redEndDate = Date.from(ld31monthsAfter.atStartOfDay(ZoneId.systemDefault()).toInstant());
				
		LocalDate ldAmberStart =  ldRedStart.minusDays(5L);
		amberStartDate = Date.from(ldAmberStart.atStartOfDay(ZoneId.systemDefault()).toInstant());

		
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


	// 'Only' in as much as only calculates fields needed for persisting. For further prices, as needed by FE, see prepareForm1200Service()
	protected Form1200Fee calcEpctEntityOnlyPricing(Epct unpersistedEpct, BigDecimal optionalFxRate) {
		// Provide correct Form1200Fee data for persisting
		String err = CLASSNAME+" : calcEpctEntityOnlyPricing(epct,"+optionalFxRate+")";
		if (unpersistedEpct==null) fail(err+" passed null Epct");
		
		epct = unpersistedEpct; // overwrites potentially real object with empty - even if works, seem pointless (other then ensure no NPE..?) - acTodo
		if (optionalFxRate==null) {
			GlobalVariableSole glob = GlobalVariableSole.findOnlyGlobalVariableSole();
			fxRate = glob.getCurrent_P3S_rate();
		} else fxRate = optionalFxRate;
		
		populateForm1200Fee(fxRate);

		return fee;
	}

	
	protected void populateForm1200Fee(BigDecimal fxRate) {
		// Populates the 'fee' property with current Form1200Fee fees
		// Pricing is 3 stage.	(a) Eur prices calculated from the Patent  
		//						(b) Eur prices calculated from the Epct (includes the question answers)  
		//						(c) USD fees - inc totalling 
		// Thereafter, calc nextColourTotal_USD - without disrupting the freshly created 'fee' value

		fee = new Form1200Fee();
		OtherEpoFeeSole epoEpctFees = OtherEpoFeeSole.findOnlyOtherEpoFeeSole();

		// Stage (a) fees
		calcStageAprices(epoEpctFees);
		
		
		// Stage (b) fees
		calcStageBprices(epoEpctFees);
		
		// Stage (c) fees
		calcStageCprices(fxRate);
		
		calcNextColourTotalUSD();
	}
	protected void calcStageAprices(OtherEpoFeeSole epoEpctFees) {
		fee.setFilingFee_EUR(epoEpctFees.getFilingFee_EUR());

		if ( EPO_SA.equals(patent.getInternationalSearchAuthority())) 
			fee.setSupplementarySearchFee_EUR(zero);
		else
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
			else if ("ME".equals(aState)) tmp = tmp.add(epoEpctFees.getExtensionFee_ME_EUR());
			else fail(CLASSNAME+"calcStageBprices() given invalid ExtensionState code : "+aState);
		}
		fee.setTotalExtensionStatesFee_EUR(tmp);

		tmp = new BigDecimal("0.0"); 
		List<String> validationStates = epct.validationStatesAsList();
		for (String aState : validationStates) {
			if ("MA".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_MA_EUR());
			else if ("MD".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_MD_EUR());
			else if ("TN".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_TN_EUR());
			else if ("KH".equals(aState)) tmp = tmp.add(epoEpctFees.getValidationFee_KH_EUR());
			else fail(CLASSNAME+"calcStageBprices() given invalid ValidationState code : "+aState);
		}
		fee.setTotalValidationStatesFee_EUR(tmp);

		// Number of Claims
		int numClaims = epct.getTotalClaims();

		tmp = new BigDecimal("0.0"); 
		int mid35 = numClaims - 15;
		if (mid35 > 35) mid35 = 35;
		if (mid35 > 0) {
			tmp = epoEpctFees.getClaimsFee1_EUR().multiply(new BigDecimal(mid35));
		}
		fee.setTotalClaimsFee1_EUR(tmp);

		tmp = new BigDecimal("0.0"); 
		int over50s = numClaims - 50;
		if (over50s > 0) {
			tmp = epoEpctFees.getClaimsFee2_EUR().multiply(new BigDecimal(over50s));
		}
		fee.setTotalClaimsFee2_EUR(tmp);

		// Excess pages fee
		tmp = new BigDecimal("0.0"); 
		int numExcessPages = epct.getTotalPages() - 35;
		if (numExcessPages > 0) {
			tmp = epoEpctFees.getExcessPagesFee_EUR().multiply(new BigDecimal(numExcessPages));
		}
		fee.setTotalExcessPageFee_EUR(tmp);
		
		// Renewal Fee
		boolean payYear3Renewal = false;
		if (isRenewalFeeMandated) payYear3Renewal = true;
		if (isRenewalFeeOptional && epct.getIsYear3RenewalPaying()) payYear3Renewal = true;
		if (payYear3Renewal) {
			EpoRenewalFee year3fee = EpoRenewalFee.findEpoRenewalFeesByRenewalYear(3);
			fee.setRenewalFee_EUR(year3fee.getRenewalFee_EUR());
		}
		else fee.setRenewalFee_EUR(new BigDecimal("0.0"));
	}
	protected void calcStageCprices(BigDecimal fxRate) {
		// epct MAY be null
		// Here, get Rate, Calc USD prices, & set the total
	
		// Calculate the USD fees
		PricingEngine pricingEngine = new PricingEngine();
		P3SFeeSole p3sEffectiveFees = pricingEngine.getEffectiveP3sFees(patent.getBusiness());
		fee.setProcessingFee_USD(p3sEffectiveFees.getProcessingFee_USD());

		BigDecimal totUsd = fee.calcTotalOfEuroFees().multiply(fxRate);
		if (currentColour.equals(RenewalColourEnum.AMBER)) { 
			BigDecimal riskUplift = totUsd.multiply(p3sEffectiveFees.getExpressFee_Percent()).divide(new BigDecimal(100.0));
			fee.setExpressFee_USD(riskUplift);
		} else fee.setExpressFee_USD(zero);
		if (currentColour.equals(RenewalColourEnum.RED)) {
			BigDecimal riskUplift = totUsd.multiply(p3sEffectiveFees.getUrgentFee_Percent()).divide(new BigDecimal(100.0));
			fee.setUrgentFee_USD(riskUplift);
		} else fee.setUrgentFee_USD(zero);
		
		
		
		// Calc USD total for current colour
		BigDecimal totalUSD = totUsd.add(fee.getProcessingFee_USD()).add(fee.getExpressFee_USD()).add(fee.getUrgentFee_USD()); 
		fee.setSubTotal_USD(totalUSD);
		fee.setFxRate(fxRate);
	}


	// This will only be called after the 'fee' property has been freshly calculated - so can be relied upon (& should not be disrupted!)
	// if current is red, set Zero (As we don't send BigDecimals as null)
	protected void calcNextColourTotalUSD() {

		PricingEngine pricingEngine = new PricingEngine();
		P3SFeeSole p3sEffectiveFees = pricingEngine.getEffectiveP3sFees(patent.getBusiness());
		BigDecimal OneHundred = new BigDecimal("100.0");
		
		BigDecimal totOfEpoFeesUsd = fee.calcTotalOfEuroFees().multiply(fxRate);
		BigDecimal expressUplift = totOfEpoFeesUsd.multiply(p3sEffectiveFees.getExpressFee_Percent()).divide(OneHundred);
		BigDecimal urgentUplift = totOfEpoFeesUsd.multiply(p3sEffectiveFees.getUrgentFee_Percent()).divide(OneHundred);
		BigDecimal currentTotalUsd = fee.getSubTotal_USD(); 
		
		if (currentColour.equals(RenewalColourEnum.GREEN)) {
			nextColourTotal_USD = currentTotalUsd.add(expressUplift);
		}
		else if (currentColour.equals(RenewalColourEnum.AMBER)) {
			nextColourTotal_USD = currentTotalUsd.add(urgentUplift).subtract(expressUplift);
		}
		else nextColourTotal_USD = zero;
	}

	
	
	
	/**
	 * If E-PCT is permanently not-available for this patent, indicate the reason.
	 *  
	 * @return null (indicating E-PCT may be possible), 
	 * or a String to be persisted to patent.epctNotAvailableReason. Will be a EPCTnotAvailableReasonEnum terminal value.
	 * 
	 * When a patent is created, there are two possible reasons why PatentPlace will 
	 * NOT offer an E-PCT:
	 * - Application Language is not English
	 * - IPC code is not in an acceptable range
	 */
	protected String epctNoGoReason() {
		if (patent==null) return null;
		
		String lang = patent.getInternationalFilingLang(); 
		if ((isEmpty(lang)) ||  ! ACCEPTABLE_APPLICATION_LANGUAGE.equalsIgnoreCase(lang)) {
			return EPCTnotAvailableReasonEnum.NOT_ENGLISH;
		}
		
		String allPatentCodes = patent.getIpcCodes();
		if (isEmpty(allPatentCodes)) return EPCTnotAvailableReasonEnum.BAD_IPC_CODE;
		String[] allCodesFromThisPatent = allPatentCodes.split(",");
		boolean foundMatch = false;
		log().debug("About to test if IPC codes ("+allPatentCodes+") match any Unacceptable codes");
		for (String aCodeFromThisPatent : allCodesFromThisPatent) {
			String code = aCodeFromThisPatent.trim();
			for (int ii=0; ii<UNACCEPTABLE_IPC_CODE_PREFIXES.length; ii++) {
				String nogoPrefix = UNACCEPTABLE_IPC_CODE_PREFIXES[ii];
				log().debug("     cf full = "+aCodeFromThisPatent+"   -   nogo = "+nogoPrefix);
				if (aCodeFromThisPatent.startsWith(nogoPrefix)) { foundMatch=true; break; }
			}
			if (foundMatch==true) break; 
		}
		log().debug("Result of checking IPC codes. Found a match inhibiting Form1200 = "+foundMatch);
		if (foundMatch==true) return EPCTnotAvailableReasonEnum.BAD_IPC_CODE;
		
		return null;
	}

	
	// End of internal methods

	
	
	
	// Ordinary getters

	public boolean isNotAvailable() {
		return isNotAvailable;
	}
	public String getEpctStatus() {
		return epctStatus;
	}
	public Date getRedStartDate() {
		return redStartDate;
	}
	public Form1200Fee getFee() {
		return fee;
	}

	public boolean isRenewalFeeMandated() {
		return isRenewalFeeMandated;
	}
	public boolean isRenewalFeeOptional() {
		return isRenewalFeeOptional;
	}
	public Date getCostStartDate() {
		return costBandStartDate;
	}
}