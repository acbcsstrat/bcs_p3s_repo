package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.persistence.TypedQuery;

import org.apache.commons.lang3.concurrent.CallableBackgroundInitializer;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.FxRateUI;
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
 * This engine holds the actual processing methods for CostAnalysis Page
 * Both pricing and phase calculations being incorporated
 * @author MerinP
 */

public class CostAnalysisDataEngine extends Universal{
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	
	DateUtil utils = new DateUtil();
	
	public RenewalDates getRenewalWindowDates(Patent patent) throws ParseException{
		
		String msg =  PREFIX + "getRenewalWindowDates(patent)";
		log().debug(msg + " invoked for patent id [" + patent.getId() + "]");
		log().debug("CostAnalysisDataEngine getRenewalWindowDates(patent) invoked : ");
		
		
		RenewalDates allDates = new RenewalDatesEngine().getRenewalDates(patent);
        
	/**
	* Check whether renewal window still opened for the current filing due date
	*/
      //Calendar todays = Calendar.getInstance();
    	Date todays = new DateUtil().getTodaysDate();
    	if(allDates.getCurrentWindowOpenDate() == null){
    		allDates.setRenewalWindowStillOpened(false);
			log().debug("Renewal window is being **CLOSED** for patent [" + patent.getId() + "]");
			return allDates;
    	}
		if(todays.after(allDates.getCurrentWindowOpenDate()) && todays.before(allDates.getCurrentWindowCloseDate())){
			System.out.println("Renewal window still opened");
			allDates.setRenewalWindowStillOpened(true);
			log().debug("Renewal window **OPENED** for patent [" + patent.getId() + "]");
		}
		else{
			allDates.setRenewalWindowStillOpened(false);
			log().debug("Renewal window is being **CLOSED** for patent [" + patent.getId() + "]");
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
		
		String msg = "getAllPhasesInfo(allDates)";
		log().debug(msg + " invoked");
		
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
		
		log().debug("Calculated Dates in the order as ::: " + caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
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
		String msg = "getCurrentPhase()";
		log().debug( msg + " invoked for getting current phase");
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
		
		log().debug( msg + " returning Current cost band is " + caData.getCurrentcostBand());
		return caData.getCurrentcostBand();
	}
	
	/**
	 * 
	 * @param caData (with only date values for each phase being set)
	 * @return caData plus costs for individual phases - sum up of costs for each phase ( NO BREAKDOWN COSTS )
	 */
	
	public CostAnalysisData getAllCosts(CostAnalysisData caData, P3SFeeSole p3sFee , EpoFee epoFee, BigDecimal fxRate){
		
		CostAnalysisData caMoreData = caData;
		
		String msg = PREFIX + "getAllCosts()";
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
		
		log().debug( "getAllCosts() returning with fees respectively as " + caMoreData.getGreenStageCost() + " , " +
				caMoreData.getAmberStageCost() + " , " + caMoreData.getRedStageCost() + " , " +
				caMoreData.getBlueStageCost() + " , " + caMoreData.getBlackStageCost() + " , ");
		
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
	 * @return Fx Variance for current phase in last 6 weeks
	 *    format :- TreeMap<Date,FeeUI> for last 6 weeks 
	 */
	public TreeMap<Date,FeeUI> getLineChartData(CostAnalysisData caData, P3SFeeSole p3sFee, EpoFee epoFee){
		
		
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		TreeMap<Date, FeeUI> lineChart = new TreeMap<Date, FeeUI>();
		
		archivedRateList = getArchivedDataFor6Weeks();
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

	
	/**
	 * 
	 * @return HashMap<Date, BigDecimal> with 
	 * 		Date being the last 5 days
	 * 		BigDecimal for corresponding fxRates
	 */
	public List<ArchivedRate> getArchivedData(){
		
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		archivedRateList = ArchivedRate.findListArchivedRate();
		return archivedRateList;
	}
	
	/**
	 * 
	 * @return HashMap<Date, BigDecimal> with 
	 * 		Date being the last 6 weeks
	 * 		BigDecimal for corresponding fxRates
	 */
	public List<ArchivedRate> getArchivedDataFor6Weeks(){
		
		List<ArchivedRate> weeksRates = new ArrayList<ArchivedRate>();
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		archivedRateList = ArchivedRate.findAllArchivedRates();
		Collections.reverse(archivedRateList);
		int i = 6;
		//GETTING THE 7th, 14th, 21st etc values from the list
		for(ArchivedRate eachDay : archivedRateList ){
			if(weeksRates.size() >= 7){
				break;
			}
			weeksRates.add(archivedRateList.get(i));
			i=i+7;
		}
		
		return weeksRates;
	}
	
	
	public TreeMap<Date, FeeUI> getAllFeeUI(List<ArchivedRate> history , CostAnalysisData caData, P3SFeeSole p3sFee, EpoFee epoFee){
		
		TreeMap<Date, FeeUI> lineChart = new TreeMap<Date, FeeUI>();
		
		//first entry as todays rate
		Calendar calendar = Calendar.getInstance();
		
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal fxRate = current.getCurrent_P3S_rate();
		Fee todaysFee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoFee, fxRate);
		FeeUI feeUI = new FeeUI(todaysFee);
		feeUI.setFeeActiveDate(utils.dateToUSStringWithTimeandZone(calendar.getTime()));
		lineChart.put(calendar.getTime(),feeUI);
		
		final long ONEDAY = 24 * 3600 * 1000;
		for (ArchivedRate eachData : history) {
			
			Fee fee = new Fee(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0));
		    BigDecimal fxValue = eachData.getFxRate_P3s();
		    fee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoFee, fxValue);
		    //NOW POPULATE FEEUI 
		    feeUI = new FeeUI(fee);
			// To convert archived date to active date, substract one day (isGoodEnuf)
			Date becameActiveDate = new Date( eachData.getArchivedDate().getTime() - ONEDAY );
			// formerly: lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(eachData.getActiveFromDate()), feeUI);
			feeUI.setFeeActiveDate(utils.dateToUSStringWithTimeandZone(becameActiveDate));
		    //lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(becameActiveDate), feeUI);
			lineChart.put(becameActiveDate,feeUI);
		}
		
		return lineChart;
	}
	
	
	public CombinedFee getFeeObj(Patent patent){
		
		String msg = PREFIX + " getFeeObj(" + patent.getId() + ")" ;
		log().debug(msg +" invoked for patent [" + patent.getId() + "]");
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
			log().debug("Current patent [id = " + patent.getId() + "] is ELIGIBLE for DISCOUNTED FEES");
			isDiscountedRate = true;
			DiscountPercent discountRate = query.getSingleResult();
			p3sFee = costEngines.findDiscountedFees(discountRate);
		}
		else{
			log().debug("Current patent [id = " + patent.getId() + "] is NOT ELIGIBLE for DISCOUNTED FEES");
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
		
		/**
		 * SAFE CHECK FOR PATENTS WITH RENEWAL YEAR LESS THAN 3
		 * Solution :- set renewal year to 3 (in future) which is the nearest year for renewal
		 */
		if(epoFee.getRenewalYear() < 3){
			log().debug("Patent renewal year < 3 , so set the Renewal Year to 3 which is the nearest");
			epoFee.setRenewalYear(3);
		}
		epoFee = EpoFee.findEpoFeesByRenewalYear(epoFee);
		
		combinedFee.setP3sFee(p3sFee);
		combinedFee.setEpoFee(epoFee);
		combinedFee.setFxRate(fxRate);
		
		log().debug(msg + " returning with calculated fees for RENEWAL YEAR ["+ patent.getRenewalYear() +"]as :: "
						+ "Express Fee Percent= " + combinedFee.getP3sFee().getExpressFee_Percent()
				 		+ ", Processing Fee USD = " + combinedFee.getP3sFee().getProcessingFee_USD()
		 				+ ", Urgent Fee Percent = " + combinedFee.getP3sFee().getUrgentFee_Percent()
		 				+ ", Renewal Fee EUR = " + combinedFee.getEpoFee().getRenewalFee_EUR()
		 				+ ", Extension Fee EUR = " + combinedFee.getEpoFee().getExtensionFee_EUR());
		
		return combinedFee;
	}
	
	
	
	
}
