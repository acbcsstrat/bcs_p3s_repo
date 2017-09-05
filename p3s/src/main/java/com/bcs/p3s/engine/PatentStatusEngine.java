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
import com.bcs.p3s.model.Fee;
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
	RenewalDatesEngine datesEngineObj = new RenewalDatesEngine();
	
	public PatentStatus getRenewalInfo(Patent patent){
		
		PatentStatus renewalInfo = new PatentStatus();
		
		Date todays = new DateUtil().getTodaysDate();
		RenewalDates allDates = datesEngineObj.getRenewalDates(patent);
		
		
		renewalInfo.setNineMonthStart(allDates.getCurrentWindowOpenDate());
		renewalInfo.setNineMonthEnd(allDates.getCurrentWindowCloseDate());
		renewalInfo.setRenewalDueDate(allDates.getCurrentRenewalDueDate());
		renewalInfo.setActiveRenewalYear(allDates.getRenewalYear());
		
		//Date lastRenewed = patent.getLastRenewedDateExEpo();
		
		if(todays.after(allDates.getCurrentWindowCloseDate())){ //ie, doldrum of the active renewal year
			//we are in doldrums
			//check whether a renewal made for the active renewal year else we are too late
			//if(lastRenewed.after(allDates.getCurrentWindowOpenDate()) && lastRenewed.before(allDates.getCurrentWindowCloseDate()) ){
			if(allDates.getRenewalYear() == patent.getLastRenewedYearEpo()){
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				//renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(true);
				renewalInfo.setDoldrums(true);
			}
			else{
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(false);
				renewalInfo.setEpoYearNumberRenewed(patent.getLastRenewedYearEpo());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
				//renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(true);
			}
		}
		
		else{
			
			if(allDates.getRenewalYear() == patent.getLastRenewedYearEpo()){
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);
				//renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				renewalInfo.setAlreadyRenewed(true);
				renewalInfo.setDoldrums(false);
			}
			else if(allDates.getRenewalYear() == patent.getLastRenewedYearEpo()+1){
				renewalInfo.setCanRenew(true);
				renewalInfo.setGoodFollowOn(true);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.SHOW_PRICE);
				//renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(false);
			}
			else{
				renewalInfo.setCanRenew(false);
				renewalInfo.setGoodFollowOn(false);
				renewalInfo.setEpoYearNumberRenewed(patent.getRenewalYear());
				renewalInfo.setCurrentRenewalStatus(RenewalStatusEnum.TOO_LATE);
				//renewalInfo.setThisYearNumber(allDates.getRenewalYear());
				
				renewalInfo.setAlreadyRenewed(false);
				renewalInfo.setDoldrums(false);
			}
		}
		
		return renewalInfo;
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
			nextPhase = RenewalColourEnum.BLACK;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLACK))
			nextPhase = RenewalColourEnum.NOCOLOR;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.NOCOLOR))
			nextPhase = RenewalColourEnum.GREEN;
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
			cal.setTime(caData.getBlackStartDate());
		else if(caData.getCurrentcostBand().equalsIgnoreCase(RenewalColourEnum.BLACK))
			cal.setTime(caData.getBlackEndDate());
		
		return cal;
	}
	
	
public PostLoginSessionBean getExtendedDataForNewPatent(Patent patent, PostLoginSessionBean pLoginSession){
		
		CostAnalysisDataEngine caEngine = new CostAnalysisDataEngine();
		CostAnalysisData caData = new CostAnalysisData();
		PatentStatusEngine patentStatus = new PatentStatusEngine();
		
		String err = PREFIX+"getExtendedDataForNewPatent(session) ";
		log().debug("invoked : " + PREFIX +  err);
		
		
		try {
	    			
	    	PatentExtendedData newPatentData = new PatentExtendedData();
	    	PatentStatus renewalInfo = patentStatus.getRenewalInfo(patent);
			
			/**
			 * below methods in CAEngine Class
			 * So setting the calculated value to renewaldates
			 */
			
			RenewalDates renewalDates = new RenewalDates();
			renewalDates.setCurrentRenewalDueDate(renewalInfo.getRenewalDueDate());
			renewalDates.setCurrentWindowOpenDate(renewalInfo.getNineMonthStart());
			renewalDates.setCurrentWindowCloseDate(renewalInfo.getNineMonthEnd());

			//good to follow and not in doldrum: so we can show the prices
			//	either Show price or Renewal In Place
			if(renewalInfo.getGoodFollowOn() && !renewalInfo.getDoldrums()){
				caData = caEngine.getAllPhasesInfo(renewalDates);
				String currentPhase = caEngine.getCurrentPhase(caData);
				CombinedFee fee = caEngine.getFeeObj(patent);
				
				//FeeUI currentfeeUI = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				Fee currentFee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
				FeeUI currentfeeUI = new FeeUI(currentFee);
				
				FeeUI nextStageFeeUI = null;
				if(!currentPhase.equalsIgnoreCase(RenewalColourEnum.BLACK)) { //If black no next stage
					/*nextStageFeeUI = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); */
					Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate()); 
					nextStageFeeUI = new FeeUI(nextStageFee);
				}
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
				newPatentData.setCurrentCostBand(caData.getCurrentcostBand());
				newPatentData.setCurrentRenewalCost(currentfeeUI.getSubTotal_USD());
				newPatentData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
				newPatentData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
			}
			else{
				newPatentData.setPatentId(patent.getId());
				newPatentData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
				newPatentData.setCurrentCostBand(renewalInfo.getCurrentRenewalStatus());
			}
					
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
