package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.form1200.CountryStatesUtil;
import com.bcs.p3s.util.lang.Universal;

public class DummyForm1200Engine extends Universal {

	// Generates 4 hardcoded PortfolioUIs. 
	// Designed to exhibit the 4 main different situations which affect the FE. 
	// This for use late August 2018, such that Pat can develop FE with realistic data, whilst Andy away

	public List<PortfolioUI> getDummyDataForPortfolio() {
		
		List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();
		
		//Patent with Epct available
		PortfolioUI portfolioUI = new PortfolioUI();
		portfolioUI.setId(1L);
		portfolioUI.setEP_ApplicationNumber("EP17345678");
		portfolioUI.setClientRef("Prog0001/1");
		portfolioUI.setShortTitle("Start 1200 demo patent");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		List<P3SService> availableServices = new ArrayList<P3SService>();
		P3SService service = new P3SService();
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
		portfolioUI.setId(2L);
		portfolioUI.setEP_ApplicationNumber("EP17216789");
		portfolioUI.setClientRef("Prog0002/1");
		portfolioUI.setShortTitle("Epct saved");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		availableServices = new ArrayList<P3SService>();
		service = new P3SService();
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
		portfolioUI.setId(3L);
		portfolioUI.setEP_ApplicationNumber("EP17568742");
		portfolioUI.setClientRef("Prog0003/1");
		portfolioUI.setShortTitle("Epct not available");
		portfolioUI.setEpoStatus("The international publication has been made");
		portfolioUI.setEpeStage("Filing");
		
		availableServices = new ArrayList<P3SService>();
		service = new P3SService();
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
		portfolioUI.setId(4L);
		portfolioUI.setEP_ApplicationNumber("EP15475869");
		portfolioUI.setClientRef("Prog0004/1");
		portfolioUI.setShortTitle("Open for Renewal");
		portfolioUI.setEpoStatus("Examination in progress");
		portfolioUI.setEpeStage("Prosecution");
		
		availableServices = new ArrayList<P3SService>();
		service = new P3SService();
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


	
	// Generates a StartForm1200Api21UI containing hardcoded data.
	// Designed to exhibit the 2 main different situations possible. 
	// This for use late August 2018, such that Pat can develop FE with realistic data, which Andy away
	public StartForm1200Api21UI getDummyForm1200QuestionData(long patentId){
		
		boolean isA = (patentId % 2) == 1;
		
		// Having provided dummy patents, must recreate now, to provide consistent data.
		List<PortfolioUI> dummyPatents = getDummyDataForPortfolio();
		PortfolioUI thisPatent = null;
		for (PortfolioUI patent : dummyPatents) {
			if (patent.getId() == patentId) {
				thisPatent = patent;
				break;
			}
		}
		if (thisPatent==null) fail("getDummyForm1200QuestionData has failed (or FE is fibbing) : given "+patentId);

		
		StartForm1200Api21UI startForm1200Api21UI = new StartForm1200Api21UI();
		
		startForm1200Api21UI.setEP_ApplicationNumber(thisPatent.getEP_ApplicationNumber());
		startForm1200Api21UI.setClientRef(thisPatent.getClientRef());
		startForm1200Api21UI.setShowOptionalQuestion( ! isA);
		startForm1200Api21UI.setIsYear3RenewalDue( ! isA);
		startForm1200Api21UI.setExtensionStatesUI(CountryStatesUtil.generateListOfExtensionStates());
		startForm1200Api21UI.setValidationStatesUI(CountryStatesUtil.generateListOfValidationStates());
		
		return startForm1200Api21UI;
	}

	
	/**
	 * Form1200, xxxx
	 * created 181009 - NEARLY redundant the day after
	 */
//	public Service dummyF1200Service_variant1() {				acTidy acRedundant
//		
//		Service service = new Service();
//		service.setServiceType(P3SProductTypeEnum.FORM1200);
//		service.setServiceStatus("Epct available");
//		service.setCurrentStageColour("Green");
//		service.setNextStageColour("Amber");
//		service.setCurrentStageCostUSD(new BigDecimal("12200.40"));
//		service.setNextStageCostUSD(new BigDecimal("14640.48"));
//		service.setCostBandEndDate(new Date("25/01/2019"));
//		service.setFailedReason(null);
//		return service;
//	}
	
	/**
	 * Renewal, xxxx
	 * created 181009 - redundant the day after
	 */
//	public Service dummyRenewalService_variant1() {
//		
//		Service service = new Service();
//		service.setServiceType("Renewal");
//		service.setServiceStatus("Show price");
//		service.setCurrentStageColour("Green");
//		service.setNextStageColour("Amber");
//		service.setCurrentStageCostUSD(new BigDecimal("2000.40"));
//		service.setNextStageCostUSD(new BigDecimal("2400.48"));
//		service.setCostBandEndDate(new Date("12/30/2018"));
//		service.setFailedReason(null);
//		
//		return service;
//	}
	
	// Calc RED/AMBER start date needs the spreadsheet calendars lookup (3days & 3days) - FOR NOW - ignore s/s/weekends/oliday - hardcode 5calendardays & 5calendardays 
	public LocalDate getEpctRedStartDate(LocalDate ld31monthsAfter) {
		return ld31monthsAfter.minusDays(5L);
	}
	public LocalDate getEpctAmberStartDate(LocalDate ld31monthsAfter) {
		return ld31monthsAfter.minusDays(10L);
	}
	
	
	
	
	// tmp method until have real Pat FE delivering objects
	public List<String> csStings2ist(String csv) {
		//Remove whitespace and split by comma 
        List<String> items = Arrays.asList(csv.split("\\s*,\\s*"));
		return items;
	}
	public List<ExtensionStateUI> listStrStates2ExtnsStates(List<String> strList) {
		List<ExtensionStateUI> extnStates = new ArrayList<ExtensionStateUI>();
		ExtensionStateUI exnSt = null;
		for (String str : strList) {
			exnSt = new ExtensionStateUI(str);
			extnStates.add(exnSt);
		}
		return extnStates;
	}
	public List<ValidationStateUI> listStrStates2ValidStates(List<String> strList) {
		List<ValidationStateUI> vldStates = new ArrayList<ValidationStateUI>();
		ValidationStateUI vldSt = null;
		for (String str : strList) {
			vldSt = new ValidationStateUI(str);
			vldStates.add(vldSt);
		}
		return vldStates;
	}


}
