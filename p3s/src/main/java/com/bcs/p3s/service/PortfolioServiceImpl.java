package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.engine.ServiceManager;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Patent;


@Service("PortfolioService")
public class PortfolioServiceImpl extends ServiceAuthorisationTools implements PortfolioService {

	public PortfolioServiceImpl(HttpSession session) {
		super();
		this.session = session;
	}


	// Start of - the methods which implement the prototypes in the Interface


	@Override
	public List<PortfolioUI> listAllPortfolioUIsForMyBusiness() {

		String err = CLASSNAME+"listAllPortfolioUIsForMyBusiness() ";
		checkNoActionRequired(err);

		ServiceManager serviceManager = new ServiceManager(); 
		List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();

		List<Patent> patents = listAllPatentsForMyBusiness();
		for (Patent patent: patents) {
			PortfolioUI portfolioUI = createPortfolioUIforPatent(patent, serviceManager, session);
			portfolioUIs.add(portfolioUI);
		}
		return portfolioUIs; 
	}

	
	public PortfolioUI createPortfolioUIforPatent(Patent patent, ServiceManager serviceManager, HttpSession session) 
	{
		if (patent==null) return null;
		PortfolioUI portfolioUI = new PortfolioUI();
		portfolioUI.setId(patent.getId());
		portfolioUI.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
		portfolioUI.setClientRef(patent.getClientRef());
		portfolioUI.setShortTitle(patent.getShortTitle());
		portfolioUI.setEpoStatus(patent.getEpoPatentStatus());
		String currentStage = StageManager.determineStage(patent.getEpoPatentStatus()); 
		portfolioUI.setEpeStage(currentStage);
		String rawStatus = getServiceStatusForThisStage(currentStage,patent); 
		portfolioUI.setServiceStatus( Form1200StatusEnum.statusForUI(rawStatus) ); // Is safe - even if not a Form1200 status
		portfolioUI.setServiceList(
				serviceManager.getServicesForPatent(patent, session));
				// 'session' needed (temporarily?) for accessing prices & dates (for the Service entities)
		return portfolioUI;
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

	protected String getServiceStatusForThisStage(String stage, Patent patent) { 
		if (patent==null) return null;
		if (StageManager.FILING.equals(stage)) return patent.getEpctStatus();
		else return patent.getRenewalStatus();
	}

	
}
