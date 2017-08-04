package com.bcs.p3s.engine;

/**
 * ALL POST LOGIN CALCULATIONS CAN BE DONE ON THIS CLASS
 */

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
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
		
		String err = PREFIX+"getExtendedPatentData(session) ";
		log().debug("invoked : " + PREFIX +  err);
		
		List<PatentExtendedData> allData = new ArrayList<PatentExtendedData>();
		List<Patent> patents = null;
		
		//PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		
		TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(pLoginSession.getBusiness());
    	patents = tq_patents.getResultList();
		
    	log().debug("findPatentsByBusiness(business) in " +  err +" returned " + tq_patents.getResultList().size() +" patents");
    	
    	if(patents.size() != 0){
    		
	    	for(Patent patent : patents){
	    		try {
	    			
	    			PatentExtendedData extendedData = new PatentExtendedData();
					RenewalDates renewalDates = caEngine.getRenewalWindowDates(patent);
					caData = caEngine.getAllPhasesInfo(renewalDates);
					String currentPhase = caEngine.getCurrentPhase(caData);
					CombinedFee fee = caEngine.getFeeObj(patent);
					FeeUI currentfeeUI = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					FeeUI nextStageFeeUI = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(caData.getCurrentcostBand());
					extendedData.setCurrentRenewalCost(currentfeeUI.getSubTotal_USD());
					extendedData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
					extendedData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
					
					allData.add(extendedData);
				} catch (ParseException e) {
					
					e.printStackTrace();
				}
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
			nextPhase = RenewalColourEnum.BROWN;
		else if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BROWN))
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
