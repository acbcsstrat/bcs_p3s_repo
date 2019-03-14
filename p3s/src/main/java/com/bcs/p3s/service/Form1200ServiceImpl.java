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
import com.bcs.p3s.display.P3SService;
import com.bcs.p3s.display.PatentV2UI;
import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.display.form1200.CostAnalysisDataForm1200;
import com.bcs.p3s.display.form1200.Form1200SavedData;
import com.bcs.p3s.display.form1200.GenerateForm1200DataIn;
import com.bcs.p3s.display.form1200.PageDescriptionEnum;
import com.bcs.p3s.display.form1200.PageDescriptionTool;
import com.bcs.p3s.display.form1200.PageDescriptionUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.engine.ServiceManager;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.enump3s.EPCTnotAvailableReasonEnum;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.form1200.CountryStatesUtil;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SException;
import com.bcs.p3s.util.lang.P3SRuntimeException;


@Service("Form1200Service")
public class Form1200ServiceImpl extends ServiceAuthorisationTools implements Form1200Service {

	protected String PREFIX = CLASSNAME + " : "; 

	
	public Form1200ServiceImpl(HttpSession session) {
		super();
		this.session = session;
	}


	@Override
	public StartForm1200Api21UI getForm1200QuestionData(long patentId) {
		String err = PREFIX+"getForm1200QuestionData("+patentId+") ";
		checkForm1200isViable(patentId, err);
		
		StartForm1200Api21UI questionData = new StartForm1200Api21UI();
		Patent patent = Patent.findPatent(patentId);

		questionData.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
		questionData.setClientRef(patent.getClientRef());

		boolean isOfficeEP = false;
		String office = patent.getInternationalSearchOffice();
		if (office!=null && office.equals("EP")) isOfficeEP = true;
		questionData.setShowOptionalQuestion(isOfficeEP);
				
		EpctEngine epctEngine = new EpctEngine(patent);
		questionData.setIsYear3RenewalDue(epctEngine.isRenewalFeeOptional());

		questionData.setExtensionStatesUI(CountryStatesUtil.generateListOfExtensionStates());
		questionData.setValidationStatesUI(CountryStatesUtil.generateListOfValidationStates());

		return questionData;
	}

	/**
	 * Add Form1200 details from a Form1200Record into the appropriate fields in the Patent object
	 */
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

			//dteDebug = new DateUtil().stringToDate( form1200.getPriorityDate() ); //NPE
			String priorityDateOrNull = form1200.getPriorityDate();
			dteDebug = null;
			if (priorityDateOrNull !=null) dteDebug = new DateUtil().stringToDate(priorityDateOrNull);
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
	public EpctEngine populatePatentInfo(PatentV2UI patentV2UI, HttpSession session) {
		String handle = CLASSNAME+" : populatePatentInfo() ";
		log().debug(handle+"invoked for patent "+patentV2UI.getId());
		
    	// fields to populate:
				
    	// portfolioUI
		PortfolioServiceImpl portfolioServiceImpl = new PortfolioServiceImpl(session);
    	ServiceManager serviceManager = new ServiceManager(); 
		PortfolioUI portfolioUI = portfolioServiceImpl.createPortfolioUIforPatent(patentV2UI, serviceManager, session);
		patentV2UI.setPortfolioUI(portfolioUI);
	
		// form1200PdfUrl 
		Epct epct = Epct.findActiveEpctByPatent(patentV2UI);
		if (epct!=null && epct.getForm1200()!=null) {

			String form1200PdfUrl = "";  // existing simile is: "invoiceUrl":"/p3sweb/invoice/34"
			try {
				P3SPropertyReader reader = new P3SPropertyReader();
				form1200PdfUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
			} catch (P3SPropertyException e) {
				log().error("Read P3S_WEB_TOMCAT_URL_BASE from property file failed, so form1200PdfUrl will be incomplete.", e);
				// swallow & continue
			}
			//form1200PdfUrl = "/p3sweb/download.pdf?epctId="+epct.getId();
			form1200PdfUrl += "download.pdf?epctId="+epct.getId();
			patentV2UI.setForm1200PdfUrl(form1200PdfUrl);
		}
		
		// renewalStageProgress & form1200StageProgress.   Integer percentage from last colour-change to next. Not used if in Grey
		//P3SService renewalService = null;
		P3SService form1200Service = null;
		patentV2UI.setRenewalStageProgress(0);
		patentV2UI.setForm1200StageProgress(0);
		List<P3SService> services = portfolioUI.getServiceList();
		EpctEngine epctEngine = new EpctEngine(patentV2UI);
		boolean e1200EngineCalcBandDates = false;
		//if (services==null) fail(handle+"services can be empty, but must not be null. Failed!");
		for (P3SService service : services) {
			String serviceType = service.getServiceType();
			if (P3SProductTypeEnum.RENEWAL.equalsIgnoreCase(serviceType)) {
				// Renewal
				//renewalService = service;
				PatentServiceImpl patentServiceImpl = new PatentServiceImpl(session);
				CostAnalysisData cad = patentServiceImpl.getCostAnalysisData(patentV2UI.getId());
				Date startDate = shorttermGetCostbandSTARTdate(cad);
				Date endDate = service.getCostBandEndDate();
				int percentageElapsed = calcIntegerPercentageBetween2Dates(startDate, endDate);
				patentV2UI.setRenewalStageProgress(percentageElapsed);
			} else if (P3SProductTypeEnum.FORM1200.equalsIgnoreCase(serviceType)) {
				// Form1200
				form1200Service = service;
				if ( ! e1200EngineCalcBandDates) {
					epctEngine.calcEpctPersistPricingOnly(null);
					e1200EngineCalcBandDates = true;
				}
				Date startDate = epctEngine.getCostStartDate();
				Date endDate = service.getCostBandEndDate();
				int percentageElapsed = calcIntegerPercentageBetween2Dates(startDate, endDate);
				patentV2UI.setForm1200StageProgress(percentageElapsed);
			}
		}
		
		// form1200FeeUI		// null unless Form1200 sale is viable
		if (form1200Service!=null) {
			Form1200FeeUI form1200FeeUI = null;
			// if (epct!=null) could use existing. But it might be out of date. So calc anyway
			//EpctEngine epctEngine = new EpctEngine(patentV2UI); reuse above - acTidy once proven safe
			form1200FeeUI = new Form1200FeeUI(epctEngine.getFee());
			patentV2UI.setForm1200FeeUI(form1200FeeUI);
		}
		
		// renewalNotificationUIs
		//patentV2UI.setRenewalNotificationUIs(patentV2UI.getRenewalNotificationUIs()); // remove. pointless. 
		
		// form1200NotificationUIs
		//patentV2UI.setEpctNotificationUIs(patentV2UI.getEpctNotificationUIs()); // remove. pointless. 
		// acTidy of above. HOPEFULLY  renewalNotificationUIs & form1200NotificationUIs are already populated acTodo z2.1
		
		// 190104 Late Bodge : FE has issues cos a NotEnglish epct data contains renewalFeeUI data. FE uses existance of such to decide 
		// to show RENEWAL prices - whereas BE expected FE to use the newly requested Service objects.
		// Immediate bodge. If patent in filing, set renewalFeeUI to null. Otherwise set form1200FeeUI null
		if (StageManager.isInFiling(patentV2UI.getEpoPatentStatus())) {
			log().debug("190104 for Patent "+patentV2UI.getId()+": is in filing, so setting renewalFeeUI to null");
			patentV2UI.setRenewalFeeUI(null);
		}
		else
		{
			log().debug("190104 for Patent "+patentV2UI.getId()+": is in prosecution, so setting form1200FeeUI to null");
			patentV2UI.setForm1200FeeUI(null);
		}
		
		return epctEngine;
	}

	/**
	 * as per (), but sets additional fields used for CostAnalysis
	 */
	@Override
	public CostAnalysisDataForm1200 populatePatentInfoPlusCostAnalysis(CostAnalysisDataForm1200 caData, PatentV2UI patentV2UI, HttpSession session) {
		String handle = CLASSNAME+" : populatePatentInfoPlusCostAnalysis() ";
		log().debug(handle+"invoked for patent "+patentV2UI.getId());
	
		EpctEngine epctEngine = populatePatentInfo(patentV2UI, session);

		caData.setGreenStartDate( epctEngine.getGreenStartDate() );
		caData.setAmberStartDate( epctEngine.getAmberStartDate() );
		caData.setRedStartDate( epctEngine.getRedStartDate() );
		caData.setRedEndDate( epctEngine.getRedEndDate() );
		
		DateUtil dateUtil = new DateUtil();
		caData.setGreenStartDateUI( dateUtil.dateToUSStringWithoutDayOfWeek(caData.getGreenStartDate()) );
		caData.setAmberStartDateUI( dateUtil.dateToUSStringWithoutDayOfWeek(caData.getAmberStartDate()) );
		caData.setRedStartDateUI( dateUtil.dateToUSStringWithoutDayOfWeek(caData.getRedStartDate()) );
		caData.setRedEndDateUI( dateUtil.dateToUSStringWithoutDayOfWeek(caData.getRedEndDate()) );

		Epct optionalParamNotWantedHere = null;
		epctEngine.calcEpctPersistPricingWithCostAnalysis(caData, optionalParamNotWantedHere);
		
		return caData;
	}

	
		
	/**
	 * A much simpler variant of populatePatentInfo
	 * This purely calculates Patent epct settings - for persistence (cf *UI)
	 * @param patent - The contents of which will be updated
	 */
	@Override
	public void calcEpctStatuss(Patent patent) {
		EpctEngine epctEngine = new EpctEngine(patent);
		
		epctEngine.calcEpctStatusAndReason();
		// That will have set the 2 patent E-PCT status values, as appropriate  
	}

	
	
	
	
	
//	/**
//	 * User has entered the Form1200 questions, & chosen to SAVE the E-PCT application, & thus generate the E-PCT review PDF
//	 * @param patentId
//	 * @param clientRef
//	 * @param totalClaims
//	 * @param isYear3RenewalPaying
//	 * @param totalPages
//	 * @param extensionStatesUI
//	 * @param validationStatesUI
//	 * @param pageDescriptionUI
//	 */
//	@Override
//	public Form1200SavedData saveNewForm1200details(long  patentId, String clientRef, long totalClaims, boolean isYear3RenewalPaying, long totalPages, 
//			List<ExtensionStateUI> extensionStatesUI, List<ValidationStateUI> validationStatesUI, List<PageDescriptionUI> pageDescriptionUI, P3SUser me) 
//	{
//		String err = PREFIX+"saveForm1200details("+patentId+") ";
//		log().debug(err+" invoked");
//		
//		checkForm1200AsEntered4MissingData(patentId, err, totalClaims, totalPages, extensionStatesUI, validationStatesUI, pageDescriptionUI);
//		// No exceptions anticipted, so pass any up to controller
//
//		Patent patent = Patent.findPatent(patentId);
//
//		// This methods need to: create Form1200Fee; create Epct, persist both & wire-up, then gen PDF, the gen table 2.2b data to return
//		
//		// Note: Ignore any existing E-PCT record. If it exists, would be a failed payment
//		
//		// Form1200Fee  : access the existing code for populating this
//	    PatentService patentService = new PatentServiceImpl(session);
//	    PatentV2UI patentV2UI = patentService.getPatentInfo(patentId, session);
//		EpctEngine epctEngine = new EpctEngine(patentV2UI); // This needs invoking here, to calculate dates PRIOR to populating epct. But don't invoke pricing until AFTER epct populated 
//
//		Epct epct = new Epct();
//		
//		CountryStatesUtil countryStatesUtil = new CountryStatesUtil();
//		PageDescriptionTool pageDescriptionTool = new PageDescriptionTool();
//		// Cannot do this ! (Hence below workaround)
//		// The method listAbstractStates2commaSeparatedString(List<AbstractState>) in the type CountryStatesUtil is not applicable for the arguments (List<ExtensionStateUI>)
//		//epct.setExtensionStates(countryStatesUtil.listAbstractStates2commaSeparatedString(extensionStatesUI));
//
//		epct.setExtensionStates(countryStatesUtil.listSelectedExtensionStatesUI2commaSeparatedString(extensionStatesUI));
//		epct.setValidationStates(countryStatesUtil.listSelectedValidationStatesUI2commaSeparatedString(validationStatesUI));
//		epct.setTotalClaims( (int) totalClaims);			
//		epct.setTotalPages( (int) totalPages);
//
//		PageDescriptionUI descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Description);
//		epct.setDescriptionStartPage(new Integer(descFromTo.getTypeStart()));
//		epct.setDescriptionEndPage(new Integer(descFromTo.getTypeEnd()));
//
//		descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Claims);
//		epct.setClaimsStartPage(new Integer(descFromTo.getTypeStart()));
//		epct.setClaimsEndPage(new Integer(descFromTo.getTypeEnd()));
//
//		descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Drawings);
//		epct.setDrawingsStartPage(new Integer(descFromTo.getTypeStart()));
//		epct.setDrawingsEndPage(new Integer(descFromTo.getTypeEnd()));
//
//		boolean isYear3RenewalOptional = epctEngine.isRenewalFeeOptional();
//		boolean isPayingOptionalYr3Renewal = false;
//		if (isYear3RenewalOptional && isYear3RenewalPaying) isPayingOptionalYr3Renewal = true; 
//		epct.setIsYear3RenewalDue(isYear3RenewalOptional);
//		epct.setIsYear3RenewalPaying(isPayingOptionalYr3Renewal);
//		epct.setEpctSubmittedDate(null);
//		
//		epct.setEpctApplicationExpiryDate(epctEngine.getRedStartDate());
//		epct.setEpctStatus(Form1200StatusEnum.AWAIT_PDF_GEN_START);
//		epct.setCreatedBy(me);
//		epct.setCreatedDate(new Date());
//
//		epctEngine.calcEpctPersistPricingOnly(epct);
//		Form1200Fee form1200Fee = epctEngine.getFee(); // this'll be correctly populated, even if a failed Epct exists
//		
//		
//		// Prepare for persist
//		form1200Fee.ensureNoNulls();
//		
//		
//		// Persist. Do the 3+step / inc. wire
//		form1200Fee = form1200Fee.persist();
//		
//		epct.setPatent(patent);
//		
//		epct.setForm1200Fee(form1200Fee);
//		epct.setForm1200(null);
//		epct = epct.persist();
//		
//		form1200Fee.setEpct(epct);
//		form1200Fee.merge();
//
//		patent.setEpctStatus(epct.getEpctStatus());
//		patent.setEpctNotAvailableReason(null);
//		patent.merge();
//
//		// generate the PDF
//		// This will be done by cron
//		
//		// -----------------------------------------------------------------------------------
//		// Prepare the table 2.2b data to return to FE
//		// Required data: patentId, EP_ApplicationNumber, form1200PdfUrl, form1200FeeUI. i.e. a Form1200SavedData
//		Form1200SavedData form1200SavedData = new Form1200SavedData();
//		form1200SavedData.setPatentId(patentId);
//		form1200SavedData.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
//		form1200SavedData.setForm1200PdfUrl(null); // It hasn't even Started being created yet
//		Form1200FeeUI form1200FeeUI = new Form1200FeeUI(form1200Fee);
//		form1200SavedData.setForm1200FeeUI(form1200FeeUI);
//			
//			
//		return form1200SavedData;
//	}

	
	
	// acTodo z2.1 below copy of above
	/**
	 * User has entered the Form1200 questions, & chosen to SAVE the E-PCT application, & thus generate the E-PCT review PDF
	 * @param patentId
	 * @param clientRef
	 * @param totalClaims
	 * @param isYear3RenewalPaying
	 * @param totalPages
	 * @param extensionStatesUI
	 * @param validationStatesUI
	 * @param pageDescriptionUI
	 */
	@Override
	public Form1200SavedData saveNewForm1200details(GenerateForm1200DataIn generateForm1200DataIn, P3SUser me)
	{
		if (generateForm1200DataIn==null || me==null) throw new P3SRuntimeException("passed a null!");
		
		String err = PREFIX+"saveNewForm1200details("+generateForm1200DataIn.getPatentId()+") ";
		log().debug(err+" invoked");
		
	//	checkForm1200AsEntered4MissingData(patentId, err, totalClaims, totalPages, extensionStatesUI, validationStatesUI, pageDescriptionUI);

		log().debug("   ********  NullWatch  *********  early saveNewForm1200details - preCheck : PageDescriptionsUI==null is  "+(generateForm1200DataIn.getPageDescriptionsUI()==null) );

		
		checkForm1200AsEntered4MissingData(generateForm1200DataIn.getPatentId(), err, generateForm1200DataIn.getTotalClaims(),
				generateForm1200DataIn.getTotalPages(), generateForm1200DataIn.getExtensionStatesUI(), generateForm1200DataIn.getValidationStatesUI(),
				generateForm1200DataIn.getPageDescriptionsUI() );
		
		
		// No exceptions anticipted, so pass any up to controller
		
		long patentId = generateForm1200DataIn.getPatentId();
		Patent patent = Patent.findPatent(patentId);

		// This methods need to: create Form1200Fee; create Epct, persist both & wire-up, then gen PDF, the gen table 2.2b data to return
		
		// Note: Ignore any existing E-PCT record. If it exists, would be a failed payment
		
		// Form1200Fee  : access the existing code for populating this
	    PatentService patentService = new PatentServiceImpl(session);
	    PatentV2UI patentV2UI = patentService.getPatentInfo(patentId, session);
		EpctEngine epctEngine = new EpctEngine(patentV2UI); // This needs invoking here, to calculate dates PRIOR to populating epct. But don't invoke pricing until AFTER epct populated 

		Epct epct = new Epct();
		
		CountryStatesUtil countryStatesUtil = new CountryStatesUtil();
		PageDescriptionTool pageDescriptionTool = new PageDescriptionTool();
		// Cannot do this ! (Hence below workaround)
		// The method listAbstractStates2commaSeparatedString(List<AbstractState>) in the type CountryStatesUtil is not applicable for the arguments (List<ExtensionStateUI>)
		//epct.setExtensionStates(countryStatesUtil.listAbstractStates2commaSeparatedString(extensionStatesUI));

		String clientRef = generateForm1200DataIn.getClientRef();
		if (isEmpty(clientRef )) clientRef = ""; else if (clientRef.length()>15) fail(err+" clientRef TOO LONG: >15 : "+clientRef);
		String uniqueClientRef = ensureEpctClientRefIsUnique(clientRef, epct, patentId);
		epct.setClientRef(uniqueClientRef);
		
		epct.setExtensionStates(countryStatesUtil.listSelectedExtensionStatesUI2commaSeparatedString(generateForm1200DataIn.getExtensionStatesUI()));
		epct.setValidationStates(countryStatesUtil.listSelectedValidationStatesUI2commaSeparatedString(generateForm1200DataIn.getValidationStatesUI()));
		epct.setTotalClaims( (int) generateForm1200DataIn.getTotalClaims());			
		epct.setTotalPages( (int) generateForm1200DataIn.getTotalPages());

		List<PageDescriptionUI> pageDescriptionUI = generateForm1200DataIn.getPageDescriptionsUI();
		PageDescriptionUI descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Description);
		epct.setDescriptionStartPage(new Integer(descFromTo.getTypeStart()));
		epct.setDescriptionEndPage(new Integer(descFromTo.getTypeEnd()));

		descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Claims);
		epct.setClaimsStartPage(new Integer(descFromTo.getTypeStart()));
		epct.setClaimsEndPage(new Integer(descFromTo.getTypeEnd()));

		descFromTo = pageDescriptionTool.getPageDescriptionUIofType(pageDescriptionUI, PageDescriptionEnum.Drawings);
		epct.setDrawingsStartPage(new Integer(descFromTo.getTypeStart()));
		epct.setDrawingsEndPage(new Integer(descFromTo.getTypeEnd()));

		boolean isYear3RenewalOptional = epctEngine.isRenewalFeeOptional();
		boolean isPayingOptionalYr3Renewal = false;
		if (isYear3RenewalOptional && generateForm1200DataIn.isYear3RenewalPaying()) isPayingOptionalYr3Renewal = true; 
		epct.setIsYear3RenewalDue(isYear3RenewalOptional);
		epct.setIsYear3RenewalPaying(isPayingOptionalYr3Renewal);
		epct.setEpctSubmittedDate(null);
		
//		// Here, EpctEngine has not calculated the RedStartDate
//		// Calling calcEpctPersistPricingOnly() incurs far more processing than required. Go with it for now
//		epctEngine.calcEpctPersistPricingOnly(epct);

		
		epctEngine.calcDatesAndColourOnly();  // to calc RedStartDate
		epct.setEpctApplicationExpiryDate(epctEngine.getRedStartDate());
		
		epct.setEpctStatus(Form1200StatusEnum.AWAIT_PDF_GEN_START);
		epct.setCreatedBy(me);
		epct.setCreatedDate(new Date());

		epctEngine.calcEpctPersistPricingOnly(epct);
		Form1200Fee form1200Fee = epctEngine.getFee(); // this'll be correctly populated, even if a failed Epct exists
		
		
		// Prepare for persist
		form1200Fee.ensureNoNulls();
		
		
		// Persist. Do the 3+step / inc. wire
		form1200Fee = form1200Fee.persist();
		
		epct.setPatent(patent);
		
		epct.setForm1200Fee(form1200Fee);
		epct.setForm1200(null);
		epct = epct.persist();
		
		form1200Fee.setEpct(epct);
		form1200Fee.merge();

		patent.setEpctStatus(epct.getEpctStatus());
		patent.setEpctNotAvailableReason(null);
		patent.merge();

		// generate the PDF
		// This will be done by cron
		
		// -----------------------------------------------------------------------------------
		// Prepare the table 2.2b data to return to FE
		// Required data: patentId, EP_ApplicationNumber, form1200PdfUrl, form1200FeeUI. i.e. a Form1200SavedData
		Form1200SavedData form1200SavedData = new Form1200SavedData();
		form1200SavedData.setPatentId(patentId);
		form1200SavedData.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
		form1200SavedData.setForm1200PdfUrl(null); // It hasn't even Started being created yet
		Form1200FeeUI form1200FeeUI = new Form1200FeeUI(form1200Fee);
		form1200SavedData.setForm1200FeeUI(form1200FeeUI);
			
			
		return form1200SavedData;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	@Override
	public void deleteCurrentForm1200Data(long patentId) {
		
		String err = PREFIX+"deleteCurrentForm1200Data("+patentId+") ";

		checkForm1200isDeletable(patentId, err);
	
		Patent patent = Patent.findPatent(patentId);
		Epct epct = Epct.findActiveEpctByPatent(patent);

		Form1200 form1200 = epct.getForm1200(); 
		Form1200Fee form1200Fee = epct.getForm1200Fee(); 
		
		// start the 3-step
		if (form1200 != null) {
			epct.setForm1200(null);
			epct.merge();
			epct = Epct.findActiveEpctByPatent(patent);
			
			form1200.remove();
			//form1200.flush();
			form1200 = null;
		}
	
		form1200Fee.setEpct(null);
		form1200Fee.merge();
		
		epct.remove();
		form1200Fee.remove();
		
		patent.setEpctStatus(Form1200StatusEnum.EPCT_AVAILABLE);
		patent.merge();

		// Possibly flushing is required

	}
	
	
	
	@Override
	public void rejectCurrentForm1200(long patentId, String fail_reason) {
		
		String err = PREFIX+"rejectCurrentForm1200("+patentId+", "+fail_reason+") ";
		checkForm1200isRejectable(patentId, err);
	
		Patent patent = Patent.findPatent(patentId);
		Epct epct = Epct.findActiveEpctByPatent(patent);

		EPCTnotAvailableReasonEnum reason = new EPCTnotAvailableReasonEnum(fail_reason);
		if (reason.isNotAvailableReasonTerminal())
			failMalicious(err+"("+patentId+","+fail_reason+") passed a Terminal reason");
		
		if (epct != null) {
			epct.setEpctStatus(Form1200StatusEnum.EPCT_REJECTED);
			epct.merge();
		}

		patent.setEpctStatus(Form1200StatusEnum.EPCT_REJECTED);
		patent.setEpctNotAvailableReason(reason.toString());
		patent.merge();
	}
	

	
	/**
	 * Created to access the Form1200 PDF Blob, but available to all
	 * Provides the usual access authorisation checks
	 *  
	 * @param epctId
	 * @return An Epct (or null)
	 */
	@Override
	public Epct findEpct(long epctId) {

		Epct epct = Epct.findEpct(epctId);
		if (epct==null) { log().error("findEpct("+epctId+") yields null. from "+CLASSNAME); return null; }
		
		checkThisIsMyPatent(epct.getPatent().getId(), "from findEpct("+epctId+") in "+CLASSNAME);
		
		return epct;
	}

	
	
	
	
	// End of public methods
	
	
	
	
	// Start of internal methods
	
	/**
	 * A confidence check. If fails, don't prevent operation, but log
	 * @param str1 A string to check
	 * @param str2 Another string. Should be identical to the above
	 * @param logTitle A title for this specific test. Is logged. maybe null
	 */
	protected void checkStrSame(String str1, String str2, String logTitle) {
		if (str1==null || str2==null) { 
			log().info(CLASSNAME+" : passed NULL to checkStrSame("+str1+", "+str2+", "+logTitle+")");
			return;
		}
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
		
		return ((Long) lngPercent).intValue();
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

	protected String ensureEpctClientRefIsUnique(String proposedClientRef, Epct epct, long patentId) {
		String unq = proposedClientRef;
	    List<Epct> existingMatchingEpcts = Epct.findEpctsByClientRef(proposedClientRef);
	    if (existingMatchingEpcts.size()>0) {
	    	proposedClientRef = genHopefullyUniqueClientRef(proposedClientRef, patentId);
		    List<Epct> existingMatchingEpcts2 = Epct.findEpctsByClientRef(proposedClientRef);
		    if (existingMatchingEpcts2.size()>0) {
		    	// Dog's chance
		    	proposedClientRef = "PP"+patentId;
			    List<Epct> existingMatchingEpcts3 = Epct.findEpctsByClientRef(proposedClientRef);
			    if (existingMatchingEpcts3.size()>0) {
			    	fail("Strewth - Never gonna happen. ensureEpctClientRefIsUnique("+unq+", "+epct.getId()+", "+patentId+")");
			    } else unq = proposedClientRef;
		    } else unq = proposedClientRef;
	    } // else - no action needed
		return unq;
	}
	
	protected String alphaNumOnly(String offered) {
		if (isEmpty(offered)) offered = "";
		String safe = "";
		int initLen = offered.length();
		for (int ii = 0 ; ii<initLen ; ii++) {
			char aChar = offered.charAt(ii);
			if (Character.isAlphabetic(aChar) || Character.isDigit(aChar)) safe += aChar;
		}
		return safe; 
	}
	protected String genHopefullyUniqueClientRef(String proposedClientRef, long patentId) {
		if (isEmpty(proposedClientRef)) proposedClientRef = "P";
		proposedClientRef = alphaNumOnly(proposedClientRef);
		String numeric = ""+patentId;
		int numlen = numeric.length();
		int allowedlen = 15 - numlen;
		int strlen = proposedClientRef.length();
		if (allowedlen>strlen) allowedlen = strlen; 
		
		String built = proposedClientRef.substring(0, allowedlen) + numeric;
		
		return built;
	}
}
