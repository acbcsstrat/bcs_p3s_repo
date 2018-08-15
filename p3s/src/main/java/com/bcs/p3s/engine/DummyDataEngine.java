package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.display.Service;

public class DummyDataEngine {
	
	public List<PortfolioUI> getDummyDataForPortfolio(){
		
		List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();
		
		//Patent with Epct available
		PortfolioUI portfolioUI = new PortfolioUI(); 
		portfolioUI.setEP_ApplicationNumber("EP17345678");
		portfolioUI.setClientRef("Prog0001/1");
		portfolioUI.setShortTitle("Start 1200 demo patent");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		List<Service> availableServices = new ArrayList<Service>();
		Service service = new Service();
		service.setServiceType("Form1200");
		service.setServiceStatus("Epct available");
		service.setCurrentStageColour("Green");
		service.setNextStageColour("Amber");
		service.setCurrentStageCostUSD(new BigDecimal("12200.40"));
		service.setNextStageCostUSD(new BigDecimal("14640.48"));
		service.setCostBandEndDate(new Date("10/29/2018"));
		availableServices.add(service);
		
		portfolioUI.setServiceList(availableServices);
		
		portfolioUIs.add(portfolioUI);
		
		//Patent with Epct saved
		portfolioUI = new PortfolioUI(); 
		portfolioUI.setEP_ApplicationNumber("EP17216789");
		portfolioUI.setClientRef("Prog0002/1");
		portfolioUI.setShortTitle("Epct saved");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		availableServices = new ArrayList<Service>();
		service = new Service();
		service.setServiceType("Form1200");
		service.setServiceStatus("Epct saved");
		service.setCurrentStageColour("Green");
		service.setNextStageColour("Amber");
		service.setCurrentStageCostUSD(new BigDecimal("12345.67"));
		service.setNextStageCostUSD(new BigDecimal("16789.12"));
		service.setCostBandEndDate(new Date("10/29/2018"));
		availableServices.add(service);
		
		portfolioUI.setServiceList(availableServices);
		
		portfolioUIs.add(portfolioUI);
		
		//Patent with Epct not available
		portfolioUI = new PortfolioUI(); 
		portfolioUI.setEP_ApplicationNumber("EP17568742");
		portfolioUI.setClientRef("Prog0003/1");
		portfolioUI.setShortTitle("Epct not available");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		availableServices = new ArrayList<Service>();
		service = new Service();
		service.setServiceType("Form1200");
		service.setServiceStatus("Epct not available");
		service.setCurrentStageColour("Grey");
		service.setNextStageColour("Grey");
		service.setCurrentStageCostUSD(new BigDecimal("0.0"));
		service.setNextStageCostUSD(new BigDecimal("0.0"));
		service.setFailedReason("Application is in a language other than English");
		availableServices.add(service);
		
		portfolioUI.setServiceList(availableServices);
		
		portfolioUIs.add(portfolioUI);
		
		//Patent Open for Renewal
		portfolioUI = new PortfolioUI(); 
		portfolioUI.setEP_ApplicationNumber("EP15475869");
		portfolioUI.setClientRef("Prog0004/1");
		portfolioUI.setShortTitle("Open for Renewal");
		portfolioUI.setEpoStatus("Examination in progress");
		portfolioUI.setEpeStage("Prosecution");
		
		availableServices = new ArrayList<Service>();
		service = new Service();
		service.setServiceType("Renewal");
		service.setServiceStatus("Show price");
		service.setCurrentStageColour("Green");
		service.setNextStageColour("Amber");
		service.setCurrentStageCostUSD(new BigDecimal("2000.40"));
		service.setNextStageCostUSD(new BigDecimal("2400.48"));
		service.setCostBandEndDate(new Date("10/29/2018"));
		availableServices.add(service);
		
		portfolioUI.setServiceList(availableServices);
		
		portfolioUIs.add(portfolioUI);
		
		
		return portfolioUIs;
	}

}
