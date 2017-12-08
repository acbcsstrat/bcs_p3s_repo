package com.bcs.p3s.controller.rest;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.service.UserService;
import com.bcs.p3s.util.lang.Universal;

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class DocRestController extends Universal {

	@Autowired
    UserService userService;
	
	@Autowired
    HttpSession session ;
	
	/*----------- User clicked on Invoice button -----------*/
	
	@RequestMapping(value="/invoice/{transactionId}" , method = RequestMethod.GET)
	public ModelAndView enableUser(@PathVariable("transactionId") String transactionId, Model uiModel){
		
		String msg = "DocRestController : /invoice/{transactionId="+transactionId+"}";
		System.out.println(msg);
		log().debug(msg + " invoked");
		
		
		uiModel.addAttribute("harry","meghan");

		
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("jerry","tom");
		modelAndView.setViewName("htmldocs/proformainvoiceXX");
		return modelAndView;
	
	}
	
	/*-----------  -----------*/
	/*-----------  -----------*/

}
