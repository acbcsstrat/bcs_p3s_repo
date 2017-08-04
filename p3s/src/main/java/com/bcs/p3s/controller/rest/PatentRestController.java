package com.bcs.p3s.controller.rest;
 
import java.util.ArrayList;
import java.util.List;

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
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.engine.TemporaryProcessingEngine;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
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
    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) invoked ");

    	PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
    	//postSession = patentService.populateSessionBean();
    	List<PatentUI> patentUIs = patentService.listAllPatentUIsForMyBusiness();
    	
    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) ret Qty "+patentUIs.size());
    	
		log().debug("PatentRestController : /rest-patents/ listAllPatentUIsForBusiness() returning "+patentUIs.size()+" patents. "
				+ "Set PatentUI from patents data fetched from DB");
		
		
		log().debug("PatentRestController : /rest-patents/ getExtendedPatentData(patentUI) returning "+patentUIs.size()+" "
				+ "patents. Set extended fileds in PatentUI as well");
        return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
    }
 

    
    //------------------- Search EPO for a Patent - with view to - ADD that patent --------------------------------------------------
    
    // Implements API section 2.2
    // Search EPO for a patent match on the ApplicationNumber entered
	@RequestMapping(value = "/rest-search-patents/{patentApplicationNumber}", method = RequestMethod.GET) 
	public ResponseEntity<PatentUI> searchEpoForPatent(@PathVariable("patentApplicationNumber") String patentApplicationNumber) {
		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
		System.out.println("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
  	
		PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
	  	PatentUI patentUI = patentService.searchEpoForPatent(patentApplicationNumber,postSession);
	  	
	  	System.out.println("PatentRestController :  (searchEpoForPatent()) ret: dummy (PatentUI=null)"+ (patentUI==null));
	  	System.out.println("gash got "+  	patentApplicationNumber);
	  	
	  	
		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent("+patentApplicationNumber+") found match = "+(patentUI == null));
	  	if(patentUI == null) {
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else 
	  		return new ResponseEntity<PatentUI>(patentUI, HttpStatus.OK);
	}
   

	
	
	
    //------------------- User confirms this EPO retrieved Patent is the correct one - so add it to the list of patents --------------------------------------------------
    
    // Implements API section 2.3
    // User has confirmed this is the correct patent. So persist it
					// would like to use:	(@RequestBody PatentUI patentUI) {
	@RequestMapping(value = "/rest-patents/", method = RequestMethod.POST) 
	public ResponseEntity<Void> savePatent(@RequestBody Object obby) {
		log().debug("PatentRestController : /rest-patents/ savePatent() invoked ");
		System.out.println("PatentRestController : /rest-patents/ savePatent() invoked ");
		try {
			System.out.println("PatentRestController : /rest-patents/ [POST] invoked - i.e. ADD Patent");
	
			TemporaryProcessingEngine tmp = new TemporaryProcessingEngine();
	
			Patent patent = tmp.extractPatentFromAddPatentForm(obby); 
			
			
	  		System.out.println(" Persist new patent ");
		   	patent.persist();
		   	
		} catch (Exception e) {
			System.out.println("PatentRestController addPatent() SUFFERED WATCHDOG WRAPPER EXCEPTION ");
			System.out.println(e.getMessage());
			e.printStackTrace();
		}

  		System.out.println(" ");
  		System.out.println(" ");
  		System.out.println(" ");

  		
		log().debug("PatentRestController : /rest-patents/ savePatent() completed.");
		return ResponseEntity.ok().build();
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

		if (untypedPatentUI!=null) log().debug("  param untypedPatentUI is of type " + untypedPatentUI.getClass().getName());
		
		try {
			Patent existingPatent = patentService.findById(id);
			if (existingPatent == null) {
				System.out.println("Unable to update. Patent with id " + id + " not found");
			} else {
				patentService.flexibleUpdatePatent(id, untypedPatentUI);
			}
		
		} catch (Exception e) {
			System.out.println("PatentRestController updatePatent() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
		}

		
		Patent nowPersistedPatent = patentService.findById(id);
  		
	  	if(nowPersistedPatent == null) {
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else {
	  		PatentUI updatedPatentUI = new PatentUI(nowPersistedPatent);
	  		return new ResponseEntity<PatentUI>(updatedPatentUI, HttpStatus.OK);
	  	}
   }
    
	
	
	
	
	//------------------- Delete a Patent --------------------------------------------------------

    // Implements API section 2.5
    // User has confirmed this is the correct patent. So persist it
	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Patent> deletePatent(@PathVariable("id") long id) {
		log().debug("PatentRestController : /rest-patents/ deletePatent() invoked ");
	
	    patentService.deletePatentById(id);
	    return new ResponseEntity<Patent>(HttpStatus.NO_CONTENT);
	}
  
  
//formerly 
//    // Implements API section 2.5
//    // User has confirmed this is the correct patent. So persist it
//	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.DELETE)
//	public ResponseEntity<Patent> deletePatent(@PathVariable("id") long id) {
//		log().debug("PatentRestController : /rest-patents/ deletePatent() invoked ");
//	
//		Patent patent = patentService.findById(id);
//		if (patent == null) {
//			System.out.println("Unable to delete. Patent with id " + id + " not found");
//				return new ResponseEntity<Patent>(HttpStatus.NOT_FOUND);
//		    }
//		
//		    patentService.deletePatentById(id);
//		    return new ResponseEntity<Patent>(HttpStatus.NO_CONTENT);
//		}

  
    
    
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
		  @RequestMapping(value = "/rest-cost-analysis/{id}", method = RequestMethod.GET)    //will be the actual method
		    public ResponseEntity<CostAnalysisData> getCAData(@PathVariable("id") long id) {
		    //@RequestMapping(value = "/rest-cost-analysis/", method = RequestMethod.GET)
		    //public ResponseEntity<CostAnalysisData> getCAData() {
		    	
		    	log().debug("PatentRestController : /rest-cost-analysis/ invoked ");
		    	//check whether id is null
		    	CostAnalysisData costAnalysisData = patentService.getCostAnalysisData(id);
		    	//CostAnalysisData costAnalysisData = patentService.getCostAnalysisData(2);
		    	System.out.println("Inside Fetch CA data method");
		    	return new ResponseEntity<CostAnalysisData>(costAnalysisData, HttpStatus.OK);
		    }
		    
		    
		  //---------------------Fetch Renewal History ------------------------------------------------
		    //@RequestMapping(value = "/rest-renewal-history/{id}", method = RequestMethod.GET)    //will be the actual method
		    //public ResponseEntity<RenewalUI> getRenewalHistory(@PathVariable("id") long id) {
		    @RequestMapping(value = "/rest-renewal-history/", method = RequestMethod.GET)
		    public ResponseEntity<RenewalUI> getRenewalHistory() {
		    	log().debug("PatentRestController : /rest-renewal-history/ invoked ");
		    	//check whether id is null
		    	//RenewalUI renewalHistoryData = patentService.getRenewalHistory(id);
		    	RenewalUI renewalHistoryData = patentService.getRenewalHistory(1);
		    	return new ResponseEntity<RenewalUI>(renewalHistoryData, HttpStatus.OK);
		    }
	
	//------------------- next ... a Patent : ARE THERE ANY MORE ???  --------------------------------------------------------
	
	//------------------- next ... a Patent : ARE THERE ANY MORE ???  --------------------------------------------------------

    
    
    
    
//    //-------------------Retrieve Single Patent--------------------------------------------------------
	// Not required
}