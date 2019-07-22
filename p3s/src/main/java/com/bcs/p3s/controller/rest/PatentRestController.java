package com.bcs.p3s.controller.rest;
 
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PatentV2UI;
import com.bcs.p3s.display.RenewalUI;
import com.bcs.p3s.display.form1200.CostAnalysisDataForm1200;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.NotificationProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.Form1200Service;
import com.bcs.p3s.service.Form1200ServiceImpl;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.currency.CurrencyUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;



@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class PatentRestController extends Universal {
 
    @Autowired
    PatentService patentService;  //Service which will do all data retrieval/manipulation work
 
    @Autowired
    HttpSession session ;
    
    
    //------------------- Retrieve All Patents (For this Business) --------------------------------------------------
     
    // Implements API section 2.1 - Get all patents for this business
    
    // v2.1 - this now DANGEROUS - are reputably not needed, so Rate likely not inverted - so renames OBS to disable
    @RequestMapping(value = "/rest-patents-OBS/", method = RequestMethod.GET)
    public ResponseEntity<List<PatentUI>> listAllPatentUIsForBusiness() {
		String idh = CLASSNAME + "listAllPatentUIsForBusiness() : /rest-patents-OBS/ ";
    	log().debug(idh+"invoked. ");
		List<PatentUI> patentUIs = null;
		
		try{
	
	    	PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
	    	//postSession = patentService.populateSessionBean();
	    	patentUIs = patentService.listAllPatentUIsForMyBusiness();
	    	
			log().debug(idh+" returning "+patentUIs.size()+" patents. "
					+ "Set PatentUI from patents data fetched from DB");
			
			
			log().debug(idh+"  getExtendedPatentData(patentUI) returning "+patentUIs.size()+" "
					+ "patents. Set extended fileds in PatentUI as well");
		}
		catch(Exception e){
			
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
        return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
    }
 

    
    //------------------- Get PatentInfo for a specified Patent --------------------------------------------------
    
    // Implements API section 3.2 of the v2.1 API
    // new for v2.1
    // Get all details about the specified patent
	@RequestMapping(value = "/rest-patent/{id}", method = RequestMethod.GET) 
	public ResponseEntity<PatentV2UI> assemblePatentInfo(@PathVariable("id") long id) {
    	long starttime = (new Date()).getTime();
		String handle = CLASSNAME + " : /rest-patent/ assemblePatentInfo("+id+") ";
		log().debug("invoked "+handle);
		PatentV2UI patentV2UI = null;

		try {
			Patent existingPatent = patentService.findById(id);
			if (existingPatent == null) {
				logM().info("Specified patent not exist or available. : "+handle);
			} else {
				// Populate the PatentV2UI
				patentV2UI = patentService.getPatentInfo(id, session);
			}
		} catch (Exception e) {
			// there may yet be EXPECTED errors to be caught here. 190627 update: none observed yet. acTidy
			logErrorAndContinue("Controller caught unexpected failure : "+handle, e);
		  	return new ResponseEntity<PatentV2UI>(patentV2UI, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		log().debug(runtimeMsg(starttime, handle));
		if (patentV2UI==null) return new ResponseEntity<PatentV2UI>(patentV2UI, HttpStatus.INTERNAL_SERVER_ERROR);
	  	return new ResponseEntity<PatentV2UI>(patentV2UI, HttpStatus.OK);
	}
		
		
	//------------------- Search EPO for a Patent - with view to - ADD that patent --------------------------------------------------
    
    // Implements API section 2.2
    // Search EPO for a patent match on the ApplicationNumber entered
	@RequestMapping(value = "/rest-search-patents/{patentApplicationNumber:.+}", method = RequestMethod.GET) 
	public ResponseEntity<PatentUI> searchEpoForPatent(@PathVariable("patentApplicationNumber") String patentApplicationNumber) {
		String handle = CLASSNAME + " : /rest-search-patents/ searchEpoForPatent("+patentApplicationNumber+") ";
		log().debug("invoked "+handle);
		PatentUI patentUI = null;
		boolean isFound = false;
		String checkDigit = null;
		
		try{
			patentApplicationNumber = patentApplicationNumber.toUpperCase();
			log().debug(handle+"invoked with param: "+patentApplicationNumber);
			
			/** Truncate check digit from EP application number entered **/
			checkDigit = patentService.truncateAndStoreCheckDigit(patentApplicationNumber);
			if(checkDigit == null){
				log().error("Format error for Patent Application Number ");
				return new ResponseEntity<PatentUI>(HttpStatus.BAD_REQUEST); 
			}
			
			/** PRECHECK 1::TO CHECK THE FORMAT OF PATENT APPLICATION NUMBER **/
			patentApplicationNumber = patentService.validateAndFormatApplicationNumber(patentApplicationNumber);
			if(patentApplicationNumber == null){
				log().error("Format error for Patent Application Number ");
				return new ResponseEntity<PatentUI>(HttpStatus.BAD_REQUEST); 
			}
			
			PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
			/** PRECHECK 2:: TO CHECK WHETHER PATENT APPLICATION NUMBER IS DUPLICATE **/
			isFound = patentService.isPatentFoundForBusiness(patentApplicationNumber,postSession);
			if(isFound){
				log().error("Duplicate patent for business " + patentApplicationNumber);
				return new ResponseEntity<PatentUI>(HttpStatus.NO_CONTENT); 
			}
			
			
		  	patentUI = patentService.searchEpoForPatent(patentApplicationNumber,postSession);
		  	if (patentUI != null) patentUI.setCheckDigit(checkDigit);
		  	
		}
		
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
	  	if(patentUI == null) {
	  		log().debug("EPO didn't recognise patent entered by user. "+handle);
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else{
	  		log().debug("EPO DID recognise patent entered by user. "+handle);
	  		return new ResponseEntity<PatentUI>(patentUI, HttpStatus.OK);
	  	}
	}
   

	
	
	
    //------------------- User confirms this EPO retrieved Patent is the correct one - so add it to the list of patents --------------------------------------------------
    
    // Implements API section 2.3
    // User has confirmed this is the correct patent. So persist it
					// would like to use:	(@RequestBody PatentUI patentUI) {
	@RequestMapping(value = "/rest-patents/", method = RequestMethod.POST) 
	public ResponseEntity<List<PatentUI>> saveNewPatent(@RequestBody Object obby) {
		String idh = CLASSNAME + "saveNewPatent() : /rest-patents/ ";
		log().debug(idh+"invoked ");
		List<PatentUI> patentUIs = null;
		try {
			//System.out.println("PatentRestController : /rest-patents/ [POST] invoked - i.e. ADD Patent");
	
			PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
			
			Patent newPatent = new Patent();
			ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
	
			Patent patent = data.extractPatentFromAddPatentForm(obby); 
			//calculate the extended data again
			
			log().info("A patent with application number[" + patent.getEP_ApplicationNumber() +"] having a status as " + patent.getEpoPatentStatus() + " being added");

			// Check patent not already exist for this client (old double-click issue)
			String newPatentEpAppNum = patent.getEP_ApplicationNumber();
			Business businessFromFE = patent.getBusiness();
            Business myBuisness = SecurityUtil.getMyBusiness();
            if (businessFromFE.getId()!=myBuisness.getId()) logM().error("BusMismatch!  "+businessFromFE.getId()+" != "+myBuisness.getId()+"  by "+SecurityUtil.getMyUserEmail() );
            List<Patent> existingPatentsForBusiness = Patent.findPatentsByBusiness(businessFromFE).getResultList();
            for (Patent anExistingPatent : existingPatentsForBusiness) {
            	if (anExistingPatent.getEP_ApplicationNumber().equals(newPatentEpAppNum)) 
            		throw new P3SRuntimeException("Whilst adding patent "+newPatentEpAppNum+" for business "+businessFromFE.getId()+" found we already have it!  ("+anExistingPatent.getId()+")  user="+SecurityUtil.getMyUser().getId()+" = "+SecurityUtil.getMyUserName());
            }
			
			
			//patent.persist();
			newPatent = patent.persist();

			// Set E-PCT status settings as appropriate
			// Note: this was previously being called just BEFORE the above patent.persist() - which caused a InvalidDataAccessApiUsageException 
			Form1200ServiceImpl form1200ServiceImpl = new Form1200ServiceImpl(session);
			form1200ServiceImpl.calcEpctStatuss(newPatent);

			log().debug("newPatent: not avail reason = "+newPatent.getEpctNotAvailableReason()+"      epctStatus = "+newPatent.getEpctStatus());  // debugging aide
			
			// Above may have updated patent Epct status' - so unconditionally update
			Patent newerPatent = newPatent.merge();
			
			
			// Set the Default email notifications for all products (Renewals and Form1200)
			List<Notification> allNotifications = Notification.findAllNotifications();
			Long newPatentId = newerPatent.getId();
			Long userId = postSession.getUser().getId();
			for (Notification notification : allNotifications) {
				if (notification.getDefaultOn()==true) {
					NotificationMapping notificationMapping = new NotificationMapping(newPatentId, userId, notification.getId());
					notificationMapping.persist();
				}
			}
			
			

			if(!(newerPatent == null)){
				log().debug("PatentRestController : /rest-patents/ saveNewPatent() completed.");
				log().info("A patent with application number[" + patent.getEP_ApplicationNumber() +"] being added by USER [user id:" + postSession.getUser().getId() +"]" );
			}
			//return ResponseEntity.ok().build();
			else{
				log().debug("PatentRestController : /rest-patents/ saveNewPatent() failed.");
				log().fatal("PatentRestController : /rest-patents/ saveNewPatent() failed for patent " + patent);
			}
			
			patentUIs = patentService.persistAndCalculateFee(newerPatent);  // misnomer - doesn't persist
	  		
		   	
		   	
		} catch (Exception e) {
			//StringWriter errors = new StringWriter();
			//e.printStackTrace(new PrintWriter(errors));
			//log().error("Stacktrace was: "+errors.toString());
			logErrorAndContinue("Controller POST /rest-patents/ caught unexpected failure : "+idh, e);
		  	return new ResponseEntity<List<PatentUI>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
		

   }


	
    //------------------- Update a Patent --------------------------------------------------------
	
    // Implements v2.1 API section 1.3
    // Update Patent: Customer is permitted to change 2 things: shortTitle, clientRef
	//
    // Formerly (v1) Implements API section 2.4
    // Update Patent: Customer is permitted to change 3 things: shortTitle, clientRef and which Notifications
	//
	// Note !
	// The patentUI parameter MAY be provided as a PatentUI, or more likely a LinkedHashMap, so, here, accept either
	// v2.1 : No longer receives notificationUIs parameter (tho no change to code in this class)
	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.PUT) 
	public ResponseEntity<PatentUI> updatePatent(@PathVariable("id") long id, @RequestBody Object untypedPatentUI) {
		String idh = CLASSNAME + "updatePatent() : /rest-patents/ ";

		log().debug("PatentRestController : /rest-patents/ updatePatent() [tolerant] invoked   -  untypedPppp  ");

		PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
		if (untypedPatentUI!=null) log().debug("  param untypedPatentUI is of type " + untypedPatentUI.getClass().getName());
		
		log().info("UPDATE patent[" + id +"] request from USER [id:" + postSession.getUser().getId() +"]");
		try {
			Patent existingPatent = patentService.findById(id);
			if (existingPatent == null) {
				log().debug("Unable to update. Patent with id " + id + " not found.  "+idh);
			} else {
				patentService.flexibleUpdatePatent(id, untypedPatentUI);
			}
		
		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}

		
		Patent nowPersistedPatent = patentService.findById(id);
  		
	  	if(nowPersistedPatent == null) {
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else {
	  		PatentUI updatedPatentUI = new PatentUI(nowPersistedPatent,postSession.getExtendedPatentUI());
	  		return new ResponseEntity<PatentUI>(updatedPatentUI, HttpStatus.OK);
	  	}
   }
    
	
    //------------------- Update Renewal Notifications --------------------------------------------------------
	
    // Implements v2.1 API section 6.1 Update Renewal Notifications
	@RequestMapping(value = "/rest-renewal-notifications/{id}", method = RequestMethod.PUT) 
	public ResponseEntity<PatentUI> ctrlUpdateRenewalNotifications(@PathVariable("id") long id, @RequestBody Object objListNotificationUIs) {
		
		log().debug("PatentRestController : /rest-renewal-notifications/"+id+" ctrlUpdateRenewalNotifications() invoked");
		if (objListNotificationUIs!=null) log().debug("  param objListNotificationUIs is of type " + objListNotificationUIs.getClass().getName());
		
		try {
			patentService.srvUpdateTypedNotifications(id, objListNotificationUIs, NotificationProductTypeEnum.RENEWAL);
		} catch (Exception e) {
			logErrorAndContinue("PatentRestController : /rest-renewal-notifications/"+id+" ctrlUpdateRenewalNotifications() failed",e);
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
		}

  		return new ResponseEntity<PatentUI>(HttpStatus.OK);
	}

	
    //------------------- Update E-PCT Notifications --------------------------------------------------------

	// Temporary test call for testing /rest-form1200-tmpGenF1200/ prior to the new FE being available
    @RequestMapping(value = "/rest-form1200-tmpGenF1200-tmpv21/", method = RequestMethod.POST)
    public ResponseEntity<PatentUI> ctrlUpdateEpctNotificationsTMPv21(
    		  @RequestParam("patentId") String strPatentId
      		, @RequestParam("val1") String val1 
    		, @RequestParam("val2") String val2 
    		, @RequestParam("val3") String val3 
    		, @RequestParam("val4") String val4 ) { 
	    		
    	long patentId = new Long(strPatentId);
    	LinkedHashMap<String, List<NotificationUI>> objListNotificationUIs = new LinkedHashMap<String, List<NotificationUI>>();
    	List<NotificationUI> buiList = new ArrayList<NotificationUI>();
    	
    	// patentService.srvUpdateTypedNotifications ONLY uses Notification.Id & productType - so only need populate that
    	if (notEmpty(val1)) {
    		Notification notification = new Notification();
    		notification.setId(new Long(val1));
    		notification.setProductType(NotificationProductTypeEnum.EPCT);
    		buiList.add(new NotificationUI(notification));
    	}
    	if (notEmpty(val2)) {
    		Notification notification = new Notification();
    		notification.setId(new Long(val2));
    		notification.setProductType(NotificationProductTypeEnum.EPCT);
    		buiList.add(new NotificationUI(notification));
    	}
    	if (notEmpty(val3)) {
    		Notification notification = new Notification();
    		notification.setId(new Long(val3));
    		notification.setProductType(NotificationProductTypeEnum.EPCT);
    		buiList.add(new NotificationUI(notification));
    	}
    	if (notEmpty(val4)) {
    		Notification notification = new Notification();
    		notification.setId(new Long(val4));
    		notification.setProductType(NotificationProductTypeEnum.EPCT);
    		buiList.add(new NotificationUI(notification));
    	}
    	objListNotificationUIs.put("notificationUIs", buiList);
		
		try {
			patentService.srvUpdateTypedNotifications(patentId, objListNotificationUIs, NotificationProductTypeEnum.EPCT);
		} catch (Exception e) {
			logErrorAndContinue("PatentRestController : /rest-form1200-tmpGenF1200-tmpv21/ ctrlUpdateEpctNotificationsTMPv21() failed",e);
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND);
		}
		log().debug("tmp dev ctrlUpdateEpctNotificationsTMPv21() completed ok");
  		return new ResponseEntity<PatentUI>(HttpStatus.OK);
    }

    		
    		
    // Implements v2.1 API section 6.2 Update Euro-PCT Notifications
	@RequestMapping(value = "/rest-epct-notifications/{id}", method = RequestMethod.PUT) 
	public ResponseEntity<PatentUI> ctrlUpdateEpctNotifications(@PathVariable("id") long id, @RequestBody Object objListNotificationUIs) {
		
		log().debug("PatentRestController : /rest-epct-notifications/"+id+" ctrlUpdateEpctNotifications() invoked");
		if (objListNotificationUIs!=null) log().debug("  param objListNotificationUIs is of type " + objListNotificationUIs.getClass().getName());
		
		try {
			patentService.srvUpdateTypedNotifications(id, objListNotificationUIs, NotificationProductTypeEnum.EPCT);
		} catch (Exception e) {
			logErrorAndContinue("PatentRestController : /rest-epct-notifications/"+id+" ctrlUpdateEpctNotifications() failed",e);
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
		}

  		return new ResponseEntity<PatentUI>(HttpStatus.OK);
	}

	
	//------------------- Delete a Patent --------------------------------------------------------

	// tmp for testing
	@RequestMapping(value = "/rest-patents-deltest/{id}", method = RequestMethod.GET)
	public ResponseEntity<Patent> deletePatentDeltest(@PathVariable("id") long id) {
		log().debug("PatentRestController : /rest-patents-deltest/ deletePatentDeltest() invoked ");
		log().debug(" with patent id = "+id);
		return deletePatent(id);
	}
	
    // Implements API section 2.5
    // User has confirmed this is the correct patent. So persist it
	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Patent> deletePatent(@PathVariable("id") long id) {
		log().debug("PatentRestController : /rest-patents/ deletePatent() invoked ");
	
		try{
			
			PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
			log().info("DELETE patent[" + id +"] request from USER [id:" + postSession.getUser().getId() +"]");
			/**
			 * EXTRA CAUTIOUS WHILE DELETING A PATENT WITH Payment In Progress or EPO Instructed
			 * Added later 06/02/2018 Prevent user from deleting a patent when there is any COMPLETED Renewal being made via P3S
			 */
			Patent deletePatent = patentService.findById(id);


			
			
			if (RenewalStatusEnum.isInProgress(deletePatent.getRenewalStatus())) {
				log().debug("User tries to delete a patent with an ongoing payment. Abort");
				return new ResponseEntity<Patent>(HttpStatus.NOT_MODIFIED);  //Pat to display error message on the page based on this value
			}
			
			TypedQuery<Renewal> q = Renewal.findRenewalsByPatent(deletePatent);
	    	List<Renewal> renewals = q.getResultList();
	    	if(!(renewals.isEmpty())){
	    		log().debug("User tries to delete a patent with a past Renewal being made via P3S. Abort");
				return new ResponseEntity<Patent>(HttpStatus.NOT_MODIFIED);  //Pat to display error message on the page based on this value
	    	}
			
			TypedQuery<Epct> q1200 = Epct.findEpctsByPatent(deletePatent);
	    	List<Epct> epcts = q1200.getResultList(); // Any Epct - whether 'active' or not. (Cos non-active are Penalty, so cannot be deleted)

	    	// An existing Epct MAY be deleteable. Check & abort if not
	    	if (epcts.size() > 0) {
		    	for (Epct epct : epcts) {
					String epctStatus = epct.getEpctStatus();
					boolean isDeletable = Form1200StatusEnum.isDeletable(epctStatus);
		    		if (isDeletable==false) {
			    		log().debug("User tries to delete a patent with an Undeletable Epct. Abort");
						return new ResponseEntity<Patent>(HttpStatus.NOT_MODIFIED);  //Pat to display error message on the page based on this value
		    		}
		    	}
		    	// so Can, and should, delete
		    	Form1200Service form1200Service = new Form1200ServiceImpl(session);
		    	form1200Service.deleteCurrentForm1200Data(id);
	    	}

	    	// Now delete the patent
		    patentService.deletePatentById(id);
		}
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
	    return new ResponseEntity<Patent>(HttpStatus.OK);
	}
  
  
	//------------------- Fetch FX rate --------------------------------------------------------

    // Implements API section 2.6
    @RequestMapping(value = "/rest-fxrate/", method = RequestMethod.GET)
    public ResponseEntity<FxRateCurrentUI> getFxRate() {
		String idh = CLASSNAME + "getFxRate() : /rest-fxrate/ ";
    	log().debug(idh+"invoked ");

    	FxRateCurrentUI fxRateCurrentUI = patentService.getCurrentFxRate();
    	
    	// v2.1 - these rates now need inverting
    	fxRateCurrentUI.getCurrentFXRate().setRate(CurrencyUtil.invertRate(fxRateCurrentUI.getCurrentFXRate().getRate()));
    	fxRateCurrentUI.getLastFXRate().setRate(CurrencyUtil.invertRate(fxRateCurrentUI.getLastFXRate().getRate()));
    	
        return new ResponseEntity<FxRateCurrentUI>(fxRateCurrentUI, HttpStatus.OK);
    }
	

    // Implements API section 2.9 
    // v2.1 - invert the Rate !
    @RequestMapping(value = "/rest-fxrates/{period}", method = RequestMethod.GET)
    public ResponseEntity<List<FxRateUI>> getFxRate(@PathVariable("period") String period) {
		String idh = CLASSNAME + "getFxRate() : /rest-fxrates/ ";
    	log().debug(idh+" ("+period+") invoked ");

		List<FxRateUI> history = patentService.getFxRateHistory(period);
    	
		// Invert each rate Here (for safety, keeping all 'normal' rates below controllers as non-inverted)
		List<FxRateUI> invertedHistory = new ArrayList<FxRateUI>();
		for (FxRateUI stdRate : history) {
			BigDecimal invertedRate = CurrencyUtil.invertRate(stdRate.getRate());
			FxRateUI inverted = new FxRateUI(invertedRate, stdRate.getRateActiveDate());
			invertedHistory.add(inverted);
		}
		
        return new ResponseEntity<List<FxRateUI>>(invertedHistory, HttpStatus.OK);
    }
	


	//-------------------- Fetch Cost Analysis Data (For Renewals) -----------------------------------------
    @RequestMapping(value = "/rest-cost-analysis/{id}", method = RequestMethod.GET)    
    public ResponseEntity<CostAnalysisData> getCAData(@PathVariable("id") long id) {
    	
    	log().debug("PatentRestController : /rest-cost-analysis/ invoked (for Renewals)");
    	//check whether id is null
    	CostAnalysisData costAnalysisData = patentService.getCostAnalysisData(id);
    	return new ResponseEntity<CostAnalysisData>(costAnalysisData, HttpStatus.OK);
    }
    
    
	//-------------------- Fetch Cost Analysis Data (For Form1200) -----------------------------------------
    @RequestMapping(value = "/rest-form1200-cost-analysis/{id}", method = RequestMethod.GET)    
    public ResponseEntity<CostAnalysisDataForm1200> getForm1200CostAnalysisData(@PathVariable("id") long id) {
    	
    	CostAnalysisDataForm1200 costAnalysisDataForm1200 = null;
    	log().debug("PatentRestController : /rest-form1200-cost-analysis/("+id+") invoked (for Form1200)");
		try {
	    	costAnalysisDataForm1200 = patentService.getCostAnalysisDataForm1200(id, session);
		} catch (Exception e) {
			logErrorAndContinue("PatentRestController : /rest-form1200-cost-analysis/"+id+" getForm1200CostAnalysisData() failed",e);
	  		return new ResponseEntity<CostAnalysisDataForm1200>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
    	return new ResponseEntity<CostAnalysisDataForm1200>(costAnalysisDataForm1200, HttpStatus.OK);
    }
		    
		    
	//---------------------Fetch Renewal History ------------------------------------------------
		    @RequestMapping(value = "/rest-renewal-history/{id}", method = RequestMethod.GET)    
		    public ResponseEntity<List<RenewalUI>> getRenewalHistory(@PathVariable("id") long id) {
		    	log().debug("PatentRestController : /rest-renewal-history/{"+id+"} invoked ");
		    	//check whether id is null
		    	List<RenewalUI> renewalHistoryData = patentService.getRenewalHistory(id);

		    	// Start of RenewalHistory workaround
		    	// Just 1 renewal yields about 3MB of JSON data. Seem browser aborts after 1M - so perform some radical cutdowns of this circular-data references
		    	// Also - had found that 'patentUI' was populated, but 'patent' wasn't (Why the duplication?).

		    	
		    	log().info("unqCode01: start to investigate data returned. list size is "+renewalHistoryData.size());
		    	if (renewalHistoryData.size()>0) {
			    	log().info("unqCode01: examine first element "+""+""+""+""+"");
			    	RenewalUI rury = renewalHistoryData.get(0);
			    	log().info("unqCode01: still alive. "+""+""+""+""+"");
			    	Payment activePaymentId = rury.getActivePaymentId();
			    	log().info("unqCode01: still alive. "+""+""+"(activePaymentId==null ) = "+""+ (activePaymentId==null ) );
			    	Patent patent = rury.getPatent();
			    	log().info("unqCode01:  = "+"(patent==null ) = "+ (patent==null ) );
			    	if (patent!=null) log().info("unqCode01:  and patentID = "+patent.getId());
			    	PatentUI patentUI = rury.getPatentUI();
			    	log().info("unqCode01:  = "+"(patentUI==null ) = "+ (patentUI==null ) );
			    	if (patentUI!=null) log().info("unqCode01:  and patentUI.getID() = "+patentUI.getId() );
		    		
		    	}
		    	
		    	// try a quicj bodge
		    	
		    	List<RenewalUI> bodge = new ArrayList<RenewalUI>();
		    	for (RenewalUI rury : renewalHistoryData) {
		    		long patentId = rury.getPatentUI().getId(); 
		    		Patent patent = Patent.findPatent(patentId);
		    		rury.setPatent(patent);
			    	
			    	// sofar sogood - what next

			    	// further bodge - make the data smaller
			    	// IN PATENT & patebtUI - nullify : BUSINESS
			    	// & in renewal - nullify : activePaymentId
			    	rury.getPatent().setBusiness(null);
			    	rury.getPatentUI().setBusiness(null);
			    	
			    	// rury.setActivePaymentId(null);  - too severe ?
			    	////rury.getActivePaymentId().setRenewals(new ArrayList<Renewal>());
			    	rury.getActivePaymentId().setEpcts(new ArrayList<Epct>());
			    	rury.getActivePaymentId().setInitiatedByUserId(null);
			    	//////rury.getActivePaymentId().setLatestInvoice(null);

			    	// Why isn't the existing ActivePaymentId.renewals ok. record whats there
			    	log().info("unqCode01: investigating the existing ActivePaymentId.renewals ");
			    	Payment pay = rury.getActivePaymentId();
			    	if (pay==null) log().info("unqCode01: pay is null ");
			    	else {
			    		log().info("unqCode01: pay id is "+pay.getId());
			    		List<Renewal> kylo = pay.getRenewals();
				    	if (kylo==null) log().info("unqCode01: pay kylo is null ");
				    	else {
				    		log().info("unqCode01: kylo is not null. is size "+kylo.size()+".      id of each renewal follows:");
				    		for (Renewal miniRen : kylo) { log().info("unqCode01: .....    "+miniRen.getId()); }
				    	}
			    	}
			    	
			    	Payment rey = Payment.findPayment(pay.getId());
		    		log().info("unqCode01: Created REY : id is "+rey.getId());
		    		List<Renewal> bb8 = rey.getRenewals();
			    	if (bb8==null) log().info("unqCode01: rey's bb8 is null ");
			    	else {
			    		log().info("unqCode01: bb8 is not null. is size "+bb8.size()+".      id of each renewal follows:");
			    		for (Renewal miniRen : bb8) { log().info("unqCode01: .....    "+miniRen.getId()); }
			    	}
			    	log().info("unqCode01: end of debug ");
			    	
			    	// Wow. bb8 is NULL - not event empty - acTidy
			    	// so give it an EMPTY renewals & see what happens ... 
		    		List<Renewal> po = new ArrayList<Renewal>();
		    		rey.setRenewals(po);
			    	rury.setActivePaymentId(rey);
			    	
			    	
			    	
			    	
			    	
			    	
//			    	// hereafter - attempts to provide payment with not-too-big renewal didnt help with the empty renewal fee proces
//			    	// rebuild 'renewals' for the payment
//			    	List<Renewal> rens = new ArrayList<Renewal>();
//			    	Renewal ren = Renewal.findRenewal(1L);	//  <<---  note HARDCODE
//		    	
//			    	// above made the json MASSIVE again - so
//			    	ren.getPatent().setBusiness(null);  // still huge, so look further ..
//			    	ren.setActivePaymentId(null);
//			    	ren.setPatent(null); //  as still too big
//			    	ren.setRenewalFee(null); //  as not SO big - but appears go into infinite loop on renewal:renewalFee
//			    	
//			    	
//			    	rens.add(ren);
//			    	rury.getActivePaymentId().setRenewals(rens);
			    	

			    	bodge.add(rury);
			    	log().info("unqCode01: re-bodged for patent #"+patentId);
		    	}
		    	
		    	
		    	
//		    	log().info("unqCode01: & AFTER the bodge . siz e = "+bodge.size()  );
//		    	if (bodge.size()>0) {
//			    	log().info("unqCode01: examine first element "+""+""+""+""+"");
//			    	RenewalUI rury = bodge.get(0);  //      <<<<---------   hardcode - first only
//			    	Patent patent = rury.getPatent();
//			    	log().info("unqCode01:  = "+"(patent==null ) = "+ (patent==null ) );
//			    	if (patent!=null) log().info("unqCode01:  and patentID = "+patent.getId());
//
//		    	
//			    	
//			    	// further bodge - make the data smaller
//			    	// IN PATENT & patebtUI - nullify : BUSINESS
//			    	// & in renewal - nullify : activePaymentId
//			    	rury.getPatent().setBusiness(null);
//			    	rury.getPatentUI().setBusiness(null);
//			    	
//			    	// rury.setActivePaymentId(null);  - too severe ?
//			    	////rury.getActivePaymentId().setRenewals(new ArrayList<Renewal>());
//			    	rury.getActivePaymentId().setEpcts(new ArrayList<Epct>());
//			    	rury.getActivePaymentId().setInitiatedByUserId(null);
//			    	//////rury.getActivePaymentId().setLatestInvoice(null);
//
//			    	
//			    	
//			    	// hereafter - attempts to provide payment with not-too-big renewal didnt help with the empty renewal fee proces
//			    	
//			    	List<Renewal> rens = new ArrayList<Renewal>();
//			    	Renewal ren = Renewal.findRenewal(1L);	//  <<---  note HARDCODE
//		    	
//			    	// above made the json MASSIVE again - so
//			    	ren.getPatent().setBusiness(null);  // still huge, so look further ..
//			    	ren.setActivePaymentId(null);
//			    	ren.setPatent(null); //  as still too big
//			    	ren.setRenewalFee(null); //  as not SO big - but appears go into infinite loop on renewal:renewalFee
//			    	
//			    	
//			    	rens.add(ren);
//			    	rury.getActivePaymentId().setRenewals(rens);
//			    	
//		    	}
		    	

		    	
		    	
		    	// End of RenewalHistory workaround
		    	
		    	
		    	
		    	
		    	
		    	
		    	
		    	
		    	//return new ResponseEntity<List<RenewalUI>>(renewalHistoryData, HttpStatus.OK);
		    	return new ResponseEntity<List<RenewalUI>>(bodge, HttpStatus.OK);
		    }
	
	//------------------- next ... a Patent : ARE THERE ANY MORE ???  --------------------------------------------------------
	

}