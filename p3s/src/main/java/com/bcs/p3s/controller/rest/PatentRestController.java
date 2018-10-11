package com.bcs.p3s.controller.rest;
 
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;
import javax.swing.event.PopupMenuListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.RenewalUI;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.engine.GenericProcessingEngine;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.NotificationMapping;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.PatentExtendedData;
 
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
    @RequestMapping(value = "/rest-patents/", method = RequestMethod.GET)
    public ResponseEntity<List<PatentUI>> listAllPatentUIsForBusiness() {
		log().debug("PatentRestController : /rest-patents/ listAllPatentUIsForBusiness() invoked. ");
		List<PatentUI> patentUIs = null;
		
		try{
	    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) invoked ");
	
	    	PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
	    	//postSession = patentService.populateSessionBean();
	    	patentUIs = patentService.listAllPatentUIsForMyBusiness();
	    	
	    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) ret Qty "+patentUIs.size());
	    	
			log().debug("PatentRestController : /rest-patents/ listAllPatentUIsForBusiness() returning "+patentUIs.size()+" patents. "
					+ "Set PatentUI from patents data fetched from DB");
			
			
			log().debug("PatentRestController : /rest-patents/ getExtendedPatentData(patentUI) returning "+patentUIs.size()+" "
					+ "patents. Set extended fileds in PatentUI as well");
		}
		catch(Exception e){
			
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
        return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
    }
 

    
    //------------------- Search EPO for a Patent - with view to - ADD that patent --------------------------------------------------
    
    // Implements API section 2.2
    // Search EPO for a patent match on the ApplicationNumber entered
	@RequestMapping(value = "/rest-search-patents/{patentApplicationNumber:.+}", method = RequestMethod.GET) 
	public ResponseEntity<PatentUI> searchEpoForPatent(@PathVariable("patentApplicationNumber") String patentApplicationNumber) {
		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
		PatentUI patentUI = null;
		boolean isFound = false;
		String checkDigit = null;
		
		try{
			System.out.println("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
			
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
		  	patentUI.setCheckDigit(checkDigit);
		  	
		}
		
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
	  	if(patentUI == null) {
	  		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent("+patentApplicationNumber+") found no match");
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else{
	  		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent("+patentApplicationNumber+") found match = " + (patentUI != null));
	  		return new ResponseEntity<PatentUI>(patentUI, HttpStatus.OK);
	  	}
	}
   

	
	
	
    //------------------- User confirms this EPO retrieved Patent is the correct one - so add it to the list of patents --------------------------------------------------
    
    // Implements API section 2.3
    // User has confirmed this is the correct patent. So persist it
					// would like to use:	(@RequestBody PatentUI patentUI) {
	@RequestMapping(value = "/rest-patents/", method = RequestMethod.POST) 
	public ResponseEntity<List<PatentUI>> savePatent(@RequestBody Object obby) {
		log().debug("PatentRestController : /rest-patents/ savePatent() invoked ");
		List<PatentUI> patentUIs = null;
		System.out.println("PatentRestController : /rest-patents/ savePatent() invoked ");
		try {
			System.out.println("PatentRestController : /rest-patents/ [POST] invoked - i.e. ADD Patent");
	
			PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
			
			Patent newPatent = new Patent();
			ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
	
			Patent patent = data.extractPatentFromAddPatentForm(obby); 
			//calculate the extended data again
			
			log().info("A patent with application number[" + patent.getEP_ApplicationNumber() +"] having a status as " + patent.getEpoPatentStatus() + " being added");
		   	//patent.persist();
			newPatent = patent.persist();
			
			List<NotificationMapping> mappings = data.extractNotificationsFromAddPatentForm(newPatent, obby);
			
			for(NotificationMapping eachMapping : mappings){
				eachMapping.persist();
			}
		   	
			if(!(newPatent == null)){
				log().debug("PatentRestController : /rest-patents/ savePatent() completed.");
				log().info("A patent with application number[" + patent.getEP_ApplicationNumber() +"] being added by USER [user id:" + postSession.getUser().getId() +"]" );
			}
			//return ResponseEntity.ok().build();
			else{
				log().debug("PatentRestController : /rest-patents/ savePatent() failed.");
				log().fatal("PatentRestController : /rest-patents/ savePatent() failed for patent " + patent);
			}
			
			patentUIs = patentService.persistAndCalculateFee(patent);
	  		
		   	
		   	
		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
		

   }

	

	
    //------------------- Update a Patent --------------------------------------------------------
	
    // Implements API section 2.4
    // Update Patent: Customer is permitted to change 3 things: shortTitle, clientRef and which Notifications
	//
	// Note !
	// The patentUI parameter MAY be provided as a PatentUI, or more likely a LinkedHashMap, so, here, accept either
	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.PUT) 
	public ResponseEntity<PatentUI> updatePatent(@PathVariable("id") long id, @RequestBody Object untypedPatentUI) {
		
		log().debug("PatentRestController : /rest-patents/ updatePatent() [tolerant] invoked   -  untypedPppp  ");

		PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
		if (untypedPatentUI!=null) log().debug("  param untypedPatentUI is of type " + untypedPatentUI.getClass().getName());
		
		log().info("UPDATE patent[" + id +"] request from USER [id:" + postSession.getUser().getId() +"]");
		try {
			Patent existingPatent = patentService.findById(id);
			if (existingPatent == null) {
				System.out.println("Unable to update. Patent with id " + id + " not found");
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
    
	
	
	
	
	//------------------- Delete a Patent --------------------------------------------------------

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
				log().debug("User tries to delete a patent with an ongoing payment. Aborted it");
				 return new ResponseEntity<Patent>(HttpStatus.NOT_MODIFIED);  //Pat to display error message on the page based on this value
			}
			
			TypedQuery<Renewal> q = Renewal.findRenewalsByPatent(deletePatent);
	    	List<Renewal> renewals = q.getResultList();
	    	if(!(renewals.isEmpty())){
	    		log().debug("User tries to delete a patent with a past Renewal being made via P3S. Aborted it");
				 return new ResponseEntity<Patent>(HttpStatus.NOT_MODIFIED);  //Pat to display error message on the page based on this value
	    	}
			
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
		    	System.out.println("PatentRestController : /rest-fxrate/ invoked ");

		    	FxRateCurrentUI fxRateCurrentUI = patentService.getCurrentFxRate();
		    	
		        return new ResponseEntity<FxRateCurrentUI>(fxRateCurrentUI, HttpStatus.OK);
		    }
			

		    // Implements API section 2.9
		    @RequestMapping(value = "/rest-fxrates/{period}", method = RequestMethod.GET)
		    public ResponseEntity<List<FxRateUI>> getFxRate(@PathVariable("period") String period) {
		    	System.out.println("PatentRestController : /rest-fxrates/"+period+" invoked ");

				List<FxRateUI> history = patentService.getFxRateHistory(period);
		    	
		        return new ResponseEntity<List<FxRateUI>>(history, HttpStatus.OK);
		    }
			
		

	//-------------------- Fetch Cost Analysis Data ----------------------------------------------
		  @RequestMapping(value = "/rest-cost-analysis/{id}", method = RequestMethod.GET)    
		    public ResponseEntity<CostAnalysisData> getCAData(@PathVariable("id") long id) {
		    	
		    	log().debug("PatentRestController : /rest-cost-analysis/ invoked ");
		    	//check whether id is null
		    	CostAnalysisData costAnalysisData = patentService.getCostAnalysisData(id);
		    	return new ResponseEntity<CostAnalysisData>(costAnalysisData, HttpStatus.OK);
		    }
		    
		    
	//---------------------Fetch Renewal History ------------------------------------------------
		    @RequestMapping(value = "/rest-renewal-history/{id}", method = RequestMethod.GET)    
		    public ResponseEntity<List<RenewalUI>> getRenewalHistory(@PathVariable("id") long id) {
		    	log().debug("PatentRestController : /rest-renewal-history/ invoked ");
		    	//check whether id is null
		    	List<RenewalUI> renewalHistoryData = patentService.getRenewalHistory(id);
		    	return new ResponseEntity<List<RenewalUI>>(renewalHistoryData, HttpStatus.OK);
		    }
	
	//------------------- next ... a Patent : ARE THERE ANY MORE ???  --------------------------------------------------------
	

}