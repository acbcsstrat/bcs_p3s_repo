package com.bcs.p3s.controller.rest;
 
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.engine.TemporaryProcessingEngine;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class PatentRestController extends Universal {
 
    @Autowired
    PatentService patentService;  //Service which will do all data retrieval/manipulation work
 
    
    //------------------- Retrieve All Patents (For this Business) --------------------------------------------------
     
    // Implements API section 2.1 - Get all patents for this business
    @RequestMapping(value = "/rest-patents/", method = RequestMethod.GET)
    public ResponseEntity<List<PatentUI>> listAllPatentUIsForBusiness() {
		log().debug("PatentRestController : /rest-patents/ listAllPatentUIsForBusiness() invoked.");
    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) invoked ");

    	List<PatentUI> patentUIs = patentService.listAllPatentUIsForMyBusiness();
    	
    	System.out.println("PatentRestController : /rest-patents/ (get All Patents for Business) ret Qty "+patentUIs.size());

    	
    	
    	
    	
    	
		log().debug("PatentRestController : /rest-patents/ listAllPatentUIsForBusiness() returning "+patentUIs.size()+" patents.");
    	
        return new ResponseEntity<List<PatentUI>>(patentUIs, HttpStatus.OK);
    }
 

    
    //------------------- Search EPO for a Patent - with view to - ADD that patent --------------------------------------------------
    
    // Implements API section 2.2
    // Search EPO for a patent match on the ApplicationNumber entered
	@RequestMapping(value = "/rest-search-patents/{patentApplicationNumber}", method = RequestMethod.GET) 
	public ResponseEntity<PatentUI> searchEpoForPatent(@PathVariable("patentApplicationNumber") String patentApplicationNumber) {
		log().debug("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
		System.out.println("PatentRestController : /rest-search-patents/ searchEpoForPatent() invoked with param: "+patentApplicationNumber);
  	
	  	PatentUI patentUI = patentService.searchEpoForPatent(patentApplicationNumber);
	  	
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

	// Cannot PROVE this yet - ASSUME can get a PatentUI, & not the linked list ...

	@RequestMapping(value = "/rest-patents/{id}", method = RequestMethod.PUT) 
	public ResponseEntity<PatentUI> updatePatent(@PathVariable("id") long id, @RequestBody PatentUI patentUI) {
		
		log().debug("PatentRestController : /rest-patents/ updatePatent() invoked ");
		Patent updatedPatent = null;
		try {
			System.out.println("PatentRestController : /rest-patents/ [PUT] invoked - i.e. UPDATE Patent");
	
			Patent existingPatent = patentService.findById(id);
			if (existingPatent == null) {
				System.out.println("Unable to update. Patent with id " + id + " not found");
			} else {
				updatedPatent = patentService.updatePatent(id, patentUI);
			}

		
		
		
		} catch (Exception e) {
			System.out.println("PatentRestController updatePatent() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
		}

  		System.out.println(" ");
  		System.out.println(" ");
  		System.out.println(" ");

  		
  		
		log().debug("PatentRestController : /rest-patents/ updatePatent() completed.");
	  	if(updatedPatent == null) {
	  		return new ResponseEntity<PatentUI>(HttpStatus.NOT_FOUND); //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else {
	  		PatentUI updatedPatentUI = new PatentUI(updatedPatent);
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
    public ResponseEntity<FxRateUI> getFxRate() {
    	System.out.println("PatentRestController : /rest-fxrate/ invoked ");

    	FxRateUI fxRateUI = patentService.getFxRate();
    	
        return new ResponseEntity<FxRateUI>(fxRateUI, HttpStatus.OK);
    }
  

	
	//------------------- next ... a Patent : ARE THERE ANY MORE ???  --------------------------------------------------------

    
    
    
    
//    //-------------------Retrieve Single Patent--------------------------------------------------------
	// Not required
}