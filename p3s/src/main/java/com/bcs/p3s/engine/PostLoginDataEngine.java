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
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.RenewalIntegrationTest;
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
		
		//PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
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
				RenewalDates renewalDates = datesEngineObj.getRenewalDates(patent);
				
				/* Commenting from below as trial to change the patent price if in doldrum **/ //till line 87
				//PatentStatus renewalInfo = patentStatus.getRenewalInfo(patent);
				
				/**
				 * below methods in CAEngine Class
				 * So setting the calculated value to renewaldates
				 */
				
				/*RenewalDates renewalDates = new RenewalDates();
				renewalDates.setCurrentRenewalDueDate(renewalInfo.getRenewalDueDate());
				renewalDates.setCurrentWindowOpenDate(renewalInfo.getNineMonthStart());
				renewalDates.setCurrentWindowCloseDate(renewalInfo.getNineMonthEnd());
*/
				//This may change - pending Dan's decision
				/**
				 * We are displaying a rate to customer if Renewal window being opened, irrespective of the fact that they have been paid or not.
				 * CHANCES ARE THE CONDITION MAY CHANGE TO SHOW PRICES ONLY IF THE STATUS IS SHOW_PRICE
				 * ie, if(RenewalStatusEnum.SHOW_PRICE.equals(patent.getRenewalStatus())){
				 */
				//if(!renewalInfo.getDoldrums()){
				if(RenewalStatusEnum.SHOW_PRICE.equals(patent.getRenewalStatus())){
					log().debug("Patent open for renewal and not paid yet. So calculate price and respective phase info");
					caData = caEngine.getAllPhasesInfo(renewalDates);
					String currentPhase = caEngine.getCurrentPhase(caData);
					CombinedFee fee = caEngine.getFeeObj(patent);
					Fee currentfee = caEngine.getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					FeeUI currentFeeUI = new FeeUI(currentfee);
					Fee nextStageFee = caEngine.getCurrentPhaseCost(getNextPhase(currentPhase), fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
					FeeUI nextStageFeeUI = new FeeUI(nextStageFee);
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(caData.getCurrentcostBand());
					extendedData.setCurrentRenewalCost(currentFeeUI.getSubTotal_USD());
					extendedData.setRenewalCostNextStage(nextStageFeeUI.getSubTotal_USD());
					extendedData.setCostBandEndDate(getCostBandEnddate(caData).getTime());
					//extendedData.setFeeUI(currentFeeUI);
					extendedData.setFee(currentfee);
				}
				else{
					extendedData.setPatentId(patent.getId());
					extendedData.setRenewalDueDate(renewalDates.getCurrentRenewalDueDate());
					extendedData.setCurrentCostBand(RenewalColourEnum.GREY);
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
	
	
	
}
