package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Patent;
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
	public PatentStatus getRenewalInfo(Patent patent){
		
		PatentStatus renewalInfo = new PatentStatus();
		
		Date todays = new DateUtil().getTodaysDate();
		RenewalDates allDates = getCurrentRenewalInfo(patent);
		
		
		renewalInfo.setNineMonthStart(allDates.getCurrentWindowOpenDate());
		renewalInfo.setNineMonthEnd(allDates.getCurrentWindowCloseDate());
		renewalInfo.setRenewalDueDate(allDates.getCurrentRenewalDueDate());
		
		Date lastRenewed = patent.getLastRenewedDateExEpo();
		
		if(todays.after(allDates.getCurrentWindowCloseDate())){
			//we are in doldrums
			//check whether last renewed date lies between current window dates
			if(lastRenewed.after(allDates.getCurrentWindowOpenDate()) && lastRenewed.before(allDates.getCurrentWindowCloseDate()) ){
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(true);
				renewalInfo.setDoldrums(true);
			}
			else{
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(false);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
				renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(true);
			}
		}
		
		else{
			
			if(allDates.getRenewalYear() == patent.getRenewalYear()){
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(true);
				renewalInfo.setDoldrums(false);
			}
			else if(allDates.getRenewalYear() == patent.getRenewalYear()+1){
				renewalInfo.setCanRenew(true);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
				renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(false);
			}
			else{
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(false);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
				renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(false);
			}
		}
		
		return renewalInfo;
	}
	
	
	public RenewalDates getCurrentRenewalInfo(Patent patent){
		
		
		log().debug("CostAnalysisDataEngine getRenewalWindowDates(patent) invoked : ");
		RenewalDates allDates = new RenewalDates();
		
	/**
	 * STEP 1 : Calculate the actual renewal due date [FOR THE CURRENT YEAR - THIS CALCULATED YEAR MAY OR MAY NOT BE THE CURRENT RENEWAL YEAR]
	 */
		
		/** 
		 * STEP 1.1 :- Calculating the next Renewal Due Date - get the last day of the month containing the anniversary of the filing Date
		 * 
		 */
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(patent.getFilingDate());
		
		Calendar monthEndFilingDate = Calendar.getInstance();
		
        /**
         * STEP 1.2 :- generate the date for this year with the last day of month of filing patent
         * 
         */
		
        int month = calendar.get(Calendar.MONTH);
        int year = calendar.get(Calendar.YEAR);
        int yearNow = Calendar.getInstance().get(Calendar.YEAR);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        
        monthEndFilingDate.set(year, month, day , 23,59);
        Calendar nextRenewalDate = Calendar.getInstance();
        nextRenewalDate.set(yearNow, month, day , 23,59);  
        System.out.println("Anniversary Date is "+ nextRenewalDate.getTime());
        Calendar actualCurrentRenewalDate = new DateUtil().getLastDayOfMonth(nextRenewalDate.getTime());
        System.out.println("Calculated renewal due for this year"+ actualCurrentRenewalDate.getTime());
        
        /**
         * STEP 1.3 :-Get the boundary dates for the above filing due date - 3 months prior and 6 months after
         */
        Calendar renewalStart = Calendar.getInstance();
        renewalStart.setTime(actualCurrentRenewalDate.getTime());
        renewalStart.add(Calendar.MONTH, -3);
        renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
        
        Calendar renewalEnd = Calendar.getInstance();
        renewalEnd.setTime(actualCurrentRenewalDate.getTime());
        System.out.println("Actual Due Date again" +actualCurrentRenewalDate.getTime());
        renewalEnd.add(Calendar.MONTH, 6);
        /** P3S WIndow close date is 2 days before the actual closing date **/
        renewalEnd.add(Calendar.DATE, -2);
        
        System.out.println("Calculated Window for this year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
        
        
        Calendar tempRenYearStart = Calendar.getInstance();
        tempRenYearStart.setTime(actualCurrentRenewalDate.getTime());
        tempRenYearStart.add(Calendar.MONTH, -6);    //due date - 6 months or renewalStart -6
        tempRenYearStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		
      /**
       * STEP 1.4 :- Get the current renewal year
       */
       
		/** STEP 1.4.1 - GET THE YEARS BETWEEN (Calculated renewal due for this year) AND (last day of month of filing patent) **/
        int yearsBetween = new DateUtil().getYearsBetweenDates(new DateUtil().getTodaysDate(), monthEndFilingDate.getTime());
        int renewalYear = yearsBetween + 1;
        
        /** STEP 1.4.2 - CHECK THE POSITION OF TODAYS DATE IN RNEWAL WINDOW  
         * 					
         * 				1. If todays date before tempRenYearStart, we are still in last years window
         * 						renewal year = renewal year - 1
         * 						Calculate window open and close for last year as set to allDates
         * 
         * 				2. If todays date after tempRenYearStart, we are in current years window
         * 						renewal year = renewal year
         * 						
         * **/
        
     /************************************************************************************************************************************************/   
        /*** NOTE : ASSUMING RENEWAL YEAR STARTS ON RENEWAL WINDOW START DATE AND ENDS ON THE DAY WHEN THE RENEWAL WINDOW FOR NEXT YEAR OPENS  **/
     /************************************************************************************************************************************************/
        
        Date todays = new DateUtil().getTodaysDate();
        if(todays.before(renewalStart.getTime())){
        	renewalYear = renewalYear-1;
        	
        	//Calculating Previous year details in the same way
            
            Calendar prevRenewalDate = Calendar.getInstance();
    	    prevRenewalDate.set(yearNow-1, month, day , 23,59);  
    	    System.out.println("Renewal date 1 year before " + prevRenewalDate.getTime());
    	    Calendar actualPrevRenewalDate = new DateUtil().getLastDayOfMonth(prevRenewalDate.getTime());
    	    System.out.println("This year renewal due "+ actualPrevRenewalDate.getTime());
    	    
    	    renewalStart = Calendar.getInstance();
    	    renewalStart.setTime(actualPrevRenewalDate.getTime());
    	    renewalStart.add(Calendar.MONTH, -3);
    	    renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
    	    
    	    renewalEnd = Calendar.getInstance();
    	    renewalEnd.setTime(actualPrevRenewalDate.getTime());
    	    System.out.println("Actual Due Date again" +actualPrevRenewalDate.getTime());
    	    renewalEnd.add(Calendar.MONTH, 6);
    	    
    	    /** P3S WIndow close date is 2 days before the actual closing date **/
            renewalEnd.add(Calendar.DATE, -2);
    	    System.out.println("Doldrums for previous year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
    	    
    	    allDates.setCurrentRenewalDueDate(prevRenewalDate.getTime());
    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
        }
        
        else{
        	allDates.setCurrentRenewalDueDate(actualCurrentRenewalDate.getTime());
    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
        }
        
        allDates.setRenewalYear(renewalYear);
        
        return allDates;
	}

	
	public Integer getRenewalYear(RenewalDates allDates, Patent patent){
		
		if(allDates == null){
			log().fatal("Passed null into");
			return 0;
		}
		
		
		Date todays = new DateUtil().getTodaysDate();
		if( todays.after(allDates.getCurrentWindowOpenDate()) && todays.before(allDates.getCurrentWindowCloseDate())){
			
		}
		return 1;
	}
	
	
public String getNextPhase(String currentPhase){
		
		String err = PREFIX+"getNextPhase(currentPhase) ";
		String nextPhase = "";
		
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.GREEN))
			nextPhase = RenewalColourEnum.AMBER;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.AMBER))
			nextPhase = RenewalColourEnum.RED;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.RED))
			nextPhase = RenewalColourEnum.BLUE;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLUE))
			nextPhase = RenewalColourEnum.BROWN;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BROWN))
			nextPhase = RenewalColourEnum.NOCOLOR;
		return nextPhase;
	}
	
	public Calendar getCostBandEnddate(CostAnalysisData caData){
		
		String err = PREFIX+"getCostBandEnddate(caData) ";
		Calendar cal = Calendar.getInstance();
		
		if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.GREEN))
			cal.setTime(caData.getAmberStartDate());
		else if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.AMBER))
			cal.setTime(caData.getRedStartDate());
		else if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.RED))
			cal.setTime(caData.getBlueStartDate());
		else if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.BLUE))
			cal.setTime(caData.getBrownStartDate());
		else if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.BROWN))
			cal.setTime(caData.getBrownEndDate());
		
		return cal;
	}
	
	
	public PostLoginSessionBean getExtendedDataForNewPatent(Patent patent, PostLoginSessionBean pLoginSession){
		
		CostAnalysisDataEngine caEngine = new CostAnalysisDataEngine();
		CostAnalysisData caData = new CostAnalysisData();
		
		String err = PREFIX+"getExtendedDataForNewPatent(session) ";
		log().debug("invoked : " + PREFIX +  err);
		
		
		try {
	    			
	    	PatentExtendedData newPatentData = new PatentExtendedData();
			RenewalDates renewalDates = caEngine.getRenewalWindowDates(patent);
			caData = caEngine.getAllPhasesInfo(renewalDates);
			String currentPhase = caEngine.getCurrentPhase(caData);
			CombinedFee fee = caEngine.getFeeObj(patent);
			FeeUI currentfeeUI = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
			FeeUI nextStageFeeUI = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					
			newPatentData.setPatentId(patent.getId());
			newPatentData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
			newPatentData.setCurrentCostBand(caData.getCurrentcostBand());
			newPatentData.setCurrentRenewalCost(currentfeeUI.getSubTotal_USD());
			newPatentData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
			newPatentData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
					
			if(pLoginSession.getExtendedPatentUI() == null){
				List<PatentExtendedData> firstData = new ArrayList<PatentExtendedData>();
				firstData.add(newPatentData);
				pLoginSession.setExtendedPatentUI(firstData);
			}
			else{
				
				List<PatentExtendedData> allData = pLoginSession.getExtendedPatentUI();
				allData.add(newPatentData);
				pLoginSession.setExtendedPatentUI(allData);
			}
				
	    }
		catch (Exception e) {
			e.printStackTrace();
		}
	    	
    	
    	
    	
		return pLoginSession;
		
	}
	
}
