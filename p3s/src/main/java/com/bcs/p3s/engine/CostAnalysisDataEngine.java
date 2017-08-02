package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.DiscountPercent;
import com.bcs.p3s.model.EpoFee;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

/**
 * This engine holds the actual processing methods
 * It includes all the common methods that can be accessed for accessing lots of data before displaying Dashboard
 * Both Pricing Engines and Date Engines
 * @author MerinP
 */

public class CostAnalysisDataEngine extends Universal{
	
	
	DateUtil utils = new DateUtil();
	public RenewalDates getRenewalWindowDates(Patent patent) throws ParseException{
	//public static void main(String[] args) throws ParseException{
		
		RenewalDates allDates = new RenewalDates();
		
	/**
	 * STEP 1 : Calculate the actual renewal due date
	 */
		
		/** 
		 * STEP 1.1 :- Calculatng th next Renewal Due Date - get te last day of the month containing the anniversary of the filing Date
		 * 
		 */
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(patent.getFilingDate());
		/*SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
		Date convertedDate = dateFormat.parse("02/05/2009");
		calendar.setTime(convertedDate);*/
		
        /**
         * STEP 1.2 :- generate the date for this year with the last day of month of filing patent
         * 
         */
		
        int month = calendar.get(Calendar.MONTH);
        int year = Calendar.getInstance().get(Calendar.YEAR);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        
        Calendar nextRenewalDate = Calendar.getInstance();
        nextRenewalDate.set(year, month, day , 23,59);  
        System.out.println("Anniversary Date is "+ nextRenewalDate.getTime());
        Calendar actualCurrentRenewalDate = getLastDayOfMonth(nextRenewalDate.getTime());
        System.out.println("This year renewal due "+ actualCurrentRenewalDate.getTime());
        
        /**
         * STEP 1.3 :-Get the boundary dates for the above filing due date - 3 months prior and 6 months after
         */
        Calendar renewalStart = Calendar.getInstance();
        renewalStart.setTime(actualCurrentRenewalDate.getTime());
        renewalStart.add(Calendar.MONTH, -3);
        renewalStart.setTime(utils.getMidnight(renewalStart.getTime()));
        
        Calendar renewalEnd = Calendar.getInstance();
        renewalEnd.setTime(actualCurrentRenewalDate.getTime());
        System.out.println("Actual Due Date again" +actualCurrentRenewalDate.getTime());
        renewalEnd.add(Calendar.MONTH, 6);
        
        System.out.println("Doldrums for current are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
        
        /**
         * STEP 1.4 :- Compare whether the last renewal date(FROM DB) lies in between start and end date 
         */
        Calendar lastReneweddate = Calendar.getInstance();
        lastReneweddate.setTime(patent.getLastRenewedDateExEpo());
		/*SimpleDateFormat dateFormat1 = new SimpleDateFormat("MM/dd/yyyy");
		Date convertedDate1 = dateFormat1.parse("02/05/2016");
		lastReneweddate.setTime(convertedDate1);*/
		
		if(lastReneweddate.after(renewalStart) && lastReneweddate.before(renewalEnd)){
			System.out.println("Renewal for filing Due "+ actualCurrentRenewalDate.getTime());
			allDates.setCurrentFilingDate(actualCurrentRenewalDate.getTime());
			allDates.setCurrentWindowOpenDate(renewalStart.getTime());
			allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
			
			/**
			 * GET THE NEXT YEAR'S RENEWAL INFO
			 */
			Calendar nextRenewalDueDate = Calendar.getInstance();
			nextRenewalDueDate.set(year+1, month, day , 23,59);  
            System.out.println("Renewal date 1 year after " + nextRenewalDueDate.getTime());
            Calendar actualNextRenewalDate = getLastDayOfMonth(nextRenewalDueDate.getTime());
            System.out.println("Next year renewal due "+ actualNextRenewalDate.getTime());
            
            renewalStart = Calendar.getInstance();
            renewalStart.setTime(actualNextRenewalDate.getTime());
            renewalStart.add(Calendar.MONTH, -3);
            renewalStart.setTime(utils.getMidnight(renewalStart.getTime()));
            
            renewalEnd = Calendar.getInstance();
            renewalEnd.setTime(actualNextRenewalDate.getTime());
            System.out.println("Actual Due Date again" +actualNextRenewalDate.getTime());
            renewalEnd.add(Calendar.MONTH, 6);
            System.out.println("Doldrums for next year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
            
            allDates.setNextFilingDate(actualNextRenewalDate.getTime());
            allDates.setNextWindowOpenDate(renewalStart.getTime());
            allDates.setNexttWindowCloseDate(renewalEnd.getTime());
		}
		
		/**
         * STEP 1.5 :- Get the previous year renewal due date and check whether last Renewd Date (FROM DB) lies in between start date and end date 
         */
		
		else{
			
			/**
			 * SET THE NEXT YEAR'S RENEWAL INFO AS PREVIOUSLY CALCULATED DATES
			 */
			allDates.setNextFilingDate(actualCurrentRenewalDate.getTime());
            allDates.setNextWindowOpenDate(renewalStart.getTime());
            allDates.setNexttWindowCloseDate(renewalEnd.getTime());
            
			Calendar prevRenewalDate = Calendar.getInstance();
            prevRenewalDate.set(year-1, month, day , 23,59);  
            System.out.println("Renewal date 1 year before " + prevRenewalDate.getTime());
            Calendar actualPrevRenewalDate = getLastDayOfMonth(prevRenewalDate.getTime());
            System.out.println("This year renewal due "+ actualPrevRenewalDate.getTime());
            
            renewalStart = Calendar.getInstance();
            renewalStart.setTime(actualPrevRenewalDate.getTime());
            renewalStart.add(Calendar.MONTH, -3);
            renewalStart.setTime(utils.getMidnight(renewalStart.getTime()));
            
            renewalEnd = Calendar.getInstance();
            renewalEnd.setTime(actualPrevRenewalDate.getTime());
            System.out.println("Actual Due Date again" +actualPrevRenewalDate.getTime());
            renewalEnd.add(Calendar.MONTH, 6);
            System.out.println("Doldrums for previous year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
            
            if(lastReneweddate.after(renewalStart) && lastReneweddate.before(renewalEnd)){
    			System.out.println("Renewal for filing Due "+ actualPrevRenewalDate.getTime());
    			allDates.setCurrentFilingDate(actualPrevRenewalDate.getTime());
    			allDates.setCurrentWindowOpenDate(renewalStart.getTime());
    			allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
    			
    		}
            else{
            	System.out.println("LOG PANIC ERROR THIS CASE");
            	System.out.println("SOMETHING WENT WRONG");
            }
		}
        
	/**
	* STEP 2 : Check whether renewal window still opened for the current filing due date
	*/
		Calendar todays = Calendar.getInstance();
		if((todays.getTime()).after(allDates.getCurrentWindowOpenDate()) && (todays.getTime()).before(allDates.getCurrentWindowCloseDate())){
			System.out.println("Renewal window still opened");
			allDates.setRenewalWindowStillOpened(true);
		}
		else{
			allDates.setRenewalWindowStillOpened(false);
		}
		
		
	return allDates;
	}
	
	
	
	/**
	 * This method gets called if Renewal_In_Place with window still opened or SHOW_PRICE 
	 * @param allDates
	 * @return 
	 * 		all phases start dates [GREEN, AMBER, RED, BLUE OR BROWN]
	 * 		also the currentPhase where we are right now
	 */
	public CostAnalysisData getAllPhasesInfo(RenewalDates allDates){
		
		CostAnalysisData caData = new CostAnalysisData();
		Date greenStart = allDates.getCurrentWindowOpenDate();
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getCurrentFilingDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getCurrentFilingDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getCurrentFilingDate(), -4));
		Date brownStart = utils.getMidnight(utils.addDays(allDates.getCurrentWindowCloseDate(), -10));
		
		caData.setGreenStartDate(greenStart);
		caData.setAmberStartDate(amberStart);
		caData.setRedStartDate(redStart);
		caData.setBlueStartDate(blueStart);
		caData.setBrownStartDate(brownStart);
		caData.setBrownEndDate(utils.addDays(allDates.getCurrentWindowCloseDate(), -2));
		System.out.println("Calculated Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBrownStartDate() + " " + caData.getBrownEndDate());
		
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(greenStart));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(amberStart));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(redStart));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blueStart));
		caData.setBrownStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(brownStart));
		caData.setBrownEndDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBrownEndDate()));
		
		if(allDates.isRenewalWindowStillOpened())
			caData.setCurrentcostBand(getCurrentPhase(caData));
		else
			caData.setCurrentcostBand(RenewalColourEnum.GREEN);
		
		return caData;
	}
	
	/**
	 * 
	 * @param caData
	 * @return current Phase 
	 */
	public String getCurrentPhase(CostAnalysisData caData){
		
		Calendar todaysDate = Calendar.getInstance();
		if((todaysDate.getTime()).after(caData.getGreenStartDate()) && (todaysDate.getTime()).before(caData.getBrownEndDate())){
			
			if((todaysDate.getTime()).after(caData.getGreenStartDate()) && (todaysDate.getTime()).before(caData.getAmberStartDate()))
				caData.setCurrentcostBand(RenewalColourEnum.GREEN);
			else if ((todaysDate.getTime()).after(caData.getAmberStartDate()) && (todaysDate.getTime()).before(caData.getRedStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.AMBER);
			else if ((todaysDate.getTime()).after(caData.getRedStartDate()) && (todaysDate.getTime()).before(caData.getBlueStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.RED);
			else if ((todaysDate.getTime()).after(caData.getBlueStartDate()) && (todaysDate.getTime()).before(caData.getBrownStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.BLUE);
			else if ((todaysDate.getTime()).after(caData.getBrownStartDate()) && (todaysDate.getTime()).before(caData.getBrownEndDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.BROWN);
			
		}
		return caData.getCurrentcostBand();
	}
	
	/**
	 * 
	 * @param caData (with only date values for each phase being set)
	 * @return caData plus costs for individual phases - sum up of costs for each phase ( NO BREAKDOWN COSTS )
	 */
	
	public CostAnalysisData getAllCosts(CostAnalysisData caData, P3SFeeSole p3sFee , EpoFee epoFee){
		
		CostAnalysisData caMoreData = caData;
		
		BigDecimal greenCost = new BigDecimal(0);
		BigDecimal amberCost = new BigDecimal(0);
		BigDecimal redCost = new BigDecimal(0);
		BigDecimal blueCost = new BigDecimal(0);
		BigDecimal brownCost = new BigDecimal(0);
		//below needs to be changed once MC starts sending daily rate files
		BigDecimal fxRate = new BigDecimal(1.0608);
		
		greenCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD());
		caMoreData.setGreenCost(greenCost);
		
		amberCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
					add(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setAmberCost(amberCost);
		
		redCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
				add(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setRedCost(redCost);
		blueCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).add(epoFee.getExtensionFee_EUR().multiply(fxRate)); 
		
		caMoreData.setBlueCost(blueCost);
		
		brownCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).add(epoFee.getExtensionFee_EUR().multiply(fxRate)).
				add((epoFee.getRenewalFee_EUR().add(epoFee.getExtensionFee_EUR())).multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)))); 
		
		caMoreData.setBrownCost(brownCost);
		
		return caMoreData;
	}
	
	/**
	 * 
	 * @param currentPhase
	 * @return fee UI object (breakdown fee) for @param phase
	 */
	
	public FeeUI getCurrentPhaseCost(String currentPhase, P3SFeeSole p3sFee , EpoFee epoFee, BigDecimal fxRate){
		
		FeeUI feeUI = new FeeUI(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0));
		
		
		BigDecimal greenCost = new BigDecimal(0);
		BigDecimal amberCost = new BigDecimal(0);
		BigDecimal redCost = new BigDecimal(0);
		BigDecimal blueCost = new BigDecimal(0);
		BigDecimal brownCost = new BigDecimal(0);
		
		
		if(RenewalColourEnum.GREEN .equals(currentPhase)){
			//greenCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate));
			greenCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD());
			feeUI.setRenewalFee_EUR(epoFee.getRenewalFee_EUR());
			feeUI.setRenewalFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate));
			feeUI.setProcessingFee_USD(p3sFee.getProcessingFee_USD());
			feeUI.setSubTotal_USD(greenCost);
		}
		
		else if(RenewalColourEnum.AMBER .equals(currentPhase)){
			//amberCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getExpressFee_Percent().multiply(fxRate));
			amberCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
					add(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
			feeUI.setRenewalFee_EUR(epoFee.getRenewalFee_EUR());
			feeUI.setRenewalFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate));
			feeUI.setProcessingFee_USD(p3sFee.getProcessingFee_USD());
			feeUI.setExpressFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
			feeUI.setSubTotal_USD(amberCost);
		}
		
		else if(RenewalColourEnum.RED .equals(currentPhase)){
			//redCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getUrgentFee_Percent().multiply(fxRate));
			redCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
					add(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100))));
			feeUI.setRenewalFee_EUR(epoFee.getRenewalFee_EUR());
			feeUI.setRenewalFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate));
			feeUI.setProcessingFee_USD(p3sFee.getProcessingFee_USD());
			feeUI.setUrgentFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100))));
			feeUI.setSubTotal_USD(redCost);
		}
		
		else if(RenewalColourEnum.BLUE .equals(currentPhase)){
			//blueCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoFee.getExtensionFee_EUR());
			blueCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).add(epoFee.getExtensionFee_EUR().multiply(fxRate));
			feeUI.setRenewalFee_EUR(epoFee.getRenewalFee_EUR());
			feeUI.setRenewalFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate));
			feeUI.setProcessingFee_USD(p3sFee.getProcessingFee_USD());
			feeUI.setExtensionFee_EUR(epoFee.getExtensionFee_EUR());
			feeUI.setExtensionFee_USD(epoFee.getExtensionFee_EUR().multiply(fxRate));
			feeUI.setSubTotal_USD(blueCost);
		}
		
		else if(RenewalColourEnum.BROWN .equals(currentPhase)){
			//brownCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoFee.getExtensionFee_EUR()).add(p3sFee.getUrgentFee_Percent());
			brownCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).add(epoFee.getExtensionFee_EUR().multiply(fxRate)).
					add((epoFee.getRenewalFee_EUR().add(epoFee.getExtensionFee_EUR())).multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)))); 
			
			feeUI.setRenewalFee_EUR(epoFee.getRenewalFee_EUR());
			feeUI.setRenewalFee_USD(epoFee.getRenewalFee_EUR().multiply(fxRate));
			feeUI.setProcessingFee_USD(p3sFee.getProcessingFee_USD());
			feeUI.setExtensionFee_EUR(epoFee.getExtensionFee_EUR());
			feeUI.setExtensionFee_USD(epoFee.getExtensionFee_EUR().multiply(fxRate));
			feeUI.setUrgentFee_USD((epoFee.getRenewalFee_EUR().add(epoFee.getExtensionFee_EUR())).multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
			feeUI.setSubTotal_USD(brownCost);
		}
			
		feeUI.setFxRate(fxRate);
		return feeUI;
	}

	public P3SFeeSole findDiscountedFees(DiscountPercent discount){
		
		P3SFeeSole p3sFee = new P3SFeeSole();
		P3SFeeSole qSoleFee = P3SFeeSole.findP3SFeeSole((long) 1); //assuming P3SSole having single entry every time
		
		BigDecimal processingFee = new BigDecimal(0);
		BigDecimal expressFee = new BigDecimal(0);
		BigDecimal urgentFee = new BigDecimal(0);
		BigDecimal latePayPenalty = new BigDecimal(0);
		
		//all discount values in %
		//EQUATION :- processing fee = processing fee -(processing fee * processing discount %)
		processingFee = qSoleFee.getProcessingFee_USD().subtract(qSoleFee.getProcessingFee_USD().multiply(discount.getProcessingFee()).divide(new BigDecimal(100)));
		//EQUATION :- urgent/express fee% = urgent/express % - discount % (25% - 5%) - Andy's discussion point
		//expressFee = qSoleFee.getExpressFee_Percent().subtract(qSoleFee.getExpressFee_Percent().multiply((discount.getExpressFee()).divide(new BigDecimal(100))));
		expressFee = qSoleFee.getExpressFee_Percent().subtract(discount.getExpressFee());
		//urgentFee = qSoleFee.getUrgentFee_Percent().subtract(qSoleFee.getUrgentFee_Percent().multiply((discount.getUrgentFee()).divide(new BigDecimal(100))));
		urgentFee = qSoleFee.getUrgentFee_Percent().subtract(discount.getUrgentFee());
		latePayPenalty = qSoleFee.getLatePayPenalty_USD().subtract(qSoleFee.getLatePayPenalty_USD().multiply((discount.getLatePayPenalty()).divide(new BigDecimal(100))));
		
		p3sFee.setProcessingFee_USD(processingFee);
		p3sFee.setExpressFee_Percent(expressFee);
		p3sFee.setUrgentFee_Percent(urgentFee);
		p3sFee.setLatePayPenalty_USD(latePayPenalty);
		
		return p3sFee;
	}
	
	
	public CostAnalysisData getNextPhasesInfo(RenewalDates allDates){
		
		CostAnalysisData caData = new CostAnalysisData();
		Date greenStart = allDates.getNextWindowOpenDate();
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getNextFilingDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getNextFilingDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getNextFilingDate(), -4));
		Date brownStart = utils.getMidnight(utils.addDays(allDates.getNexttWindowCloseDate(), -10));
		
		caData.setGreenStartDate(greenStart);
		caData.setAmberStartDate(amberStart);
		caData.setRedStartDate(redStart);
		caData.setBlueStartDate(blueStart);
		caData.setBrownStartDate(brownStart);
		caData.setBrownEndDate(utils.addDays(allDates.getNexttWindowCloseDate(), -2));
		System.out.println("Calculated Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBrownStartDate() + " " + caData.getBrownEndDate());
		
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(greenStart));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(amberStart));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(redStart));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blueStart));
		caData.setBrownStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(brownStart));
		caData.setBrownEndDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBrownEndDate()));
		
		
		caData.setCurrentcostBand(RenewalColourEnum.GREEN);
		
		return caData;
	
	}
	
	/**
	 * 
	 * @param caData
	 * @return Fx Variance for current phase in last 6 months 
	 *    format :- HashMap<Date,FeeUI> for last 6 months 
	 */
	public HashMap<String,FeeUI> getLineChartData(CostAnalysisData caData, P3SFeeSole p3sFee, EpoFee epoFee){
		
		
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		HashMap<String, FeeUI> lineChart = new HashMap<String, FeeUI>();
		
		archivedRateList = getArchivedData();
		lineChart = getAllFeeUI(archivedRateList,caData,p3sFee, epoFee);
		
		return lineChart;
	}
	
	public Calendar getLastDayOfMonth(Date date){
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, 1);  
        calendar.set(Calendar.DAY_OF_MONTH, 1);  
        calendar.add(Calendar.DATE, -1);  
        return calendar;
	}

	public List<Date> getLast5Days(){
		
		DateUtil utils = new DateUtil();
		int n =1;
		List<Date> dates = new ArrayList<Date>();
		
		Calendar calendar = Calendar.getInstance();
		
		while(dates.size() <=5 ){
			dates.add(utils.addDays(calendar.getTime(), -(n))); 
			n=n+1;
		}
		
		return dates;
		
	}
	
	
	/**
	 * 
	 * @return HashMap<Date, BigDecimal> with 
	 * 		Date being the last 5 days
	 * 		BigDecimal for corresponding fxRates
	 */
	public List<ArchivedRate> getArchivedData(){
		
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		//List<ArchivedRate> archivedRateListPart = new ArrayList<ArchivedRate>();
		
		archivedRateList = ArchivedRate.findArchivedRateEntries(0, 5);
		
		return archivedRateList;
	}
	
	
	public HashMap<String, FeeUI> getAllFeeUI(List<ArchivedRate> archivedRateList , CostAnalysisData caData, P3SFeeSole p3sFee, EpoFee epoFee){
		
		HashMap<String, FeeUI> lineChart = new HashMap<String, FeeUI>();
		
		Calendar calendar = Calendar.getInstance();
		lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(calendar.getTime()), caData.getFee());
		
		for (ArchivedRate eachData : archivedRateList) {
			
			FeeUI fee = new FeeUI(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0));
		    BigDecimal fxValue = eachData.getFxRate();
		    fee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoFee, fxValue);
		    lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(eachData.getActiveFromDate()), fee);
		}
		return lineChart;
	}
}
