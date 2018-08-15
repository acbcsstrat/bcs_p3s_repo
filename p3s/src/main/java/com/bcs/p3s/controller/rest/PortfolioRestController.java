/**
 * 
 */
package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.service.PortfolioService;
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
public class PortfolioRestController extends Universal{
	
	@Autowired
    PortfolioService portfolioService;
	
	//Implements API section 3.1 - Get all patents' details for Portfolio page
    @RequestMapping(value = "/rest-patents-portfolio/", method = RequestMethod.GET)
    public ResponseEntity<List<PortfolioUI>> listPatentsForPortfolio() {
    	
    	List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();
    	
    	try{
    		portfolioUIs = portfolioService.getPortfolioData();
    	}
    	catch(Exception e){
    		StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
    	}
    	
    	 return new ResponseEntity<List<PortfolioUI>>(portfolioUIs, HttpStatus.OK);
    	
    }

}
