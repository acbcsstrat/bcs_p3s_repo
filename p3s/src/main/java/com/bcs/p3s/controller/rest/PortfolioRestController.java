/**
 * 
 */
package com.bcs.p3s.controller.rest;

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
import com.bcs.p3s.engine.DummyForm1200Engine;
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
public class PortfolioRestController extends Universal {
	
	@Autowired
    PortfolioService portfolioService;
	
	// Oct2018 : TEMPORARILY provide a similar method that returns hardcoded example data
    @RequestMapping(value = "/rest-patents-portfolio-HARDCODED/", method = RequestMethod.GET)
    public ResponseEntity<List<PortfolioUI>> listHardcodedPatentsForPortfolio() {
    	log().debug(CLASSNAME+"listHardcodedPatentsForPortfolio() invoked");
    	
    	List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();
    	try{
        	DummyForm1200Engine dummyEngine = new DummyForm1200Engine();
        	portfolioUIs = dummyEngine.getDummyDataForPortfolio();
    	}
    	catch(Exception e){
    		logErrorAndContinue(CLASSNAME+"listPatentsForPortfolio() suffered exception",e);
    		return new ResponseEntity<List<PortfolioUI>>(portfolioUIs, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	 return new ResponseEntity<List<PortfolioUI>>(portfolioUIs, HttpStatus.OK);
    }

	
	
	//Implements API section 3.1 - Get all patents' details for Portfolio page
    @RequestMapping(value = "/rest-patents-portfolio/", method = RequestMethod.GET)
    public ResponseEntity<List<PortfolioUI>> listPatentsForPortfolio() {
    	log().debug(CLASSNAME+"listPatentsForPortfolio() invoked");
    	
    	List<PortfolioUI> portfolioUIs = new ArrayList<PortfolioUI>();
    	
    	try{
    		portfolioUIs = portfolioService.listAllPortfolioUIsForMyBusiness();
    	}
    	catch(Exception e){
    		// older technique was: StringWriter errors = new StringWriter(); e.printStackTrace(new PrintWriter(errors));  errors.toString()
    		logErrorAndContinue(CLASSNAME+"listPatentsForPortfolio() suffered exception",e);
    		return new ResponseEntity<List<PortfolioUI>>(portfolioUIs, HttpStatus.INTERNAL_SERVER_ERROR);
    	}

    	 return new ResponseEntity<List<PortfolioUI>>(portfolioUIs, HttpStatus.OK);
    	
    }

}
