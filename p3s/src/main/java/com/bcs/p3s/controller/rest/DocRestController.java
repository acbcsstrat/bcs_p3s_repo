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
import com.bcs.p3s.docs.htmldoc.model.HtmlDocCertificate;
import com.bcs.p3s.docs.htmldoc.model.PenaltyInvoice;
import com.bcs.p3s.docs.htmldoc.model.ProformaInvoice;
import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
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

	
	protected final String SHOW_PROFORMA_INVOICE_PAGE = "htmldocs/proformainvoice";
	protected final String SHOW_FINAL_INVOICE_PAGE = "htmldocs/finalinvoice";
	protected final String SHOW_PENALTY_INVOICE_PAGE = "htmldocs/penaltyinvoice";
	protected final String SHOW_CERTIFICATE_PAGE = "htmldocs/certificate";
	protected final String OHDEAR_PAGE = "htmldocs/ohdear";
	
	
	/*----------- User clicked on show Invoice button -----------*/
	
	@RequestMapping(value="/invoice/{transactionId}" , method = RequestMethod.GET)
	public ModelAndView showInvoice(@PathVariable("transactionId") String transactionId, Model uiModel){
		
		String err = "DocRestController : /invoice/{transactionId="+transactionId+"}";
		System.out.println(err);
		log().debug(err + " invoked");
		String nextPage = null;

		// Determine which Invoice TYPE to display - and display it
		try {
			Long paymentId = new Long(transactionId);
			Payment payment = Payment.findPayment(paymentId);
			if (payment==null) {
				logM().error(err+" given bad paymentID of "+transactionId);
				throw new P3SRuntimeException(err+" given bad paymentID of "+transactionId);
			}
			Invoice latestInvoice = payment.getLatestInvoice();
			InvoiceTypeEnum invoiceTypeEnum = new InvoiceTypeEnum(latestInvoice.getInvoiceType());
			String invoiceTypeStr = invoiceTypeEnum.toString();
			if (InvoiceTypeEnum.PROFORMA.equals(invoiceTypeStr)) {
				ProformaInvoice proformaInvoice = htmlDocService.getDataForProformaInvoice(payment);
				uiModel.addAttribute("proformaInvoice",proformaInvoice);
				nextPage= SHOW_PROFORMA_INVOICE_PAGE;
			} else if (InvoiceTypeEnum.FINAL.equals(invoiceTypeStr)) {
				// ProformaInvoice contains all the data that the Final Invoice needs. So reuse
				ProformaInvoice finalInvoice = htmlDocService.getDataForProformaInvoice(payment);
				uiModel.addAttribute("finalInvoice",finalInvoice);
				nextPage = SHOW_FINAL_INVOICE_PAGE;
			} else if (InvoiceTypeEnum.PENALTY.equals(invoiceTypeStr)) {
				PenaltyInvoice penaltyInvoice = htmlDocService.getDataForPenaltyInvoice(payment);
				uiModel.addAttribute("penaltyInvoice",penaltyInvoice);
				nextPage = SHOW_PENALTY_INVOICE_PAGE;
			} else fail(err+" Bad invoiceTypeStr of "+invoiceTypeStr);
		}
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			nextPage = OHDEAR_PAGE;
		}
		
		
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName(nextPage);
		log().debug(err+" returning next="+nextPage);
		return modelAndView;
	}
	

	/*----------- User clicked on show Certificate button -----------*/
	
	@RequestMapping(value="/certificate/{renewalId}" , method = RequestMethod.GET)
	public ModelAndView showCertificate(@PathVariable("renewalId") String renewalId, Model uiModel){
		
		String err = "DocRestController : /certificate/{renewalId}="+renewalId+"}";
		System.out.println(err);
		log().debug(err + " invoked");
		String nextPage = null;

		// Access Certificate data - and display it
		try {
			Long renewalIdLng = new Long(renewalId);
			Renewal renewal = Renewal.findRenewal(renewalIdLng);
			if (renewal==null || renewal.getCertificate()==null) {
				logM().error(err+" given bad renewalID of "+renewalId);
				throw new P3SRuntimeException(err+" given bad renewalID of "+renewalId);
			}

			HtmlDocCertificate htmlDocCertificate = htmlDocService.getDataForCertificate(renewal);
			uiModel.addAttribute("htmlDocCertificate",htmlDocCertificate);
			nextPage= SHOW_CERTIFICATE_PAGE;

		}
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
			nextPage = OHDEAR_PAGE;
		}
		
		
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName(nextPage);
		log().debug(err+" returning next="+nextPage);
		return modelAndView;
	}
	
	/*-----------  -----------*/
	/*-----------  -----------*/

}
	