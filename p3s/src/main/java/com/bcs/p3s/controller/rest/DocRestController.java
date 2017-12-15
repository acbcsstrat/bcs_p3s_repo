package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;

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

import com.bcs.p3s.docs.htmldoc.HtmlDocService;
import com.bcs.p3s.docs.htmldoc.model.PenaltyInvoice;
import com.bcs.p3s.docs.htmldoc.model.ProformaInvoice;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BasketContents;

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class DocRestController extends Universal {

	@Autowired
	HtmlDocService htmlDocService;
	
	@Autowired
    HttpSession session ;
	
	/*----------- User clicked on Invoice button -----------*/
	
	@RequestMapping(value="/invoice/{transactionId}" , method = RequestMethod.GET)
	public ModelAndView enableUser(@PathVariable("transactionId") String transactionId, Model uiModel){
		
		String err = "DocRestController : /invoice/{transactionId="+transactionId+"}";
		System.out.println(err);
		log().debug(err + " invoked");
		boolean ok = true;

		// acTodo - work out WHAT TYPE invoice
		
		
		
		
		
		
		try {
			Long paymentId = new Long(transactionId);
			Payment payment = Payment.findPayment(paymentId);
			if (payment==null) {
				logM().error(err+" given bad paymentID");
				throw new P3SRuntimeException(err+" given bad paymentID");
			}
			// ProformaInvoice contains all the data that the Final Invoice needs. So reuse
			PenaltyInvoice penaltyInvoice = htmlDocService.getDataForPenaltyInvoice(payment);

			uiModel.addAttribute("penaltyInvoice",penaltyInvoice);
			
			
//			// this is stashed code for FINAL invoice			
//			try {
//				Long paymentId = new Long(transactionId);
//				Payment payment = Payment.findPayment(paymentId);
//				if (payment==null) fail(err+" given bad paymentID");
//				// ProformaInvoice contains all the data that the Final Invoice needs. So reuse
//				ProformaInvoice finalInvoice = htmlDocService.getDataForProformaInvoice(payment);
//
//				uiModel.addAttribute("finalInvoice",finalInvoice);
//				
//				
			
// this is atshed code for PROFORMA invoice			
//			Long paymentId = new Long(transactionId);
//			Payment payment = Payment.findPayment(paymentId);
//			if (payment==null) fail(err+" given bad paymentID");
//			ProformaInvoice proformaInvoice = htmlDocService.getDataForProformaInvoice(payment);
//			//uiModel.addAttribute("harry","meghan");
//			uiModel.addAttribute("proformaInvoice",proformaInvoice);
			
			
					
		}
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			ok = false;
		}
		
		

		
		ModelAndView modelAndView = new ModelAndView();
		//modelAndView.addObject("jerry","tom");

		
		
		
// proforma		String next = (ok)?"htmldocs/proformainvoice" : "htmldocs/ohdear";
// final		String next = (ok)?"htmldocs/finalinvoice" : "htmldocs/ohdear";
//    String next = (ok)?"htmldocs/penaltyinvoice" : "htmldocs/ohdear";
		
		
		
		String next = (ok)?"htmldocs/penaltyinvoice" : "htmldocs/ohdear";
		modelAndView.setViewName(next);
		log().debug(err+" returning next="+next);
		return modelAndView;
	}
	
	/*-----------  -----------*/
	/*-----------  -----------*/

}
