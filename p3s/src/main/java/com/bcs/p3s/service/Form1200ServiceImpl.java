package com.bcs.p3s.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.Form1200FeeUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PatentV2UI;
import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.engine.ServiceManager;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SException;


@Service("Form1200Service")
public class Form1200ServiceImpl extends ServiceAuthorisationTools implements Form1200Service {

	protected String PREFIX = this.getClass().getName() + " : "; 

	
	public Form1200ServiceImpl(HttpSession session) {
		super();
		this.session = session;
	}


	@Override
	public StartForm1200Api21UI getForm1200QuestionData(long patentID) {

		String err = PREFIX+"getForm1200QuestionData("+patentID+") ";

		// NOT below yet - fails = as nno link to my business
//		checkForm1200isViable(patentID, err);
		// acTodo - this and ALL OTHER check* methods need review (re not throw exceptions, & how signal back to controller to return error)
		
		
		DummyForm1200Engine dummyEngine = new DummyForm1200Engine();
		StartForm1200Api21UI questionData = dummyEngine.getDummyForm1200QuestionData(patentID);
		
		return questionData;
	}


	@Override
	public void combineEpoPatentDetails(Patent patent, Form1200Record form1200) {
		if (patent==null || form1200==null) { patent=null; return; }
		
		// Use, check or ignore the form1200 fields
		try {
			Date dteDebug = null;
			String strDebug = null;

			checkStrSame(patent.getEP_ApplicationNumber(), form1200.getEP_AppNumber(), "EPappNum");
			// not readily comparable : applicants
			// not used : inventors 
			// not used : agents 
			checkDateStrSame(patent.getInternationalFilingDate(), form1200.getFilingDate(), "filingDate");
			dteDebug = new DateUtil().stringToDate( form1200.getPriorityDate() );
			 patent.setPriorityDate(dteDebug);
			patent.setInternationalFilingLang(form1200.getFilingLang());
			checkStrSame(patent.getEP_PublicationNumber(), form1200.getEP_PublicationNumber(), "EPpubNum");
			patent.setPCT_applicationNumber(form1200.getPCT_AppNumber());
			patent.setPCT_publicationNumber(form1200.getPCT_PublicationNumber());
			dteDebug = new DateUtil().stringToDate(form1200.getPublishedDate());
			 patent.setPCT_publishedDate(dteDebug);
			// not used : publishedLang. Used filingLang
			patent.setInternationalSearchAuthority(form1200.getAnyIsrEpElseFirst());
			strDebug = (form1200.getIpcCodes()==null) ? null : form1200.getIpcCodes().getIpcCodes();
			 checkStrSame(patent.getIpcCodes(), strDebug, "IPCcodes");
			checkStrSame(patent.getTitle(), form1200.getTitle(), "title");
			ArrayList<String> desigStates = form1200.getDesignatedContractingStates();
			 patent.setDesignated_states(arrayListToCommaSeparatedString(desigStates));
			// not used : claimsTxt 
			// not used : allClaims 
			// not used : abstractTxt 
		} catch (ParseException e) { logErrorAndContinue("Confidence check failed",e); }
	}

	
	/**
	 * Populate <i>that part</i> of a PatentV2UI that is possible from here
	 * 
	 * This also calculates Renewal stuff - which SHOULDN'T be in this Form1200 class. acTodo
	 */
	@Override
	public void populatePatentInfo(PatentV2UI patentV2UI, HttpSession session) {
		String handle = CLASSNAME+" : populatePatentInfo() ";
		log().debug(handle+"invoked for patent "+patentV2UI.getId());
		
    	// fields to populate:
				
    	// portfolioUI
		PortfolioServiceImpl portfolioServiceImpl = new PortfolioServiceImpl(session);
    	ServiceManager serviceManager = new ServiceManager(); 
		PortfolioUI portfolioUI = portfolioServiceImpl.createPortfolioUIforPatent(patentV2UI, serviceManager, session);
		patentV2UI.setPortfolioUI(portfolioUI);
	
		// form1200PdfUrl 
		String form1200PdfUrl = null;  // existing simile is: "invoiceUrl":"/p3sweb/invoice/34"
		Epct epct = Epct.findEpctByPatent(patentV2UI);
		if (epct!=null && epct.getForm1200()!=null) {
			// Thanksgiving change
			form1200PdfUrl = null;  // hardcode. Until we have a (Blob) to provide
			patentV2UI.setForm1200PdfUrl(form1200PdfUrl);
		}
		
		// renewalStageProgress & form1200StageProgress.   Integer percentage from last colour-change to next. Not used if in Grey
		P3SService renewalService = null;
		P3SService form1200Service = null;
		patentV2UI.setRenewalStageProgress(0);
		patentV2UI.setForm1200StageProgress(0);
		List<P3SService> services = portfolioUI.getServiceList();
		//if (services==null) fail(handle+"services can be empty, but must not be null. Failed!");
		for (P3SService service : services) {
			String serviceType = service.getServiceType();
			if (P3SProductTypeEnum.RENEWAL.equalsIgnoreCase(serviceType)) {
				// Renewal
				renewalService = service;
		    	PatentServiceImpl patentServiceImpl = new PatentServiceImpl(session);
		    	CostAnalysisData cad = patentServiceImpl.getCostAnalysisData(patentV2UI.getId());
		    	Date startDate = shorttermGetCostbandSTARTdate(cad);
				Date endDate = service.getCostBandEndDate();
				int percentageElapsed = calcIntegerPercentageBetween2Dates(startDate, endDate);
				patentV2UI.setRenewalStageProgress(percentageElapsed);
			} else if (P3SProductTypeEnum.FORM1200.equalsIgnoreCase(serviceType)) {
				// Form1200
				form1200Service = service;
				EpctEngine epctEngine = new EpctEngine(patentV2UI);
				Date startDate = epctEngine.getCostStartEndDate();
				Date endDate = service.getCostBandEndDate();
				int percentageElapsed = calcIntegerPercentageBetween2Dates(startDate, endDate);
				patentV2UI.setForm1200StageProgress(percentageElapsed);
			}
		}
		
		// form1200FeeUI		// null unless Form1200 sale is viable
		if (form1200Service!=null) {
			Form1200FeeUI form1200FeeUI = null;
			// if (epct!=null) could use existing. But it might be out of date. So calc anyway
			EpctEngine epctEngine = new EpctEngine(patentV2UI);
			form1200FeeUI = new Form1200FeeUI(epctEngine.getFee());
			patentV2UI.setForm1200FeeUI(form1200FeeUI);
		}
		
		// renewalNotificationUIs
		patentV2UI.setRenewalNotificationUIs(patentV2UI.getNotificationUIs());
		
		// form1200NotificationUIs
		List<NotificationUI> form1200NotificationUIs = new ArrayList<NotificationUI>(); 
		// Thanksgiving approach - implement later
		patentV2UI.setForm1200NotificationUIs(form1200NotificationUIs);

	}

		
		
	
	
	
	
	
	// Start of internal methods
	
	/**
	 * A confidence check. If fails, don't prevent operation, but log
	 * @param str1 A string to check
	 * @param str2 Another string. Should be identical to the above
	 * @param logTitle A title for this specific test. Is logged. maybe null
	 */
	protected void checkStrSame(String str1, String str2, String logTitle) {
		try {
			if ( ! str1.trim().equalsIgnoreCase(str2.trim())) {
				throw new P3SException("str1!=str2");
			}
		} catch (P3SException | NullPointerException e) {
			logErrorAndContinue(CLASSNAME+" : Safety check FAILED. checkStrSame("+str1+", "+str2+", "+logTitle+")", e);
		}
	}
	protected void checkDateStrSame(Date date1, String str2, String logTitle) { // Assume yyyyMMdd
		try {
			DateFormat df = new SimpleDateFormat("yyyyMMdd"); 
			String str1 = df.format(date1);
			checkStrSame(str1, str2, logTitle);
		} catch (NullPointerException e) {
			logErrorAndContinue(CLASSNAME+" : Safety check FAILED. checkStrSame(Date, "+str2+", "+logTitle+")", e);
		}
	}
	protected String arrayListToCommaSeparatedString(ArrayList<String> strings) {
		if (strings==null) return null;
		if (strings.size()==0) return "";
		if (strings.size()==1) return strings.get(0);

		String grow = strings.get(0);
		for (int ii=1; ii<strings.size(); ii++) {
			grow += (","+strings.get(ii));
		}
		return grow;
	}

	
	// Internal methods
	
	protected int calcIntegerPercentageBetween2Dates(Date pastDate, Date futureDate) {
		String handle = CLASSNAME+":calcIntegerPercentageBetween2Dates ";
		if (pastDate==null || futureDate==null) fail(handle+"PASSED A NULL. "+(pastDate==null)+","+(futureDate==null));
		Date now = new Date();
		long clicksStart = pastDate.getTime();
		long clicksNow   = now.getTime();
		long clicksEnd   = futureDate.getTime();
		if (clicksNow < clicksStart || clicksEnd < clicksNow) fail(handle+"BAD ORDERING:"+pastDate+","+futureDate);
		
		long elapsed = clicksNow - clicksStart;
		long range = clicksEnd - clicksStart;
		long lngPercent = (elapsed * 100L)	 / range; 
		
		return (int) lngPercent;
	}

	/**
	 * ShortTerm - as this relies on v1 calculation and storage mechanisms, which MAY be superceded after v2.1
	 * (This created for v2.1)
	 * .. and if this is to remain, it likely shouldn't be here ...   acTodo
	 * 
	 * Note: If current colour is grey, result is irrelevant, unreliable (& may be null)
	 */
	protected Date shorttermGetCostbandSTARTdate(CostAnalysisData cad) {
		// CostAnalysisData provides colour & all dates
		// so read the colour, & pick out the appropriate start date
		if (cad==null || cad.getCurrentcostBand()==null) return null;

		String colourNow = cad.getCurrentcostBand();
		if (RenewalColourEnum.GREY.equals(colourNow)) return null;
		
		switch (colourNow) {
		  case RenewalColourEnum.GREEN:		return cad.getGreenStartDate();
		  case RenewalColourEnum.AMBER:		return cad.getGreenStartDate();
		  case RenewalColourEnum.RED:		return cad.getGreenStartDate();
		  case RenewalColourEnum.BLUE:		return cad.getGreenStartDate();
		  case RenewalColourEnum.BLACK:		return cad.getGreenStartDate();
		}
		
		fail(CLASSNAME+":shorttermGetCostbandSTARTdate has failed ...");
		// Shouln't get here
		return null;
	}


}
