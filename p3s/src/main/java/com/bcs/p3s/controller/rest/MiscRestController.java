
package com.bcs.p3s.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.util.lang.Universal;

/**
 * Miscellaneous REST Controller that accepts any generic request/s
 * @author MerinP
 *
 */

@RestController
public class MiscRestController extends Universal{
	
	//-----------------------------ACCEPT HEARBEAT SEND IN EVERY 20 SEC--------------------------------------
    
    @RequestMapping(value = "/keep-session-alive/", method = RequestMethod.GET)
    public void keepSessionAlive() {
    	String msg = "keepSessionAlive()";
    	log().debug(msg +" invoked for keeping session alive. HEARBEAT SEND FROM FRONT END.SUCCES");
    }


    //------------------------------LOADING ALL SYSTEM MESSAGES--------------------------------------------
    
    //------------------------------SUPPRESS ONE/MANY SYSTEM MESSAGES
}
