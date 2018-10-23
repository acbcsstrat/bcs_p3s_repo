package com.bcs.p3s.controller.rest;


import java.io.PrintWriter;
import java.io.StringWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.service.Form1200Service;
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


}
