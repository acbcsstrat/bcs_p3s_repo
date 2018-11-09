package com.bcs.p3s.controller.rest;


import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.Form1200SavedData;
import com.bcs.p3s.display.form1200.PageDescriptionEnum;
import com.bcs.p3s.display.form1200.PageDescriptionUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.service.Form1200Service;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

/**
 * Note :- A controller to have the rest methods for Portfolio page. 
 * 			Could be merged with PatentRestController in future
 * 
 * @author MerinP
 *
 */

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class Form1200RestController extends Universal {

	@Autowired
    Form1200Service form1200Service;

    @Autowired
    HttpSession session ;

    
    protected String PREFIX = this.getClass().getName() + " : "; 

	//Implements API section 2.1 - Start Form1200 data entry
	// i.e. when user CHOOSES to start the Form1200 questionairre
    @RequestMapping(value = "/rest-start-form1200/{id}", method = RequestMethod.GET)
    public ResponseEntity<StartForm1200Api21UI> startForm1200(@PathVariable("id") long id) {
    	
		log().debug(PREFIX+"/rest-start-form1200/"+id+" startForm1200()");

		StartForm1200Api21UI startForm1200Api21UI = null;
		try {
			startForm1200Api21UI = form1200Service.getForm1200QuestionData(id);
		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("startForm1200 Stacktrace was: "+errors.toString());
		}
  		
	  	if(startForm1200Api21UI==null) {
			log().debug(PREFIX+"/rest-start-form1200/ completed UNsuccessfully");
	  		return new ResponseEntity<StartForm1200Api21UI>(HttpStatus.NOT_FOUND); // =404 //You many decide to return HttpStatus.NO_CONTENT
	  	}
	  	else {
			log().debug(PREFIX+"/rest-start-form1200/ completed successfully");
	  		return new ResponseEntity<StartForm1200Api21UI>(startForm1200Api21UI, HttpStatus.OK);
	  	}

    }


    // this is TMP for invoking from tmpGenF1200.html - in absence of FE code
	// hence params are simple form params - no the onjects that the FE will send
    @RequestMapping(value = "/rest-form1200-tmpGenF1200/", method = RequestMethod.POST)
    public ResponseEntity<Form1200SavedData> generateForm1200tmpGenF1200(
    			  @RequestParam("Patent_ID") long  patentId
	    		, @RequestParam("clientRef") String clientRef 
	    		, @RequestParam("totalClaims") long totalClaims
	    		, @RequestParam(value = "isYear3RenewalPaying", required = false) boolean isYear3RenewalPaying  
	    		, @RequestParam("totalPages") long totalPages  
//	    		, @RequestParam("") Object extensionStatesUI   
//	    		, @RequestParam("") Object validationStatesUI
//	    		, @RequestParam("") Object pageDescriptionUI

	    	// accept 2+6 strings
	    		, @RequestParam("extsnStatesCSV") String extsnStatesCSV
	    		, @RequestParam("validStatesCSV") String validStatesCSV
	    		, @RequestParam("descStart") String descStart
	    		, @RequestParam("descEnd") String descEnd
	    		, @RequestParam("claimsStart") String claimsStart
	    		, @RequestParam("claimsEnd") String claimsEnd
	    		, @RequestParam("drgsStart") String drgsStart
	    		, @RequestParam("drgsEnd") String drgsEnd
    		) {
    	// Note isYear3RenewalPaying is marked optional NOT because the question is conditional, but because HTML form doesn't send unchecked checkboxes

		log().debug(PREFIX+"/rest-form1200-tmpGenF1200/ generateForm1200tmpGenF1200() invoked");

		log().debug("str 1 is "+patentId);
		log().debug("str 2 is "+clientRef);
		log().debug("str 3 is "+ totalClaims );
		log().debug("str 4 is "+  isYear3RenewalPaying);
		log().debug("str 5 is "+  totalPages);
		log().debug("extsnStatesCSV is "+  extsnStatesCSV);
		log().debug("validStatesCSV is "+  validStatesCSV);
		log().debug("desc <> is "+  descStart+ ", "+descEnd);
		log().debug("clms <> is "+  claimsStart+ ", "+claimsEnd);
		log().debug("drgs <> is "+  drgsStart+ ", "+drgsEnd);
    	

		
		log().debug(CLASSNAME+"/rest-patents/ generateForm1200() invoked. ");
		
		Form1200SavedData form1200SavedData = null;
		try{
			// do stuff

			List<ExtensionStateUI> extensionStatesUI = null; 
			List<ValidationStateUI> validationStatesUI = null;
			List<PageDescriptionUI> pageDescriptionUI = new ArrayList<PageDescriptionUI>();

			DummyForm1200Engine dummy = new DummyForm1200Engine();
			extensionStatesUI = dummy.listStrStates2ExtnsStates(dummy.csStings2ist(extsnStatesCSV));
			validationStatesUI = dummy.listStrStates2ValidStates(dummy.csStings2ist(validStatesCSV));
			
			PageDescriptionUI aPageDescriptionUI = null;
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Description, descStart, descEnd);
			pageDescriptionUI.add(aPageDescriptionUI);
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Claims, claimsStart, claimsEnd);
			pageDescriptionUI.add(aPageDescriptionUI);
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Drawings, drgsStart, drgsEnd);
			pageDescriptionUI.add(aPageDescriptionUI);
			
			// whoami
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			P3SUser me = pLoginSession.getUser();
			
			// EoW 181026 - got to here
			
			// make the service call - with many params
			form1200SavedData = form1200Service.saveNewForm1200details(
									patentId, clientRef, totalClaims, isYear3RenewalPaying, totalPages, 
									extensionStatesUI, validationStatesUI, pageDescriptionUI, me);

			
			
			
			log().debug(PREFIX+"/rest-form1200-tmpGenF1200/ generateForm1200tmpGenF1200() returning ...");
		}
		catch(Exception e) {
			logErrorAndContinue(CLASSNAME+"/rest-patents/ generateForm1200() suffered exception",e);
			return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.OK);
    }



    
    

    
	//Implements API section 2.2 - Generate & Save FORM1200
	// i.e. when user has completed entering the f1200 quetions
    @RequestMapping(value = "/rest-form1200/", method = RequestMethod.POST)
    public ResponseEntity<Form1200SavedData> generateForm1200(@RequestBody Object obby) {

		log().debug(PREFIX+"/form1200/ generateForm1200() invoked");


		Form1200SavedData form1200SavedData = null;
		try {
		
		
			// Here - don't know what format data arriving will have. Best guidance from path is something like
	//		ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
	//		Patent patent = data.extractPatentFromAddPatentForm(obby); 
			// so proceed cautiously
	
			log().debug("(obby==null) = "+(obby==null));
			if (obby==null) fut("isNull"); else {
				log().debug("object is of type  "+obby.getClass().getName());
				log().debug("object is of type  "+obby.getClass().getName());
				log().debug("hoping for : LinkedHashMap<String, Object>)");
	
				
				// Declare the items to be received
				long  patentId;
				String clientRef; 
				long totalClaims;
				boolean isYear3RenewalPaying = false; 
				long totalPages;
				List<ExtensionStateUI> extensionStatesUI = null; 
				List<ValidationStateUI> validationStatesUI = null;
				List<PageDescriptionUI> pageDescriptionUI = null;
				
				
				
				
				
				if ( ! (obby instanceof LinkedHashMap<?,?>)) fut("AINT LinkedHashMap<String, Object>"); else {
					log().debug("Attempting cast to LinkedHashMap<String, Object>");
					LinkedHashMap<String, Object> newHashMap = (LinkedHashMap<String, Object>) obby;
					log().debug("still alive after cast");
	
					log().debug("First LIST all elements - then attempt extarct");
					log().debug("so LIST ...");
					for (String str : newHashMap.keySet()) {
						log().debug("   ... item ... = "+str);
						log().debug("                                of type: "+str.getClass().getName());
						
					}
	
					log().debug("  ...  \n\n\n\n ...");
					log().debug("Now attempt process - loop EACH - attempt id in turn");
	
					Object ob;
					for (String thisElement : newHashMap.keySet()) {
						log().debug("   ... item ... = "+thisElement);
					
						ob = newHashMap.get(thisElement);
						
						switch (thisElement) {
							case "Patent_ID":	tellOb(ob);
												patentId = (Long) ob;
												break;
	
							case "clientRef":	tellOb(ob);
												clientRef = (String) ob;
												break;
	
							case "totalClaims":	tellOb(ob);
												totalClaims= (Long) ob;
												break;
	
							case "isYear3RenewalPaying":	tellOb(ob);
												isYear3RenewalPaying= (Boolean) ob;
												break;
	
							case "totalPages":	tellOb(ob);
												totalPages= (Long) ob;
												break;
	
							case "extensionStatesUI":	tellOb(ob);
												if (ob instanceof List<?>) {
													// hooray
													log().debug("hooray (i hope)");
													extensionStatesUI = (List<ExtensionStateUI>) ob;
												} else {
													log().debug("more work ..");
													if ( ! (ob instanceof List<?>) ) { 
														log().debug("ho hum - LIST the list");
														for (Object oo : (List<Object>) ob) {
															if (oo instanceof String) log().debug("this list item string is "+ (String) oo);
															else log().debug("ob tostring yields : "+ob.toString());
														}
													}
													else if ( ! (ob instanceof LinkedHashMap<?,?>) ) { fut("extensionStatesUI : oh dear ..."); } else {
														log().debug("Heavens! - what would the keys be");
														LinkedHashMap<String,Object> arhggg = ( LinkedHashMap<String,Object>) ob;
														//Set<String> oKey = arhggg.keySet();
														for (String ooKey : arhggg.keySet()) {
															log().debug("    heavenly key is : "+ ooKey);
														}
													}
												}
												log().debug("  If by wildest strect of imaginination - still alive here .. leave this item & move on");
												break;
	
							case "validationStatesUI":	tellOb(ob);
														log().debug("validationStatesUI - not gonna bother HERE");
														break;
												
							case "pageDescriptionUI":	tellOb(ob);
												log().debug("pageDescriptionUI - is crude copy of extensionStatesUI");
	
												if (ob instanceof List<?>) {
													// hooray
													log().debug("hooray (i hope)");
													extensionStatesUI = (List<ExtensionStateUI>) ob;
												} else {
													log().debug("more work ..");
													if ( ! (ob instanceof List<?>) ) { 
														log().debug("ho hum - LIST the list");
														for (Object oo : (List<Object>) ob) {
															if (oo instanceof String) log().debug("this list item string is "+ (String) oo);
															else log().debug("ob tostring yields : "+ob.toString());
														}
													}
													else if ( ! (ob instanceof LinkedHashMap<?,?>) ) { fut("extensionStatesUI : oh dear ..."); } else {
														log().debug("Heavens! - what would the keys be");
														LinkedHashMap<String,Object> arhggg = ( LinkedHashMap<String,Object>) ob;
														//Set<String> oKey = arhggg.keySet();
														for (String ooKey : arhggg.keySet()) {
															log().debug("    heavenly key is : "+ ooKey);
														}
													}
												}
												log().debug("  If by wildest strect of imaginination - still alive here .. leave this item & move on");
												break;
	
	
												
							default: 	fut("Switch statement hit default !!!");
										tellOb(ob);
							            break;
						}
				}
	
				int ii = 7;
									
				
			}
		}			
					
					
					
					
	//			    public ResponseEntity<Object> generateForm1200tmpGenF1200(
	//		    			  @RequestParam("Patent_ID") long  patentId
	//			    		, @RequestParam("clientRef") String clientRef 
	//			    		, @RequestParam("totalClaims") long totalClaims
	//			    		, @RequestParam(value = "isYear3RenewalPaying", required = false) boolean isYear3RenewalPaying  
	//			    		, @RequestParam("totalPages") long totalPages  
	////			    		, @RequestParam("") Object extensionStatesUI   
	////			    		, @RequestParam("") Object validationStatesUI
	////			    		, @RequestParam("") Object pageDescriptionUI
	//
	//			    	// accept 2+6 strings
	//			    		, @RequestParam("extsnStatesCSV") String extsnStatesCSV
	//			    		, @RequestParam("validStatesCSV") String validStatesCSV
	//			    		, @RequestParam("descStart") String descStart
	//			    		, @RequestParam("descEnd") String descEnd
	//			    		, @RequestParam("claimsStart") String claimsStart
	//			    		, @RequestParam("claimsEnd") String claimsEnd
	//			    		, @RequestParam("drgsStart") String drgsStart
	//			    		, @RequestParam("drgsEnd") String drgsEnd
	//		    		) {
	//		    	// Note isYear3RenewalPaying is marked optional NOT because the question is conditional, but because HTML form doesn't send unchecked checkboxes
	//
	//				log().debug(PREFIX+"/rest-form1200-tmpGenF1200/ generateForm1200tmpGenF1200() invoked");
	
					
					
					
					
					
					
					
					
				
				
			
			
			
	//		log().debug("str 1 is "+patentId);
	//		log().debug("str 2 is "+clientRef);
	//		log().debug("str 3 is "+ totalClaims );
	//		log().debug("str 4 is "+  isYear3RenewalPaying);
	//		log().debug("str 5 is "+  totalPages);
	//		log().debug("extsnStatesCSV is "+  extsnStatesCSV);
	//		log().debug("validStatesCSV is "+  validStatesCSV);
	//		log().debug("desc <> is "+  descStart+ ", "+descEnd);
	//		log().debug("clms <> is "+  claimsStart+ ", "+claimsEnd);
	//		log().debug("drgs <> is "+  drgsStart+ ", "+drgsEnd);
	//    	
	//
	//		
	//		log().debug(CLASSNAME+"/rest-patents/ generateForm1200() invoked. ");
	//		
	//		try{
	//			// do stuff
	//
	//			List<ExtensionStatesUI> extensionStatesUI = null; 
	//			List<ValidationStatesUI> validationStatesUI = null;
	//			List<PageDescriptionUI> pageDescriptionUI = new ArrayList<PageDescriptionUI>();
	//
	//			DummyForm1200Engine dummy = new DummyForm1200Engine();
	//			extensionStatesUI = dummy.listStrStates2ExtnsStates(dummy.csStings2ist(extsnStatesCSV));
	//			validationStatesUI = dummy.listStrStates2ValidStates(dummy.csStings2ist(validStatesCSV));
	//			
	//			PageDescriptionUI aPageDescriptionUI = null;
	//			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Description, descStart, descEnd);
	//			pageDescriptionUI.add(aPageDescriptionUI);
	//			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Claims, claimsStart, claimsEnd);
	//			pageDescriptionUI.add(aPageDescriptionUI);
	//			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Drawings, drgsStart, drgsEnd);
	//			pageDescriptionUI.add(aPageDescriptionUI);
	//			
	//
	//			// EoW 181026 - got to here
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			log().debug(CLASSNAME+"/rest-patents/ generateForm1200()   returning ...");
	//		}
	//		catch(Exception e){
	//			logErrorAndContinue(CLASSNAME+"/rest-patents/ generateForm1200() suffered exception",e);
	//			return new ResponseEntity<Object>("summat", HttpStatus.INTERNAL_SERVER_ERROR);
	//		}
	
			log().debug(CLASSNAME+"/rest-patents/ generateForm1200()   returning ...");
		}
		catch(Exception e) {
			logErrorAndContinue(CLASSNAME+"/rest-patents/ generateForm1200() suffered exception",e);
			return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.OK);
	}


	//Implements API v2.1 section 2.3 - Delete FORM1200 application
    @RequestMapping(value = "/rest-form1200/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteForm1200(@PathVariable("id") long id) {
    	
		String err = PREFIX+"/form1200/"+id+" DELETE deleteForm1200() : ";
		log().debug(err+"invoked");

		try {
			form1200Service.deleteCurrentForm1200Data(id);
		} catch (Exception e) {
			logErrorAndContinue(err+"",e);
	  		return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR ); // Alternatives: NO_CONTENT, NOT_FOUND, BAD_REQUEST. METHOD_FAILURE
		}

		log().debug(err+"completed.");
	  	return new ResponseEntity<Object>(HttpStatus.OK);
    }


	//Implements API v2.1 section 2.5 - Reject FORM1200 application
    @RequestMapping(value="/rest-reject-form1200/{patent_id},{fail_reason}", method = RequestMethod.GET)
    public ResponseEntity<Form1200Record> rejectForm1200(@PathVariable long patent_id, @PathVariable String fail_reason){
    	// Usage: User is entering question answers, and has entered 1 of the 3 Rejectable answers.
    	// Immediately update Patent, and possibly Epct, records as appropriate.
    	// Removes risk: Existing Epct. User has told us is not valid. If we don't immediately persist this, we are at risk of .
    	
		String err = PREFIX+"/rest-reject-form1200/"+patent_id+", "+fail_reason+"  REJECT rejectForm1200() : ";
		log().debug(err+"invoked");

		try {
			form1200Service.rejectCurrentForm1200(patent_id,fail_reason);
		} catch (Exception e) {
			logErrorAndContinue(err+"",e);
	  		return new ResponseEntity<Form1200Record>(HttpStatus.INTERNAL_SERVER_ERROR ); //Alternatives: NO_CONTENT, NOT_FOUND, BAD_REQUEST. METHOD_FAILURE
		}

		log().debug(err+"completed.");
	  	return new ResponseEntity<Form1200Record>(HttpStatus.OK);
    }



    
    
    
    
    
	protected void fut(String msg) {
		log().error("So this IS AS FAR AS WE ARE GETTING ");
		log().error("************************************************************************************************");
	}
	protected void tellOb(Object o) {
		log().error("");
		log().error("(ob==null) = "+(o==null));
		log().error("o.getClass().getName() = "+o.getClass().getName());
		log().error("");
	}
    
}
