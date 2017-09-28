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
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.CombinedFee;

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
		
		log().debug("CostAnalysisDataEngine getRenewalWindowDates(patent) invoked : ");
		
		
		RenewalDates allDates = new RenewalDatesEngine().getRenewalDates(patent);
        
	/**
	* Check whether renewal window still opened for the current filing due date
	*/
      //Calendar todays = Calendar.getInstance();
    	Date todays = new DateUtil().getTodaysDate();
		if(todays.after(allDates.getCurrentWindowOpenDate()) && todays.before(allDates.getCurrentWindowCloseDate())){
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
	 * 		all phases start dates [GREEN, AMBER, RED, BLUE OR BLACK]
	 * 		also the currentPhase where we are right now
	 */
	public CostAnalysisData getAllPhasesInfo(RenewalDates allDates){
		
		CostAnalysisData caData = new CostAnalysisData();
		Date greenStart = allDates.getCurrentWindowOpenDate();
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getCurrentRenewalDueDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getCurrentRenewalDueDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getCurrentRenewalDueDate(), -4));
		Date blackStart = utils.getMidnight(utils.addDays(allDates.getCurrentWindowCloseDate(), -10));
		
		caData.setGreenStartDate(greenStart);
		caData.setAmberStartDate(amberStart);
		caData.setRedStartDate(redStart);
		caData.setBlueStartDate(blueStart);
		caData.setBlackStartDate(blackStart);
		//caData.setBrownEndDate(utils.addDays(allDates.getCurrentWindowCloseDate(), -2));
		caData.setBlackEndDate(allDates.getCurrentWindowCloseDate());
		System.out.println("Calculated Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackEndDate());
		
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(greenStart));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(amberStart));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(redStart));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blueStart));
		caData.setBlackStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blackStart));
		caData.setBlackEndDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackEndDate()));
		
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
		
		//Calendar todays = Calendar.getInstance();
    	Date todaysDate = new DateUtil().getTodaysDate();
		if(todaysDate.after(caData.getGreenStartDate()) && todaysDate.before(caData.getBlackEndDate())){
			
			if(todaysDate.after(caData.getGreenStartDate()) && todaysDate.before(caData.getAmberStartDate()))
				caData.setCurrentcostBand(RenewalColourEnum.GREEN);
			else if (todaysDate.after(caData.getAmberStartDate()) && todaysDate.before(caData.getRedStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.AMBER);
			else if (todaysDate.after(caData.getRedStartDate()) && todaysDate.before(caData.getBlueStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.RED);
			else if (todaysDate.after(caData.getBlueStartDate()) && todaysDate.before(caData.getBlackStartDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.BLUE);
			else if (todaysDate.after(caData.getBlackStartDate()) && todaysDate.before(caData.getBlackEndDate())) 
				caData.setCurrentcostBand(RenewalColourEnum.BLACK);
			
		}
		else{//CAN BE DOLDRUM OR TOO LATE TO RENEW
			caData.setCurrentcostBand(RenewalColourEnum.NOCOLOR);
		}
		return caData.getCurrentcostBand();
	}
	
	/**
	 * 
	 * @param caData (with only date values for each phase being set)
	 * @return caData plus costs for individual phases - sum up of costs for each phase ( NO BREAKDOWN COSTS )
	 */
	
	public CostAnalysisData getAllCosts(CostAnalysisData caData, P3SFeeSole p3sFee , EpoFee epoFee, BigDecimal fxRate){
		
		CostAnalysisData caMoreData = caData;
		
		BigDecimal greenCost = new BigDecimal(0);
		BigDecimal amberCost = new BigDecimal(0);
		BigDecimal redCost = new BigDecimal(0);
		BigDecimal blueCost = new BigDecimal(0);
		BigDecimal blackCost = new BigDecimal(0);
		
		//below needs to be changed once MC starts sending daily rate files
		//BigDecimal fxRate = new BigDecimal(0.88);
		
		greenCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD());
		caMoreData.setGreenStageCost(greenCost.setScale(2, BigDecimal.ROUND_CEILING));
		
		amberCost = greenCost.add(greenCost.multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setAmberStageCost(amberCost.setScale(2, BigDecimal.ROUND_CEILING)); 
		
		redCost = greenCost.add(greenCost.multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setRedStageCost(redCost.setScale(2, BigDecimal.ROUND_CEILING));
		blueCost = greenCost.add(epoFee.getExtensionFee_EUR().multiply(fxRate)); 
		
		caMoreData.setBlueStageCost(blueCost.setScale(2, BigDecimal.ROUND_CEILING));
		
		blackCost = blueCost.add(blueCost.multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setBlackStageCost(blackCost.setScale(2, BigDecimal.ROUND_CEILING));
		
		return caMoreData;
	}
	
	/**
	 * 
	 * @param currentPhase
	 * @return fee object (breakdown fee) for @param phase
	 */
	
	public Fee getCurrentPhaseCost(String currentPhase, P3SFeeSole p3sFee , EpoFee epoFee, BigDecimal fxRate){
		
		Fee fee = new Fee(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0));
		//Fee fee = new Fee();
		
		BigDecimal subTotalUSD = new BigDecimal(0.0);
		BigDecimal renewalFeeEUR = epoFee.getRenewalFee_EUR();
		BigDecimal renewalFeeUSD = renewalFeeEUR.multiply(fxRate); 
		BigDecimal extensionFeeEUR = epoFee.getExtensionFee_EUR();
		BigDecimal extensionFeeUSD = extensionFeeEUR.multiply(fxRate);
		BigDecimal processingFeeUSD = p3sFee.getProcessingFee_USD();
		
		BigDecimal baseCostUSD = renewalFeeUSD.add(processingFeeUSD);
		
		BigDecimal expressFeeUSD = baseCostUSD.multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)));
		BigDecimal urgentFeeUSD = baseCostUSD.multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100)));
		
		
		//setting the base costs to fee objects
		fee.setFxRate(fxRate);
		fee.setRenewalFee_EUR(renewalFeeEUR);
		fee.setProcessingFee_USD(processingFeeUSD);
		
		
		if(RenewalColourEnum.GREEN .equals(currentPhase)){
			//greenCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate));
			
			fee.setSubTotal_USD(baseCostUSD.setScale(2, BigDecimal.ROUND_CEILING));
		}
		
		else if(RenewalColourEnum.AMBER .equals(currentPhase)){
			//amberCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getExpressFee_Percent().multiply(fxRate));
			/*amberCost = epoFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
					add(epoFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));*/
			
			subTotalUSD = baseCostUSD.add(expressFeeUSD);
			
			fee.setExpressFee_USD(expressFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_CEILING));

		}
		
		else if(RenewalColourEnum.RED .equals(currentPhase)){
			//redCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getUrgentFee_Percent().multiply(fxRate));
			subTotalUSD = baseCostUSD.add(urgentFeeUSD);

			fee.setUrgentFee_USD(urgentFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_CEILING));

		}
		
		else if(RenewalColourEnum.BLUE .equals(currentPhase)){ 
			//blueCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoFee.getExtensionFee_EUR());
			subTotalUSD = baseCostUSD.add(extensionFeeUSD);
			
			fee.setExtensionFee_EUR(extensionFeeEUR);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_CEILING));

		}
		
		else if(RenewalColourEnum.BLACK .equals(currentPhase)){
			//brownCost = epoFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoFee.getExtensionFee_EUR()).add(p3sFee.getUrgentFee_Percent());
			//blackCost = baseCost.add(epoFee.getExtensionFee_EUR().multiply(fxRate)).
			//		add((epoFee.getRenewalFee_EUR().add(epoFee.getExtensionFee_EUR())).multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)))); 
			
			BigDecimal expressExtensionFeeUSD = (baseCostUSD.add(extensionFeeUSD)).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)));
			subTotalUSD = baseCostUSD.add(extensionFeeUSD).add(expressExtensionFeeUSD);

			fee.setExtensionFee_EUR(epoFee.getExtensionFee_EUR());
			fee.setExpressFee_USD(expressExtensionFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_CEILING));
		}
		
		
		return fee;
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
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getNextRenewalDueDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getNextRenewalDueDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getNextRenewalDueDate(), -4));
		Date blackStart = utils.getMidnight(utils.addDays(allDates.getNexttWindowCloseDate(), -10));
		
		caData.setGreenStartDate(greenStart);
		caData.setAmberStartDate(amberStart);
		caData.setRedStartDate(redStart);
		caData.setBlueStartDate(blueStart);
		caData.setBlackStartDate(blackStart);
		//caData.setBrownEndDate(utils.addDays(allDates.getNexttWindowCloseDate(), -2));
		caData.setBlackEndDate(allDates.getNexttWindowCloseDate());
		System.out.println("Calculated Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackEndDate());
		
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(greenStart));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(amberStart));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(redStart));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blueStart));
		caData.setBlackStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(blackStart));
		caData.setBlackEndDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackEndDate()));
		
		
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
		//MP - need to look into this method later
		archivedRateList = ArchivedRate.findArchivedRateEntries(0, 5); //getting the last 6 days rate
		
		return archivedRateList;
	}
	
	
	public HashMap<String, FeeUI> getAllFeeUI(List<ArchivedRate> archivedRateList , CostAnalysisData caData, P3SFeeSole p3sFee, EpoFee epoFee){
		
		HashMap<String, FeeUI> lineChart = new HashMap<String, FeeUI>();
		
		Calendar calendar = Calendar.getInstance();
		lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(calendar.getTime()), caData.getFee());
		
		final long ONEDAY = 24 * 3600 * 1000;
		for (ArchivedRate eachData : archivedRateList) {
			
			Fee fee = new Fee(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0));
		    BigDecimal fxValue = eachData.getFxRate_P3s();
		    fee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoFee, fxValue);
		    //NOW POPULATE FEEUI 
		    FeeUI feeUI = new FeeUI(fee);
			// To convert archived date to active date, substract one day (isGoodEnuf)
			Date becameActiveDate = new Date( eachData.getArchivedDate().getTime() - ONEDAY );
			// formerly: lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(eachData.getActiveFromDate()), feeUI);
		    lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(becameActiveDate), feeUI);
		}
		return lineChart;
	}
	
	
	public CombinedFee getFeeObj(Patent patent){
		
		CombinedFee combinedFee = new CombinedFee();
		P3SFeeSole p3sFee = new P3SFeeSole();
		EpoFee epoFee = new EpoFee();
		CostAnalysisDataEngine costEngines = new CostAnalysisDataEngine();
		
		boolean isDiscountedRate = false; //a boolean value to check whether the business has got any discount rates
		//boolean renewalWindowOpened = false;  // a boolean value to determine whether we are still in doldrums
		RenewalDates allDates = new RenewalDates();
		
		System.out.println("Got the new patent with filing date as " + patent.getFilingDate());
		
		/** Check whether current business has got any reduced Fees.
		 * 		If so get the discounted rates ( PROCESSING FEE, EXPRESS FEE, URGENT FEE AND LATE PAY PENALTY )
		 * 		Else get the actual P3SFEESOLE entries
		 *  **/
		TypedQuery<DiscountPercent> query  =  DiscountPercent.findDiscountPercentsByBusiness(patent.getBusiness());
		if(query.getResultList().size() > 0){
			isDiscountedRate = true;
			DiscountPercent discountRate = query.getSingleResult();
			p3sFee = costEngines.findDiscountedFees(discountRate);
		}
		else{
			p3sFee = P3SFeeSole.findP3SFeeSole((long) 1);  //passing 1 as P3SSoleFee will be having single entry every time 
		}
		
		/**
		 * GET THE FX RATE FROM DB
		 */
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal fxRate = current.getCurrent_P3S_rate();
		//fxRate = fxRate.setScale(4, BigDecimal.ROUND_CEILING);
		
		/**
		 * GET THE EPO FEES FOR THE CURRENT RENEWAL YEAR 
		 */
		epoFee.setRenewalYear(patent.getRenewalYear());
		epoFee = EpoFee.findEpoFeesByRenewalYear(epoFee);
		
		combinedFee.setP3sFee(p3sFee);
		combinedFee.setEpoFee(epoFee);
		combinedFee.setFxRate(fxRate);
		
		return combinedFee;
	}
	
}
