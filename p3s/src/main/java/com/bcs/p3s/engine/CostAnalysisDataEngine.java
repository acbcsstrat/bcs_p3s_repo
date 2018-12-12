package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.TreeMap;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.Form1200FeeUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.display.RenewalFeeUI;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.model.DiscountPercent;
import com.bcs.p3s.model.EpoRenewalFee;
import com.bcs.p3s.model.RenewalFee;
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
	*//*
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
		}*/
		
		
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
		log().debug(msg + " invoked for retrieving all colour dates for Renewal Due Date "+ allDates.getCurrentRenewalDueDate());
		
		CostAnalysisData caData = new CostAnalysisData();
		//Commenting below as we are getting data from table calendar_colour
		/*Date greenStart = allDates.getCurrentWindowOpenDate();
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getCurrentRenewalDueDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getCurrentRenewalDueDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getCurrentRenewalDueDate(), -4));
		Date blackStart = utils.getMidnight(utils.addDays(allDates.getCurrentWindowCloseDate(), -10));*/
		
		CalendarColour colourDates = new CalendarColour();
    	TypedQuery<CalendarColour> allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(allDates.getCurrentRenewalDueDate());
    	colourDates = allColourDates.getSingleResult();
		caData.setGreenStartDate(colourDates.getGreenStart());
		caData.setAmberStartDate(colourDates.getAmberStart());
		caData.setRedStartDate(colourDates.getRedStart());
		caData.setBlueStartDate(colourDates.getBlueStart());
		caData.setBlackStartDate(colourDates.getBlackStart());
		//caData.setBrownEndDate(utils.addDays(allDates.getCurrentWindowCloseDate(), -2));
		caData.setBlackPhoneUpStart(colourDates.getBlackPhoneUpStart());
		caData.setBlackAllEnd(colourDates.getBlackAllEnd());
		System.out.println("Calculated Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackPhoneUpStart() + " " + caData.getBlackAllEnd());
		
		log().debug("Calculated Dates in the order as ::: " + caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackPhoneUpStart() + " " + caData.getBlackAllEnd());
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getGreenStartDate()));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getAmberStartDate()));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getRedStartDate()));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlueStartDate()));
		caData.setBlackStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackStartDate()));
		caData.setBlackPhoneUpStartUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackPhoneUpStart()));
		caData.setBlackAllEndUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackAllEnd()));
		
		if(allDates.isRenewalWindowOpened())
			caData.setCurrentcostBand(getCurrentPhase(caData));
		else
			caData.setCurrentcostBand(RenewalColourEnum.GREY);
		
		
		return caData;
	}
	
	/**
	 * 
	 * @param caData
	 * @return current Phase 
	 */
	public String getCurrentPhase(CostAnalysisData caData){
		
		Calendar todaysDate = Calendar.getInstance();
		String msg = "getCurrentPhase()";
		log().debug( msg + " invoked for getting current Renewal colour");
    	//Date todaysDate = new DateUtil().getTodaysDate();
		
		if(todaysDate.getTime().equals(caData.getGreenStartDate()) || (todaysDate.getTime().after(caData.getGreenStartDate())
				&& todaysDate.getTime().before(caData.getBlackAllEnd()))){
			
			if(todaysDate.getTime().equals(caData.getGreenStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.GREEN);
			}
			
			else if(todaysDate.getTime().after(caData.getGreenStartDate()) && todaysDate.getTime().before(caData.getAmberStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.GREEN);
			}
			
			else if(todaysDate.getTime().equals(caData.getAmberStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.AMBER);
			}
			
			else if (todaysDate.getTime().after(caData.getAmberStartDate()) && todaysDate.getTime().before(caData.getRedStartDate())) {
				caData.setCurrentcostBand(RenewalColourEnum.AMBER);
			}
			
			else if(todaysDate.getTime().equals(caData.getRedStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.RED);
			}
			
			else if (todaysDate.getTime().after(caData.getRedStartDate()) && todaysDate.getTime().before(caData.getBlueStartDate())) {
				caData.setCurrentcostBand(RenewalColourEnum.RED);
			}
			
			else if(todaysDate.getTime().equals(caData.getBlueStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.BLUE);
			}
			
			else if (todaysDate.getTime().after(caData.getBlueStartDate()) && todaysDate.getTime().before(caData.getBlackStartDate())) {
				caData.setCurrentcostBand(RenewalColourEnum.BLUE);
				BigDecimal uplift = caData.getCurrentOfficialFeeEUR().multiply(new BigDecimal(1.5)); // cludge
				caData.setCurrentOfficialFeeUSD(uplift.setScale(2, RoundingMode.HALF_UP));
			}
			
			else if(todaysDate.getTime().equals(caData.getBlackStartDate())){
				caData.setCurrentcostBand(RenewalColourEnum.BLACK);
			}
			
			else if (todaysDate.getTime().after(caData.getBlackStartDate()) && todaysDate.getTime().before(caData.getBlackPhoneUpStart())) {
				caData.setCurrentcostBand(RenewalColourEnum.BLACK);
				BigDecimal uplift = caData.getCurrentOfficialFeeEUR().multiply(new BigDecimal(1.5));
				caData.setCurrentOfficialFeeUSD(uplift.setScale(2, RoundingMode.HALF_UP));
			}
			
			else if (todaysDate.getTime().equals(caData.getBlackPhoneUpStart()) || (todaysDate.getTime().after(caData.getBlackPhoneUpStart()) && todaysDate.getTime().before(caData.getBlackAllEnd()))) {
				caData.setCurrentcostBand(RenewalColourEnum.BLACK);
				BigDecimal uplift = caData.getCurrentOfficialFeeEUR().multiply(new BigDecimal(1.5));
				caData.setCurrentOfficialFeeUSD(uplift.setScale(2, RoundingMode.HALF_UP));
			}
			
			
			else if (todaysDate.getTime().after(caData.getBlackAllEnd())) {
				caData.setCurrentcostBand(RenewalColourEnum.GREY);
				log().warn(msg + " returned unexpected result.");
			}
			
		}
		else{//CAN BE DOLDRUM OR TOO LATE TO RENEW
			caData.setCurrentcostBand(RenewalColourEnum.GREY);
		}
		
		log().debug( msg + " returning Current Renewal Colour " + caData.getCurrentcostBand());
		return caData.getCurrentcostBand();
	}
	
	/**
	 * 
	 * @param caData (with only date values for each phase being set)
	 * @return caData plus costs for individual phases - sum up of costs for each phase ( NO BREAKDOWN COSTS )
	 */
	
	public CostAnalysisData getAllCosts(CostAnalysisData caData, P3SFeeSole p3sFee , EpoRenewalFee epoRenewalFee, BigDecimal fxRate){
		
		CostAnalysisData caMoreData = caData;
		
		String msg = PREFIX + "getAllCosts()";
		log().debug(msg +" invoked for calculating individual Renewal Colour fees");
		BigDecimal greenCost = new BigDecimal(0);
		BigDecimal amberCost = new BigDecimal(0);
		BigDecimal redCost = new BigDecimal(0);
		BigDecimal blueCost = new BigDecimal(0);
		BigDecimal blackCost = new BigDecimal(0);
		
		//below line needs be commented once MC starts sending daily rate files
		//BigDecimal fxRate = new BigDecimal(0.88);
		
		greenCost = epoRenewalFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD());
		caMoreData.setGreenStageCost(greenCost.setScale(2, BigDecimal.ROUND_HALF_UP));
		caMoreData.setCurrentOfficialFeeEUR(caMoreData.getGreenStageCost());
		
		amberCost = greenCost.add(greenCost.multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setAmberStageCost(amberCost.setScale(2, BigDecimal.ROUND_HALF_UP)); 
		
		redCost = greenCost.add(greenCost.multiply(p3sFee.getUrgentFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setRedStageCost(redCost.setScale(2, BigDecimal.ROUND_HALF_UP));
		blueCost = greenCost.add(epoRenewalFee.getExtensionFee_EUR().multiply(fxRate)); 
		
		caMoreData.setBlueStageCost(blueCost.setScale(2, BigDecimal.ROUND_HALF_UP));
		
		blackCost = blueCost.add(blueCost.multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));
		
		caMoreData.setBlackStageCost(blackCost.setScale(2, BigDecimal.ROUND_HALF_UP));
		
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
	
	public RenewalFee getCurrentPhaseCost(String currentPhase, P3SFeeSole p3sFee , EpoRenewalFee epoRenewalFee, BigDecimal fxRate){
		
		String msg = PREFIX + "getCurrentPhaseCost()";
		log().debug(msg +" invoked for calculating current Renewal colour fee breakdown");
		
		RenewalFee fee = new RenewalFee(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0));
		//Fee fee = new Fee();
		
		BigDecimal subTotalUSD = new BigDecimal(0.0);
		BigDecimal renewalFeeEUR = epoRenewalFee.getRenewalFee_EUR();
		BigDecimal renewalFeeUSD = renewalFeeEUR.multiply(fxRate); 
		BigDecimal extensionFeeEUR = epoRenewalFee.getExtensionFee_EUR();
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
			//greenCost = epoRenewalFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate));
			
			fee.setSubTotal_USD(baseCostUSD.setScale(2, BigDecimal.ROUND_HALF_UP));
		}
		
		else if(RenewalColourEnum.AMBER .equals(currentPhase)){
			//amberCost = epoRenewalFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getExpressFee_Percent().multiply(fxRate));
			/*amberCost = epoRenewalFee.getRenewalFee_EUR().multiply(fxRate).add(p3sFee.getProcessingFee_USD()).
					add(epoRenewalFee.getRenewalFee_EUR().multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100))));*/
			
			subTotalUSD = baseCostUSD.add(expressFeeUSD);
			
			fee.setExpressFee_USD(expressFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_HALF_UP));

		}
		
		else if(RenewalColourEnum.RED .equals(currentPhase)){
			//redCost = epoRenewalFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(p3sFee.getUrgentFee_Percent().multiply(fxRate));
			subTotalUSD = baseCostUSD.add(urgentFeeUSD);

			fee.setUrgentFee_USD(urgentFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_HALF_UP));

		}
		
		else if(RenewalColourEnum.BLUE .equals(currentPhase)){ 
			//blueCost = epoRenewalFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoRenewalFee.getExtensionFee_EUR());
			subTotalUSD = baseCostUSD.add(extensionFeeUSD);
			
			fee.setExtensionFee_EUR(extensionFeeEUR);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_HALF_UP));

		}
		
		else if(RenewalColourEnum.BLACK .equals(currentPhase)){
			//brownCost = epoRenewalFee.getRenewalFee_EUR().add(p3sFee.getProcessingFee_USD().multiply(fxRate)).add(epoRenewalFee.getExtensionFee_EUR()).add(p3sFee.getUrgentFee_Percent());
			//blackCost = baseCost.add(epoRenewalFee.getExtensionFee_EUR().multiply(fxRate)).
			//		add((epoRenewalFee.getRenewalFee_EUR().add(epoRenewalFee.getExtensionFee_EUR())).multiply(fxRate).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)))); 
			
			BigDecimal expressExtensionFeeUSD = (baseCostUSD.add(extensionFeeUSD)).multiply(p3sFee.getExpressFee_Percent().divide(new BigDecimal(100)));
			subTotalUSD = baseCostUSD.add(extensionFeeUSD).add(expressExtensionFeeUSD);

			fee.setExtensionFee_EUR(epoRenewalFee.getExtensionFee_EUR());
			fee.setExpressFee_USD(expressExtensionFeeUSD);
			fee.setSubTotal_USD(subTotalUSD.setScale(2, BigDecimal.ROUND_HALF_UP));
		}
		
		log().debug(msg +" returning fee object");
		
		return fee;
	}

	public P3SFeeSole findDiscountedFees(DiscountPercent discount){
		
		String msg = PREFIX + "findDiscountedFees()";
		log().debug(msg +" invoked for calculating discounted fees for business[" + discount.getBusiness().getId() +"]");
		
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
		
		log().debug(msg +" returning discounted fee breakdown");
		return p3sFee;
	}
	
	
	public CostAnalysisData getNextPhasesInfo(RenewalDates allDates){
		
		String msg ="getNextPhasesInfo(allDates)";
		log().debug(msg +" invoked for getting next year due date info for Next Year Renewal Due " + allDates.getNextRenewalDueDate());
		
		CostAnalysisData caData = new CostAnalysisData();
		/*Date greenStart = allDates.getNextWindowOpenDate();
		Date amberStart = utils.getMidnight(utils.addDays(allDates.getNextRenewalDueDate(), -15));
		Date redStart = utils.getMidnight(utils.addHours(allDates.getNextRenewalDueDate(), -48));
		Date blueStart = utils.get8PM(utils.addHours(allDates.getNextRenewalDueDate(), -4));
		Date blackStart = utils.getMidnight(utils.addDays(allDates.getNexttWindowCloseDate(), -10));*/
		
		CalendarColour colourDates = new CalendarColour();
    	TypedQuery<CalendarColour> allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(allDates.getNextRenewalDueDate());
    	colourDates = allColourDates.getSingleResult();
		caData.setGreenStartDate(colourDates.getGreenStart());
		caData.setAmberStartDate(colourDates.getAmberStart());
		caData.setRedStartDate(colourDates.getRedStart());
		caData.setBlueStartDate(colourDates.getBlueStart());
		caData.setBlackStartDate(colourDates.getBlackStart());
		//caData.setBrownEndDate(utils.addDays(allDates.getCurrentWindowCloseDate(), -2));
		caData.setBlackPhoneUpStart(colourDates.getBlackPhoneUpStart());
		caData.setBlackAllEnd(colourDates.getBlackAllEnd());
		System.out.println("Calculated Next Year Dates \n");
		System.out.println(caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackPhoneUpStart() + " " + caData.getBlackAllEnd());
		
		log().debug("Calculated Next Year Dates in the order as ::: " + caData.getGreenStartDate() +" " + caData.getAmberStartDate() +" " + caData.getRedStartDate() +
				" " + caData.getBlueStartDate() + " " + caData.getBlackStartDate() + " " + caData.getBlackPhoneUpStart() + " " + caData.getBlackAllEnd());
		
		/**
		 * SETTING ALL RESPECTIVE DATES TO STRING FORMAT 
		 */
		caData.setGreenStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getGreenStartDate()));
		caData.setAmberStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getAmberStartDate()));
		caData.setRedStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getRedStartDate()));
		caData.setBlueStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlueStartDate()));
		caData.setBlackStartDateUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackStartDate()));
		caData.setBlackPhoneUpStartUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackPhoneUpStart()));
		caData.setBlackAllEndUI(utils.dateToUSStringWithDayOfWeekandTimeandZone(caData.getBlackAllEnd()));
		
		//caData.setCurrentcostBand(RenewalColourEnum.GREEN);
		
		return caData;
	
	}
	
	/**
	 * 
	 * @param caData
	 * @return Fx Variance for current phase in last 6 weeks
	 *    format :- TreeMap<Date,FeeUI> for last 6 weeks 
	 */
	public TreeMap<Date,RenewalFeeUI> getLineChartData(CostAnalysisData caData, P3SFeeSole p3sFee, EpoRenewalFee epoRenewalFee){
		
		List<ArchivedRate> archivedRateList = new ArrayList<ArchivedRate>();
		TreeMap<Date, RenewalFeeUI> lineChart = new TreeMap<Date, RenewalFeeUI>();
		
		archivedRateList = getArchivedDataFor6Weeks();
		lineChart = getAllRenewalFeeUI(archivedRateList,caData,p3sFee, epoRenewalFee);
		
		return lineChart;
	}

	
	public TreeMap<Date,BigDecimal> get7weekLineChartDataForForm1200(BigDecimal costNow) {

		// Simplification: Ignore the USD component, as will always be small compared to total. 
		// Hence cost history graph will now exactly (and very-slightly incorrectly) mimic the fxRate graph 
		
		List<ArchivedRate> weeklyRateHistory = null; // new ArrayList<ArchivedRate>();
		TreeMap<Date, BigDecimal> lineChart = new TreeMap<Date, BigDecimal>();
		
		weeklyRateHistory = getArchivedDataFor6Weeks();
		lineChart = get7weekForm1200CostComparison(weeklyRateHistory, costNow);
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
	public List<ArchivedRate> getArchivedDataFor6Weeks() {
		
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
	
	
	public TreeMap<Date, RenewalFeeUI> getAllRenewalFeeUI(List<ArchivedRate> history , CostAnalysisData caData, P3SFeeSole p3sFee, EpoRenewalFee epoRenewalFee){
		
		TreeMap<Date, RenewalFeeUI> lineChart = new TreeMap<Date, RenewalFeeUI>();
		
		//first entry as todays rate
		Calendar calendar = Calendar.getInstance();
		
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal fxRate = current.getCurrent_P3S_rate();
		RenewalFee todaysFee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoRenewalFee, fxRate);
		RenewalFeeUI feeUI = new RenewalFeeUI(todaysFee);
		feeUI.setFeeActiveDate(utils.dateToUSStringWithTimeandZone(calendar.getTime()));
		lineChart.put(calendar.getTime(),feeUI);
		
		final long ONEDAY = 24 * 3600 * 1000;
		for (ArchivedRate eachData : history) {
			
			RenewalFee renewalFee = new RenewalFee(new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),new BigDecimal(0.0),
					new BigDecimal(0.0),new BigDecimal(0.0));
		    BigDecimal fxValue = eachData.getFxRate_P3s();
		    renewalFee = getCurrentPhaseCost(caData.getCurrentcostBand(), p3sFee, epoRenewalFee, fxValue);
		    //NOW POPULATE FEEUI 
		    feeUI = new RenewalFeeUI(renewalFee);
			// To convert archived date to active date, substract one day (isGoodEnuf)
			Date becameActiveDate = new Date( eachData.getArchivedDate().getTime() - ONEDAY );
			// formerly: lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(eachData.getActiveFromDate()), feeUI);
			feeUI.setFeeActiveDate(utils.dateToUSStringWithTimeandZone(becameActiveDate));
		    //lineChart.put(utils.dateToUSStringWithDayOfWeekandTimeandZone(becameActiveDate), feeUI);
			lineChart.put(becameActiveDate,feeUI);
		}
		
		return lineChart;
	}
	
	/**
	 * As per getAllRenewalFeeUI() for Renewal
	 * Calculate, given cost now, what the cost would have been for each of previous 7 weeks
	 * @param weeklyRateHistory
	 * @param costNow
	 * @return
	 */
	public TreeMap<Date, BigDecimal> get7weekForm1200CostComparison(List<ArchivedRate> weeklyRateHistory , BigDecimal costNow) {
		
		TreeMap<Date, BigDecimal> lineChart = new TreeMap<Date, BigDecimal>();
		if (weeklyRateHistory==null || costNow==null) {
			fail("Oh Dear! - CostAnalysisDataEngine get7weekForm1200CostComparison was passed a null ");
			return lineChart;
		}
		
		//first entry is todays rate
		Date today = new Date();
		lineChart.put(today, costNow);
		
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal fxRateToday = current.getCurrent_P3S_rate();
		for (ArchivedRate eachData : weeklyRateHistory) {
			Date oldDate = eachData.getArchivedDate();
			BigDecimal rateThen = eachData.getFxRate_P3s();
			BigDecimal oldCost = costNow.multiply(rateThen).divide(fxRateToday, 2, RoundingMode.HALF_UP);
			lineChart.put(oldDate, oldCost);
		}
		return lineChart;
	}
	
	
	public CombinedFee getFeeObj(Patent patent){
		
		String msg = PREFIX + " getFeeObj(" + patent.getId() + ")" ;
		log().debug(msg +" invoked for patent [" + patent.getId() + "]");
		CombinedFee combinedFee = new CombinedFee();
		P3SFeeSole p3sFee = new P3SFeeSole();
		EpoRenewalFee epoRenewalFee = new EpoRenewalFee();
		
		boolean isDiscountedRate = false; //a boolean value to check whether the business has got any discount rates
		//boolean renewalWindowOpened = false;  // a boolean value to determine whether we are still in doldrums
		RenewalDates allDates = new RenewalDates();
		
		System.out.println("Got the new patent with filing date as " + patent.getInternationalFilingDate());
		
		/** Check whether current business has got any reduced Fees.
		 * 		If so get the discounted rates ( PROCESSING FEE, EXPRESS FEE, URGENT FEE AND LATE PAY PENALTY )
		 * 		Else get the actual P3SFEESOLE entries
		 *  **/
		TypedQuery<DiscountPercent> query  =  DiscountPercent.findDiscountPercentsByBusiness(patent.getBusiness());
		if(query.getResultList().size() > 0){
			log().debug("Current patent [id = " + patent.getId() + "] is ELIGIBLE for DISCOUNTED FEES");
			isDiscountedRate = true;
			DiscountPercent discountRate = query.getSingleResult();
			p3sFee = findDiscountedFees(discountRate);
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
		//fxRate = fxRate.setScale(4, BigDecimal.ROUND_HALF_UP);
		
		/**
		 * GET THE EPO FEES FOR THE CURRENT RENEWAL YEAR 
		 */
		epoRenewalFee.setRenewalYear(patent.getRenewalYear());
		
		/**
		 * SAFE CHECK FOR PATENTS WITH RENEWAL YEAR LESS THAN 3
		 * Solution :- set renewal year to 3 (in future) which is the nearest year for renewal
		 */
		if(epoRenewalFee.getRenewalYear() < 3){
			log().debug("Patent renewal year < 3 , so set the Renewal Year to 3 which is the nearest");
			epoRenewalFee.setRenewalYear(3);
		}
		epoRenewalFee = EpoRenewalFee.findEpoRenewalFeesByRenewalYear(epoRenewalFee.getRenewalYear());
		
		combinedFee.setP3sFee(p3sFee);
		combinedFee.setEpoRenewalFee(epoRenewalFee);
		combinedFee.setFxRate(fxRate);
		
		log().debug(msg + " returning with calculated fees for RENEWAL YEAR ["+ patent.getRenewalYear() +"]as :: "
						+ "Express Fee Percent= " + combinedFee.getP3sFee().getExpressFee_Percent()
				 		+ ", Processing Fee USD = " + combinedFee.getP3sFee().getProcessingFee_USD()
		 				+ ", Urgent Fee Percent = " + combinedFee.getP3sFee().getUrgentFee_Percent()
		 				+ ", Renewal Fee EUR = " + combinedFee.getEpoRenewalFee().getRenewalFee_EUR()
		 				+ ", Extension Fee EUR = " + combinedFee.getEpoRenewalFee().getExtensionFee_EUR());
		
		return combinedFee;
	}
	
	
	
	
}
