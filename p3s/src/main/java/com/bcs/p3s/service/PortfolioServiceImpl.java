package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.engine.ServiceManager;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;


@Service("PortfolioService")
public class PortfolioServiceImpl extends ServiceAuthorisationTools implements PortfolioService {


	// Start of - the methods which implement the prototypes in the Interface


	@Override
	public List<PortfolioUI> listAllPortfolioUIsForMyBusiness() {

		String err = CLASSNAME+"listAllPortfolioUIsForMyBusiness() ";
		checkNoActionRequired(err);

		ServiceManager serviceManager = new ServiceManager(); 
		List<PortfolioUI> patentUIs = new ArrayList<PortfolioUI>();

		List<Patent> patents = listAllPatentsForMyBusiness();
		for (Patent patent: patents) {
			PortfolioUI portfolioUI = new PortfolioUI();
			portfolioUI.setId(patent.getId());
			portfolioUI.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
			portfolioUI.setClientRef(patent.getClientRef());
			portfolioUI.setShortTitle(patent.getShortTitle());
			portfolioUI.setEpoStatus(patent.getEpoPatentStatus());
			portfolioUI.setEpeStage(
					StageManager.determineStage(patent.getEpoPatentStatus()));
			portfolioUI.setServiceList(
					serviceManager.getServicesForPatent(patent));
			patentUIs.add(portfolioUI);
		}
		return patentUIs; 
	}


	// End of - the methods which implement the prototypes in the Interface
	

	// Start of - Support methods - NOT exposed through the interface

	
	protected List<Patent> listAllPatentsForMyBusiness() { 

		String err = CLASSNAME+"listAllPatentsForMyBusiness() ";
		log().debug(err+" invoked ");
    	
		Business myBusiness = checkThisIsMy().getBusiness();
		
    	TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(myBusiness);
    	List<Patent> patents = tq_patents.getResultList();
    	
		log().debug(err+" invoked for business "+myBusiness.getId()+" ret Qty "+patents.size());

		return patents;
	}

}
