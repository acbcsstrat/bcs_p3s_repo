package com.bcs.p3s.engine;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.PatentStatusNoRenewalNeeded;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.CombinedFee;
import com.bcs.p3s.wrap.PatentExtendedData;

/**
 * Calculates the current status of a Patent
 * 
 * ASSUMPTIONs:
 * patent:epo_patent_status & patent:lastRenewedDateExEpo is current
 * 
 * OBJECTIVE:
 * Can we sell a renewal of this patent?
 * 
 * LOGIC: for 'this' patent
 * - from filing date, are we in the 9 months? If in doldrums, abort.
 * - get patent:lastRenewedDateExEpo
 * - calculate the patent YEAR (e.g 5) that that renewal represented
 * - for 'this' 9 months, calculate the patent YEAR
 * - if this year NOT= lastRenewedYear+1 - log. PERHAPS CONTINUE ANYWAY? 
 * - if there is already a renewal-in-progress for-this-year, abort.
 * - Calculate Colour and price
 * 
 */
public class PatentStatusEngine extends Universal {
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	RenewalDatesEngine datesEngineObj = new RenewalDatesEngine();
	
	public PatentStatus getRenewalInfo(Patent patent){
		
		PatentStatus renewalInfo = new PatentStatus();
		try{
			Date todays = new DateUtil().getTodaysDate();
			RenewalDates allDates = datesEngineObj.getRenewalDates(patent);
			
			if(allDates == null){
				log().error("Error occured in calculating renewal dates for patent[" + patent.getPatentApplicationNumber() +"].");
				logErrorAndContinue("Error occured in calculating renewal dates for patent[" + patent.getPatentApplicationNumber() +"].");
				//renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				return null;
			}

			renewalInfo.setNineMonthStart(allDates.getCurrentWindowOpenDate());
			renewalInfo.setNineMonthEnd(allDates.getCurrentWindowCloseDate());
			renewalInfo.setRenewalDueDate(allDates.getCurrentRenewalDueDate());
			renewalInfo.setActiveRenewalYear(allDates.getRenewalYear());
			
			/**
			 * NOW POPULATE ALL COLOURDATES FOR CURRENT WINDOW
			 */
			renewalInfo.setCurrentColorDates(getAllColorDates(renewalInfo.getRenewalDueDate()));
			//Date lastRenewed = patent.getLastRenewedDateExEpo();
			
			if(renewalInfo.getActiveRenewalYear() < 3){
				/**
				 * THis is the case when the new patent has a renewal year less than 3 ie, no Renewal needed 
				 */
				log().debug("****RENEWAL WINDOW CLOSED*****");
				log().debug("Renewal window remains closed until renewal opens for YEAR 3 [OPENS ON " + renewalInfo.getNineMonthStart() +"]");
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
			}
			
			else if(renewalInfo.getActiveRenewalYear() > 20){
				/**
				 * THis is the case when the new patent has a renewal year > 20 ie, No Renewal needed 
				 */
				log().debug("****RENEWAL WINDOW CLOSED*****");
				log().debug("Patent reached expiry. No further renewal needed");
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.NO_RENEWAL_NEEDED);
			}
			
			else if(todays.after(renewalInfo.getNineMonthEnd())){ //ie, doldrum of the active renewal year
				//we are in doldrums
				//check whether a renewal made for the active renewal year else we are too late
				//if(lastRenewed.after(allDates.getCurrentWindowOpenDate()) && lastRenewed.before(allDates.getCurrentWindowCloseDate()) ){
				log().debug("****RENEWAL WINDOW CLOSED*****");
				log().debug("Window closed for renewal year " + renewalInfo.getActiveRenewalYear() + " and renewal fee being paid up for year " + patent.getLastRenewedYearEpo()) ;
				
				
				if(RenewalStatusEnum.NO_RENEWAL_NEEDED.equals(patent.getRenewalStatus())){
					renewalInfo.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				else if(renewalInfo.getActiveRenewalYear() == patent.getLastRenewedYearEpo()){
					renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				}
				else if(RenewalStatusEnum.IN_PROGRESS.equals(patent.getRenewalStatus()) || RenewalStatusEnum.EPO_INSTRUCTED.equals(patent.getRenewalStatus())){
					renewalInfo.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				else{
					if(RenewalStatusEnum.EPO_INSTRUCTED.equals(patent.getRenewalStatus())){
						log().debug("Renewal status is "+ patent.getRenewalStatus()+". ie, Instruction to renew patent being completed. Awaiting EPO confirmation");
						renewalInfo.setCurrentRenewalStatus(patent.getRenewalStatus());
					}
					else{
						log().debug("Renewal status is "+ patent.getRenewalStatus()+". Not able to instruct EPO for patent renewal.");
						renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.WAY_TOO_LATE);
					}
				}
			}
			
			else{
				log().debug("****RENEWAL WINDOW OPENED****");
				log().debug("Current renewal year is " + renewalInfo.getActiveRenewalYear() + " and renewal fee being paid up for year " + patent.getLastRenewedYearEpo()) ;
				
				if(renewalInfo.getActiveRenewalYear() == 3){
					/**
					 * THis is the case when patent being opened for first time renewal
					 */
					if(patent.getLastRenewedYearEpo() == 3){
						renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
					}
					else{
						//renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
						getCurrentPhaseAndStatus(renewalInfo);
					}
				}
				
				else if(RenewalStatusEnum.NO_RENEWAL_NEEDED.equals(patent.getRenewalStatus())){
					renewalInfo.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				
				else if(renewalInfo.getActiveRenewalYear() == patent.getLastRenewedYearEpo()){
					renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				}
				else if(renewalInfo.getActiveRenewalYear() == patent.getLastRenewedYearEpo()+1){
					if(RenewalStatusEnum.IN_PROGRESS.equals(patent.getRenewalStatus()) || RenewalStatusEnum.EPO_INSTRUCTED.equals(patent.getRenewalStatus())){
						log().debug("Renewal status is "+ patent.getRenewalStatus()+". ie, a renewal already in progress for the patent");
						getCurrentPhaseAndStatus(renewalInfo);
						//overwrite the status to status already in DB
						renewalInfo.setCurrentRenewalStatus(patent.getRenewalStatus());
					}
					else{
						//No change to status required
						//renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
						getCurrentPhaseAndStatus(renewalInfo);
						log().debug("Renewal status is "+ patent.getRenewalStatus() +". Changed patent status to " + renewalInfo.getCurrentRenewalStatus());
					}
				}
				else{
					renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.WAY_TOO_LATE);
				}
			}	
			
		}
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			
		}
		
		return renewalInfo;
	}
	
	
	
	public PatentExtendedData getExtendedDataForNewPatent(Patent patent){
		
		CostAnalysisDataEngine caEngine = new CostAnalysisDataEngine();
		String msg = PREFIX+"getExtendedDataForNewPatent(patent) ";
		log().debug("invoked : " + PREFIX +  msg);
		PatentExtendedData newPatentData = new PatentExtendedData();
		
		try {
	    			
	    	PatentStatus renewalInfo = getRenewalInfo(patent);
	    	
	    	if(renewalInfo == null){
	    		logErrorAndContinue("Error occured in calculating renewal dates for patent[" + patent.getPatentApplicationNumber() +"].");
	    		return null;
	    	}
	    	/** 
			 * Check whether current colour dates in Patent Status is NOT NULL if status is SHOW_PRICE
			 * If colour dates null it will throw Null Pointer Exception
			 * So this check is mandatory 
			 */
			if(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(renewalInfo.getCurrentRenewalStatus())){
				renewalInfo.setCurrentColorDates(getAllColorDates(renewalInfo.getRenewalDueDate()));
				if(renewalInfo.getCurrentColorDates() == null){
					log().error("Colour Dates null for due date "+ renewalInfo.getRenewalDueDate());
				}
			}

			patent.setRenewalYear(renewalInfo.getActiveRenewalYear());
			patent.setRenewalStatus(renewalInfo.getCurrentRenewalStatus());
			/**
			 * CHECKING WHETHER STATUS FROM EPO HAS ANY EFFECT IN RENEWAL STATUS
			 */
			patent = processEPOStatus(patent);
			//good to follow and not in doldrum: so we can show the prices
			//	either Show price or Renewal In Place
			//if(renewalInfo.getGoodFollowOn() && !renewalInfo.getDoldrums()){
			if(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(renewalInfo.getCurrentRenewalStatus())){
				log().debug("Patent holds a renewal status of SHOW_PRICE.");
				//caData = caEngine.getAllPhasesInfo(renewalDates);
				String currentPhase = renewalInfo.getColour().toString();
				CombinedFee fee = caEngine.getFeeObj(patent);
				
				//FeeUI currentfeeUI = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				Fee currentFee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				FeeUI currentfeeUI = new FeeUI(currentFee);
				
				/**
				 * MP23072018 1442 Temp fix to udjust the functionality to be able to Add Patent in Black period with Show price status
				 */
				/*FeeUI nextStageFeeUI = null;
				if(!currentPhase.equalsIgnoreCase(RenewalColourEnum.BLACK)) { //If black no next stage Fee
					//nextStageFeeUI = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); 
					Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); 
					nextStageFeeUI = new FeeUI(nextStageFee);
				}
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalInfo.getRenewalDueDate());
				newPatentData.setCurrentCostBand(renewalInfo.getColour().toString());
				newPatentData.setCurrentRenewalCost(currentfeeUI.getSubTotal_USD());
				newPatentData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
				newPatentData.setCostBandEndDate(getCostBandEnddate(renewalInfo).getTime());
				newPatentData.setActiveRenewalYear(patent.getRenewalYear());
				newPatentData.setCurrentRenewalStatus(patent.getRenewalStatus());*/
				
				FeeUI nextStageFeeUI = null;
				//if(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(renewalInfo.getCurrentRenewalStatus())) { //If renewal status is Show price then only we need to calculate the next stage price
					//nextStageFeeUI = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); 
					Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(renewalInfo), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); 
					nextStageFeeUI = new FeeUI(nextStageFee);
				//}
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalInfo.getRenewalDueDate());
				newPatentData.setCurrentCostBand(renewalInfo.getColour().toString());
				newPatentData.setCurrentRenewalCost(currentfeeUI.getSubTotal_USD());
				newPatentData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
				newPatentData.setCostBandEndDate(getCostBandEnddate(renewalInfo).getTime());
				newPatentData.setActiveRenewalYear(patent.getRenewalYear());
				newPatentData.setCurrentRenewalStatus(patent.getRenewalStatus());
			}
			else if(RenewalStatusEnum.TOO_LATE.equals(renewalInfo.getCurrentRenewalStatus())){
				log().debug("Patent holds a renewal status of TOO_Late.");
				String currentPhase = renewalInfo.getColour().toString();
				//No fee details to be send to FE
				/*CombinedFee fee = caEngine.getFeeObj(patent);
				Fee currentfee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				FeeUI currentFeeUI = new FeeUI(currentfee);
				Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				FeeUI nextStageFeeUI = new FeeUI(nextStageFee);*/
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalInfo.getRenewalDueDate());
				newPatentData.setCurrentCostBand(renewalInfo.getColour().toString());
				newPatentData.setCurrentRenewalCost(new BigDecimal(0.0));
				newPatentData.setRenewalCostNextStage(new BigDecimal(0.0));
				newPatentData.setCostBandEndDate(getCostBandEnddate(renewalInfo).getTime());
				newPatentData.setActiveRenewalYear(patent.getRenewalYear());
				newPatentData.setCurrentRenewalStatus(patent.getRenewalStatus());
			}
			else{
				log().debug("Patent holds a renewal status of " + renewalInfo.getCurrentRenewalStatus());
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalInfo.getRenewalDueDate());
				newPatentData.setCurrentCostBand(RenewalColourEnum.GREY); //WILL BE GREY
				newPatentData.setActiveRenewalYear(patent.getRenewalYear());
				newPatentData.setCurrentRenewalStatus(patent.getRenewalStatus());
				newPatentData.setCurrentRenewalCost(new BigDecimal(0.0));
				newPatentData.setRenewalCostNextStage(new BigDecimal(0.0));
			}
					
	    }
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
	    	
		return newPatentData;
		
	}
	
	public CalendarColour getAllColorDates(Date renewalDueDate) {
		
		CalendarColour colourDates = new CalendarColour();
		try{
	    	TypedQuery<CalendarColour> allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(renewalDueDate);
	    	colourDates = allColourDates.getSingleResult();
	    	//renewalDates.setCurrentColorDates(colourDates);
			//return renewalDates;
	    	if(colourDates == null){
	    		log().debug("No data found in calendar_colour table for renewal due date " + renewalDueDate.getTime());
	    		log().error("No data found in calendar_colour table for renewal due date " + renewalDueDate.getTime());
	    	}
		}
		catch(NullPointerException e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
    	return colourDates;
		
	}

	/**
	 * 
	 * @param PatentStatus
	 * @return current Colour and Status
	 * @throws ParseException 
	 */
	public PatentStatus getCurrentPhaseAndStatus(PatentStatus renewalInfo) throws ParseException{
		
		Calendar todaysDate = Calendar.getInstance();
		String msg = "getCurrentPhase()";
		log().debug( msg + " invoked for getting current phase");
		CalendarColour allColourDates = renewalInfo.getCurrentColorDates();
		if(renewalInfo.getCurrentColorDates() == null){
			log().error("Colour Dates is null. So msg returning null");
			return renewalInfo;
		}
		//CalendarColourDateUTC allColourDates1 = new CalendarColourDateUTC(allColourDates);
    	//Date todaysDate = new DateUtil().getTodaysDate();
		if(todaysDate.getTime().equals(allColourDates.getGreenStart()) || (todaysDate.getTime().after(allColourDates.getGreenStart())
				&& todaysDate.getTime().before(allColourDates.getBlackAllEnd()))){
			
			if(todaysDate.getTime().equals(allColourDates.getGreenStart())){
					renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.GREEN));
					renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if(todaysDate.getTime().after(allColourDates.getGreenStart()) && todaysDate.getTime().before(allColourDates.getAmberStart())){
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.GREEN));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if(todaysDate.getTime().equals(allColourDates.getAmberStart())){
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.AMBER));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if (todaysDate.getTime().after(allColourDates.getAmberStart()) && todaysDate.getTime().before(allColourDates.getRedStart())) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.AMBER));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if(todaysDate.getTime().equals(allColourDates.getRedStart())){
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.RED));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
			}
			
			else if (todaysDate.getTime().after(allColourDates.getRedStart()) && todaysDate.getTime().before(allColourDates.getBlueStart())) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.RED));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
			}
			
			else if(todaysDate.getTime().equals(allColourDates.getBlueStart())){
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.BLUE));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if (todaysDate.getTime().after(allColourDates.getBlueStart()) && todaysDate.getTime().before(allColourDates.getBlackStart())) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.BLUE));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if(todaysDate.getTime().equals(allColourDates.getBlackStart())){
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.BLACK));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if (todaysDate.getTime().after(allColourDates.getBlackStart()) && todaysDate.getTime().before(allColourDates.getBlackPhoneUpStart())) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.BLACK));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
			}
			
			else if (todaysDate.getTime().equals(allColourDates.getBlackPhoneUpStart()) || (todaysDate.getTime().after(allColourDates.getBlackPhoneUpStart()) && todaysDate.getTime().before(allColourDates.getBlackAllEnd()))) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.BLACK));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
			}
			
			
			else if (todaysDate.getTime().after(allColourDates.getBlackAllEnd())) {
				renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.GREY));
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.WAY_TOO_LATE);
			}
			
		}
		else{//CAN BE DOLDRUM OR TOO LATE TO RENEW
			renewalInfo.setColour(new RenewalColourEnum(RenewalColourEnum.GREY));
			renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.WAY_TOO_LATE);
		}
		
		log().debug( msg + " returning Current cost band is " + renewalInfo.getColour() + " and latest renewal status as " + renewalInfo.getCurrentRenewalStatus());
		return renewalInfo;
	}
	
	
	/**
	 * MP23072018 1442 Temp fix to udjust the functionality to be able to Add Patent in Black period with Show price status
	 * 
	 */
	//protected String getNextPhase(String currentPhase){
	protected String getNextPhase(PatentStatus renewalInfo){
		
		String err = PREFIX+"getNextPhase(currentPhase) ";
		String nextPhase = "";
		
		String currentPhase = renewalInfo.getColour().toString();
		
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.GREEN))
			nextPhase = RenewalColourEnum.AMBER;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.AMBER))
			nextPhase = RenewalColourEnum.RED;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.RED))
			nextPhase = RenewalColourEnum.BLUE;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLUE))
			nextPhase = RenewalColourEnum.BLACK;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLACK)){
			if(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(renewalInfo.getCurrentRenewalStatus()))
				nextPhase = RenewalColourEnum.BLACK;
			else
				nextPhase = RenewalColourEnum.GREY;
		}
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.GREY))
			nextPhase = RenewalColourEnum.GREEN;
		return nextPhase;
	}
	
	protected Calendar getCostBandEnddate(PatentStatus pStatus){
		
		String err = PREFIX+"getCostBandEnddate(allDates) ";
		Calendar cal = Calendar.getInstance();
		
		if(pStatus.getCurrentColorDates() == null){
			log().error("Colour Dates is null. So returning " + cal + "for method " + err);
			return cal;
		}
		
		if(pStatus.getColour().toString().equalsIgnoreCase(RenewalColourEnum.GREEN))
			cal.setTime(pStatus.getCurrentColorDates().getAmberStart());
		else if(pStatus.getColour().toString().equalsIgnoreCase(RenewalColourEnum.AMBER))
			cal.setTime(pStatus.getCurrentColorDates().getRedStart());
		else if(pStatus.getColour().toString().equalsIgnoreCase(RenewalColourEnum.RED))
			cal.setTime(pStatus.getCurrentColorDates().getBlueStart());
		else if(pStatus.getColour().toString().equalsIgnoreCase(RenewalColourEnum.BLUE))
			cal.setTime(pStatus.getCurrentColorDates().getBlackStart());
		else if(pStatus.getColour().toString().equalsIgnoreCase(RenewalColourEnum.BLACK))
			cal.setTime(pStatus.getCurrentColorDates().getBlackAllEnd());
		
		return cal;
	}
	
	/**
	 * 
	 * @param patent
	 * @return
	 * Overrides the renewal status property for the patent depending on EPO patent status
	 * 
	 */
	protected Patent processEPOStatus(Patent patent) {
		
		log().debug("Checking " + patent.getEpoPatentStatus().toUpperCase() + " has nay effect on Renewal Status for patent[" + patent.getId() + "]");
		/*String[] status_values_to_consider = {"PATENT GRANTED" , "PATENT LAPSED" , "PATENT REFUSED"};
		boolean isFound = stringContainsItemFromList(newStatus,status_values_to_consider);*/
		//Getting the status values from database. Ability to extend values as we going forward
		TypedQuery<PatentStatusNoRenewalNeeded> patentStatusOPS = PatentStatusNoRenewalNeeded.findPatentStatusNoRenewalNeededsByStatusText_OPS(patent.getEpoPatentStatus().toUpperCase());
		TypedQuery<PatentStatusNoRenewalNeeded> patentStatusEPO = PatentStatusNoRenewalNeeded.findPatentStatusNoRenewalNeededsByStatusText_EPO(patent.getEpoPatentStatus());
		if((!patentStatusOPS.getResultList().isEmpty()) || (!patentStatusEPO.getResultList().isEmpty())){
			
			patent.setRenewalStatus(RenewalStatusEnum.NO_RENEWAL_NEEDED);
			log().debug("The new status - " + patent.getEpoPatentStatus() + " means PATENT NOT RENEWABLE ANYMORE ");
				
			log().debug("The renewal status for Patent[" + patent.getId() +"] updated to " + patent.getRenewalStatus() + 
						" *** PATENT NOT GOOD TO FOLLOW ON *** ");
				//patent.merge();
		}
		else{
			log().debug("No entry in PATENTSTATUSNORENEWALNEEDED TABLE for the new status - " + patent.getEpoPatentStatus());
			log().debug("The new status - " + patent.getEpoPatentStatus() + " has no effect in renewal status");
			
		}
		
		return patent;
		
	}
	
}
