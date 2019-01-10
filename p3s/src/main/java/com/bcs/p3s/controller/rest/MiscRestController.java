
package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.display.PartnerDetailsUI;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
//import com.bcs.p3s.scrape.model.Claims;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.service.MiscService;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;


/**
 * Miscellaneous REST Controller that accepts any generic request/s
 * @author MerinP
 *
 */

@RestController
public class MiscRestController extends Universal{
	
	@Autowired
    HttpSession session ;
	
	@Autowired
	MiscService miscService;  
	//-----------------------------ACCEPT HEARBEAT SEND IN EVERY 20 SEC--------------------------------------
    
    @RequestMapping(value = "/keep-session-alive/", method = RequestMethod.GET)
    public void keepSessionAlive() {
    	String msg = "keepSessionAlive()";
    	log().debug(msg +" invoked for keeping session alive. HEARBEAT SEND FROM FRONT END.SUCCES");
    }


    //------------------------------LOADING ALL SYSTEM MESSAGES--------------------------------------------
    
   @RequestMapping(value="/login-messages/", method = RequestMethod.GET)
   public ResponseEntity<LoginMessageUI> getAllLoginMessages(){
	   
	   String msg = "getAllLoginMessages()";
	   log().debug(msg +" invoked :::");
	   
	   PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");

	   // Create Greppable *login* message to record logins (our best ability to record logins is this call)
	   P3SUser user = postSession.getUser(); 
	   if (user==null) {
		   logErrorAndContinue("User is null. Cannot record logins. From  "+msg+"                             *login* ");
	   }
	   else
	   {
		   Business business= user.getBusiness();
		   log().info("   ***** UserId "+user.getId()+" ["+user.getFirstName()+" "+user.getLastName()+"] has logged in. "
		   + "BusinessId "+business.getId()+" ["+business.getBusinessName()+"]"+"                             *login* ");
		   // Yields: 2019-01-08 10:03:56,954 INFO  STANDARD -    ***** UserId 5 [Andy Chapman] has logged in. BusinessId 35 [BoxClever Software]                             *login*   :: com.bcs.p3s.controller.rest.MiscRestController.getAllLoginMessages(MiscRestController.java:77)
		   // use: alias logins='lg=/p3slogs/p3sweb_STANDARD_log.log;grep "*login*" ${lg}.6 ${lg}.5 ${lg}.4 ${lg}.3 ${lg}.2 ${lg}.1 ${lg} | cut -b-180 '
	   }

	   
	   //LoginMessageUI loginMessages = new LoginMessageUI();
	   LoginMessageUI loginMessages = miscService.findAllLoginMessagesForUser(postSession);
	   
	   return new ResponseEntity<LoginMessageUI>(loginMessages, HttpStatus.OK);
   }
    
    //------------------------------SUPPRESS ONE/MANY SYSTEM MESSAGES----------------------------------------
   @RequestMapping(value="/suppress-login-messages/", method = RequestMethod.POST)
   public void suppressLoginMessages(@RequestBody Object id){
   //public void suppressLoginMessages(@PathVariable Object id){ 
	   LoginMessageUI loginMessages = new LoginMessageUI();
	   String msg = "suppressLoginMessages()";
	   log().debug(msg +" invoked :::");
	   try{
		   System.out.println("Params obtained as "+ id);
		   if (!(id instanceof ArrayList)) throw new P3SRuntimeException("MiscRestController : /suppress-login-messages/ suppressLoginMessages() NOT passed ArrayList of ids");
		   
		   ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
		   List<Long> suppressMessages = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs((ArrayList<String>) id);
	   
		   PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
		   if(postSession.getUser() == null){
			   log().error("User info in session is null");
			   return;
		   }
		   miscService.suppressLoginMessages(suppressMessages, postSession);
		  
	   }
	   catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
	   }
	   
   }


   //------------------------------PROVIDE PARTNER COMPANY DETAILS --------------------------------------------
   
  @RequestMapping(value="/partner-details/", method = RequestMethod.GET)
  public ResponseEntity<PartnerDetailsUI> getPartnerDetails(){
	   
	   String err = "getPartnerDetails() ";
	   log().debug(err +" invoked :::");

	   String name;
	   String phone;
	   PartnerDetailsUI partnerDets = null;
	   
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			name = reader.getGenericProperty(P3SPropertyNames.PARTNER_COMPANY_NAME);
			phone = reader.getGenericProperty(P3SPropertyNames.PARTNER_COMPANY_PHONE);

			partnerDets = new PartnerDetailsUI(name, phone);
			log().debug(err +" completed. Provides :"+partnerDets.getPartnerName()+", "+partnerDets.getPartnerPhone());
		} catch (P3SPropertyException e) {
			fail(err+"property read failed",e);
		}
		
	   return new ResponseEntity<PartnerDetailsUI>(partnerDets, HttpStatus.OK);
  }
   
   
  //------------------------------ --------------------------------------------
  
//------------ Below are the scraping methods for FORM1200 -----------

//  AC 16/10/2018 Summer2018: Claims scraping not sufficiently reliable for automated use.
//  Currently not required. So comment out - but don't remove - this call
//  & leave the code below it active, Likely useful in futire
//  /**
//   * Single request to get all claims for the patent
//   * @param patentPublicationNumber
//   * @return String[] of claims
//   */
//  @RequestMapping(value="/patent-claims/{patentPublicationNumber:.+}", method = RequestMethod.GET)
//  public ResponseEntity<Claims> getPatentClaims(@PathVariable("patentPublicationNumber") String patentPublicationNumber){
//	  
//	  Claims claims = new Claims();
//	  
//	  claims = miscService.getClaims(patentPublicationNumber);
//	  return new ResponseEntity<Claims>(claims, HttpStatus.OK);
//  }
  
  /**
   * Request that encapsulates all EPO data required for Form1200
   * @param patentApplicationNumber
   * @return Form1200Record object
   */
  @RequestMapping(value="/rest-form1200/{patentApplicationNumber:.+}", method = RequestMethod.GET)
  public ResponseEntity<Form1200Record> getPatentDetailsForForm1200(@PathVariable("patentApplicationNumber") String patentApplicationNumber){
	  
	  String msg = "getPatentDetailsForForm1200("+patentApplicationNumber+")";
	  
	  
	  
	  logAttention("SEEMINGLY UNUSED call has been invoked - see below");
	  log().fatal("This call seems redundant. Not in v2.1 API - is it EVER invoked? - "+CLASSNAME+" : "+msg);
	  log().fatal("*********************************************************************************************");
	  log().fatal("*********************************************************************************************");
	  log().fatal("*********************************************************************************************");
	  log().fatal("*********************************************************************************************");
	  log().fatal("*********************************************************************************************");
	  log().fatal("*********************************************************************************************");
	  
	  
	  
	  
	  Form1200Record form1200 = new Form1200Record();
	  log().debug(msg +" invoked");
	  
	  try{
		  form1200 = miscService.readEPOForForm1200(patentApplicationNumber);
		  
		  if(form1200 == null)
			  log().warn(msg +" returning no data for form1200");
		  else
			  log().info(msg +" returning form1200 data");
	  }
	  catch(Exception e){
		  
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		log().error("Stacktrace was: "+errors.toString());
	  }
	  
	  return new ResponseEntity<Form1200Record>(form1200, HttpStatus.OK);
  }

  
//  AC 16/10/2018 Abstract currently not required. So comment out - but don't remove - this call
//  & leave the code below it active, Likely useful in futire
//  /**
//   * Single request to get the Abstract text for the patent in English
//   * @param patentPublicationNumber
//   * @return String 
//   */
//  @RequestMapping(value="/patent-abstract/{patentPublicationNumber:.+}", method = RequestMethod.GET)
//  public ResponseEntity<String> getPatentAbstract(@PathVariable("patentPublicationNumber") String patentPublicationNumber){
//	  
//	  String abstractTxt = null;
//	  
//	  abstractTxt = miscService.readAbstract(patentPublicationNumber);
//	  return new ResponseEntity<String>(abstractTxt, HttpStatus.OK);
//  }

}
