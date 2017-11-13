
package com.bcs.p3s.controller.rest;

import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.service.MiscService;
import com.bcs.p3s.service.PaymentService;
import com.bcs.p3s.session.PostLoginSessionBean;
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
   public void suppressLoginMessages(@RequestBody Object obby){
	   
	   String msg = "suppressLoginMessages()";
	   log().debug(msg +" invoked :::");
	   
	   if (!(obby instanceof LinkedHashMap<?, ?>)) throw new P3SRuntimeException("MiscRestController : /login-messages/ suppressLoginMessages() NOT passed String");
	   
	   ExtractSubmittedDataEngine extractor = new ExtractSubmittedDataEngine();
	   List<Long> suppressMessages = extractor.commaSeparatedListOfIntegerNumbersStrToListLongs((LinkedHashMap<String,Object>) obby);
	   
	   miscService.suppressLoginMessages(suppressMessages);
	   
   }
}
