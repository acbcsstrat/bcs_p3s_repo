package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.RenewalFeeUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.CombinedFee;
import com.bcs.p3s.wrap.PatentExtendedData;


public class PostLoginDataEngine extends Universal{
	
	
	HttpSession session;
	
	public void setSession(HttpSession session) {
		this.session = session;
	}

	protected String PREFIX = this.getClass().getName() + " : "; 
	
	public PostLoginSessionBean getExtendedPatentData(PostLoginSessionBean pLoginSession){
		
		CostAnalysisDataEngine caEngine = new CostAnalysisDataEngine();
		CostAnalysisData caData = new CostAnalysisData();
		RenewalDatesEngine datesEngineObj = new RenewalDatesEngine();
		PatentStatusEngine patentStatus = new PatentStatusEngine();
		String err = PREFIX+"getExtendedPatentData(session) ";
		log().debug("invoked : " + PREFIX +  err);
		
		List<PatentExtendedData> allData = new ArrayList<PatentExtendedData>();
		List<Patent> patents = null;
		/** Clear the session data for PatentExtendedData**/
		pLoginSession.setExtendedPatentUI(null);
		
		if( !(pLoginSession.getExtendedPatentUI() == null)){
			//MP to add logs
			return pLoginSession;
		}
		TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(pLoginSession.getBusiness());
    	patents = tq_patents.getResultList();
		
    	log().debug("findPatentsByBusiness(business) in " +  err +" returned " + tq_patents.getResultList().size() +" patents");
    	
    	if(patents.size() != 0){
    		
	    	for(Patent patent : patents){
	    		PatentExtendedData extendedData = new PatentExtendedData();
	    		RenewalDates renewalDates = new RenewalDates();
				renewalDates = datesEngineObj.getRenewalDates(patent);
				
				/** We are displaying 
				 * 	- RATE & RESPECTIVE COLOUR details to customer if the status is SHOW_PRICE or IN_PROGRESS or EPO_INSTRUCTED.
				 * 	- NO RATE BUT RESPECTIVE COLOUR DETAILS if status is TOO_LATE
				 * 	- NO RATE & COLOUR as GREY else other values
				 * 
				 */
				if(RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(patent.getRenewalStatus()) || RenewalStatusEnum.IN_PROGRESS.equals(patent.getRenewalStatus()) 
						|| RenewalStatusEnum.EPO_INSTRUCTED.equals(patent.getRenewalStatus())){
					log().debug("Patent holds a renewal status of SHOW_PRICE.");
					renewalDates.setRenewalWindowOpened(true);
					caData = caEngine.getAllPhasesInfo(renewalDates);
					String currentPhase = caEngine.getCurrentPhase(caData);
					CombinedFee fee = caEngine.getFeeObj(patent);
					RenewalFee currentfee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					RenewalFeeUI currentFeeUI = new RenewalFeeUI(currentfee);
					RenewalFee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					RenewalFeeUI nextStageFeeUI = new RenewalFeeUI(nextStageFee);
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(caData.getCurrentcostBand());
					extendedData.setCurrentRenewalCost(currentFeeUI.getSubTotal_USD());
					extendedData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
					extendedData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
					//extendedData.setFeeUI(currentFeeUI);
					extendedData.setFee(currentfee);
					
					extendedData.setActiveRenewalYear(patent.getRenewalYear());
					extendedData.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				else if(RenewalStatusEnum.TOO_LATE.equals(patent.getRenewalStatus())){
					log().debug("Patent holds a renewal status of TOO_Late.");
					renewalDates.setRenewalWindowOpened(true);
					caData = caEngine.getAllPhasesInfo(renewalDates);
					String currentPhase = caEngine.getCurrentPhase(caData);
					//No fee details to be send to FE
					/*CombinedFee fee = caEngine.getFeeObj(patent);
					Fee currentfee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					FeeUI currentFeeUI = new FeeUI(currentfee);
					Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					FeeUI nextStageFeeUI = new FeeUI(nextStageFee);*/
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(caData.getCurrentcostBand());
					extendedData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
					extendedData.setActiveRenewalYear(patent.getRenewalYear());
					extendedData.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				else{
					log().debug("Patent holds a renewal status of " + patent.getRenewalStatus());
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(RenewalColourEnum.GREY);
					extendedData.setActiveRenewalYear(patent.getRenewalYear());
					extendedData.setCurrentRenewalStatus(patent.getRenewalStatus());
				}
				
				allData.add(extendedData);
	    	}
	    	
    	}
    	
    	else{
    		log().debug("findPatentsByBusiness(business) in " +  err +" returned no patents. So no calculations needed");
    	}
    	
    	pLoginSession.setExtendedPatentUI(allData);
		return pLoginSession;
		
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
			nextPhase = RenewalColourEnum.GREY;
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
			cal.setTime(caData.getBlackAllEnd());
		
		return cal;
	}
	
	
	
}
