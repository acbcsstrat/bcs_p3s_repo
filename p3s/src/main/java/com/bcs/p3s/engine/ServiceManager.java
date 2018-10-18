package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.PatentExtendedData;

/**
 * See com.bcs.p3s.display.Service
 *
 */
public class ServiceManager extends Universal {

	// param 'session' can be ditched once/if we stop using the session
    public List<P3SService> getServicesForPatent(Patent patent, HttpSession session) {
    	String err = CLASSNAME + "getServicesForPatent() : ";
    	List<P3SService> services = new ArrayList<P3SService>();
    	if (patent==null) return services;
    	
		P3SService service = new P3SService();
    	if (StageManager.isInFiling(patent.getEpoPatentStatus())) {
    		// Unconditionally provide 1 Service, detailing current Form1200 Status
    		
    		EpctEngine epctEngine = new EpctEngine(patent);
    		service = epctEngine.determineForm1200Service();
    		
    		services.add(service);
    	}
    	else if (StageManager.isInProsecution(patent.getEpoPatentStatus())) {
    		// Can we sell a renewal ?
    		// v2.1 will provide either 0 or 1 Service

    		//  for now - re-use existing (calculation intensive (session)) mechanism
 
    		// Provide a 'Service' conditional on : we can sell a renewal, or are currently in progress
    		PatentUI patentUI = populateDataToPatentUI(patent, session);
    		String colourNow = patentUI.getCostBandColour();

    		if ( ( ! (RenewalColourEnum.GREY.equalsIgnoreCase(colourNow)))
    			|| RenewalStatusEnum.isInProgress(patent.getRenewalStatus()) ) { 
	    		
	    		
	    		service.setServiceType(P3SProductTypeEnum.RENEWAL);
	    		service.setServiceStatus(patent.getRenewalStatus());
	    		service.setCurrentStageColour(colourNow);
	
	    		service.setNextStageColour(ColourManager.whatColourComesNext(
	    				colourNow, P3SProductTypeEnum.RENEWAL));
	    		
	    		service.setCurrentStageCostUSD(patentUI.getCurrentRenewalCost());
	    		service.setNextStageCostUSD(patentUI.getRenewalCostNextStageUSD());
	    		service.setCostBandEndDate(patentUI.getCostBandEndDate());
	    		service.setFailedReason(null);
	
	    		services.add(service);
    		}
    	}

    	
    	log().debug(err+"returning "+services.size()+" service(s) for patentId "+patent.getId());
    	return services;
    }
    
    
    
    
    
    
    
    
    // START OF : Short term copy of existing (computationally expensive / calc-all-&-store-in-session) code
    
    // Start of : Method copied from PatentServiceImpl (which wouldn't want to call from here)
	public PatentUI populateDataToPatentUI(Patent patent, HttpSession session) {
		
		String err = CLASSNAME+"populateDataToPatentUI(patent) ";
		boolean patentFound = false;
		
		
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> extendedDatas = pLoginSession.getExtendedPatentUI();
		
		PatentUI patentUI = new PatentUI(patent,extendedDatas);
		
			for(PatentExtendedData extendedData : extendedDatas){
				if(extendedData.getPatentId() == null){
					patentUI.setRenewalDueDate(extendedData.getRenewalDueDate());
					patentUI.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					patentUI.setCostBandEndDate(extendedData.getCostBandEndDate());
					patentUI.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
					return patentUI;
				}
				
				else if(extendedData.getPatentId().equals(patentUI.getId())){
					patentFound = true;
					patentUI.setRenewalDueDate(extendedData.getRenewalDueDate());
					patentUI.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					patentUI.setCostBandEndDate(extendedData.getCostBandEndDate());
					patentUI.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
					return patentUI;
				}
			}
		return patentUI;
	}
    // End of : Method copied from PatentServiceImpl (which wouldn't want to call from here)
    
    
    // END OF : Short term copy of existing (computationally expensive / calc-all-&-store-in-session) code
}
