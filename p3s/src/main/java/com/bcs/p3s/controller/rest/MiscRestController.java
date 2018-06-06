
package com.bcs.p3s.controller.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;
import javax.xml.transform.TransformerException;

import org.junit.internal.runners.TestMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.display.PartnerDetailsUI;
/*import com.bcs.p3s.docs.PDFGenerators;
import com.bcs.p3s.docs.TestMethods;
import com.bcs.p3s.docs.pojo.BillToAddress;
import com.bcs.p3s.docs.pojo.Invoice;
import com.bcs.p3s.docs.pojo.PatentX;*/
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.MiscService;
import com.bcs.p3s.service.PaymentService;
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
	   LoginMessageUI loginMessages = new LoginMessageUI();
	   
	   PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
	   
	   loginMessages = miscService.findAllLoginMessagesForUser(postSession);
	   
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
		   miscService.suppressLoginMessages(suppressMessages, postSession.getUser());
		  
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

}
