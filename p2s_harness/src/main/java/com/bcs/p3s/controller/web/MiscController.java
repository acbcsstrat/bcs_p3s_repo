package com.bcs.p3s.controller.web;


import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.TxnProduct;
import com.bcs.p3s.docs.email.EmailDevTest;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.TxnNextStateEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.model.Txn;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.EmulateMCService;
import com.bcs.p3s.service.FiddleDbService;
import com.bcs.p3s.service.Form1200HarnessConstants;
import com.bcs.p3s.service.Form1200HarnessService;
import com.bcs.p3s.service.OSCommandService;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.util.config.BuildinfoPropertyReader;
import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.Universal;


/**
 * Provides odd functionality. 
 * Usually for Internal Use Only, & provided from the actest.html page 
 * @author andyc
 *
 */
@Controller
public class MiscController extends Universal implements Form1200HarnessConstants {

	
	@Autowired
	PatentService patentService;  //Service which will do all data retrieval/manipulation work


	//------------------------------ LIST ACTIVE PAYMENTS  --------------------------------------------

	@RequestMapping(value="/listtxns", method = RequestMethod.GET, produces = "text/html")
    public String listtxns(Model uiModel) {
		System.out.println("listtxns in MiscController invoked");

		System.out.println("");

		// Get all transactions that we are interested in
		List<Txn> activeTransactions = new ArrayList<Txn>();
		List<Payment> allPayments = Payment.findAllPayments();
		int count = 0;
		for (Payment pay : allPayments) {
			System.out.println("Examining Payment Id="+pay.getId());
			if ("Completed".equalsIgnoreCase(pay.getLatestTransStatus())) continue;
			Invoice ii = pay.getLatestInvoice();
			if (ii!=null && ("Closed".equals(ii.getInvoiceStatus()))) continue;;
			System.out.println("If got to here - this is an ACTIVE txn. Status = "+pay.getLatestTransStatus());
			Txn trixy = new Txn(pay, count++);
			activeTransactions.add(trixy);
		}
		System.out.println("Num active transactions = "+activeTransactions.size());
		uiModel.addAttribute("txns", activeTransactions);
		uiModel.addAttribute("numtxns", activeTransactions.size());

		List<String> nextStateValues = TxnNextStateEnum.getNextStateValues();
		String alloptions = "<option value=\"-\">-</option>";
		for (String line : nextStateValues) {
			String item = "<option value=\""+line+"\">"+line+"</option>";
			alloptions += item; 
		}
		uiModel.addAttribute("options", alloptions);

		uiModel.addAttribute("timeStr", timeStr());
		
        return "listtxns";
    }

	
	//------------------------------ LIST PRODUCTS FOR PAYMENT  --------------------------------------------
	
    @RequestMapping(value="/listtxnproducts", method = RequestMethod.GET, produces = "text/html")
    public String listtxnproducts(Model uiModel, String p3sref) {
		String err = "MiscController :: listtxnproducts("+p3sref +")  ";
		log().debug(err+"invoked");

		// Get the transactions that we are interested in
		//Payment payment = Payment.findPayment(txnId);
		Payment payment = Payment.findPaymentsByP3S_TransRef(p3sref).getSingleResult();
				
		
		
		String txnName = payment.getP3S_TransRef();
		String txnStatus = payment.getLatestTransStatus();
		List<Renewal> renewals = payment.getRenewals();
		List<Epct> epcts = payment.getEpcts();

		uiModel.addAttribute("txnId", payment.getId());
		uiModel.addAttribute("txnName", txnName);
		uiModel.addAttribute("txnStatus", txnStatus);
		
		String epctoptions = "<option value=\"-\">-</option>";
		epctoptions += "<option value=\""+AWAIT_PDF_GEN_START+"\">"+AWAIT_PDF_GEN_START+"</option>";
		epctoptions += "<option value=\""+EPCT_BEING_GENERATED+"\">"+EPCT_BEING_GENERATED+"</option>";
		epctoptions += "<option value=\""+EPCT_SAVED+"\">"+EPCT_SAVED+"</option>";
		//epctoptions += "<option value=\""+UPLOAD_PDF+"\">"+UPLOAD_PDF+"</option>";
		//epctoptions += "<option value=\""+VIEW_PDF+"\">"+VIEW_PDF+"</option>";
		uiModel.addAttribute("epctoptions", epctoptions);
		
		uiModel.addAttribute("timeStr", timeStr());

		uiModel.addAttribute("renewals", renewals);
		uiModel.addAttribute("epcts", epcts);
		
		List<TxnProduct> products = new ArrayList<TxnProduct>();
		for (Renewal renewal : renewals) {
			Patent patent = renewal.getPatent();
			TxnProduct product = new TxnProduct("Renewal", renewal.getId(), patent.getEP_ApplicationNumber(), patent.getId(), renewal.getRenewalStatus(), null, -1L);
			products.add(product);
		}
		for (Epct epct : epcts) {
			Patent patent = epct.getPatent();
			Form1200 form1200 = epct.getForm1200();
			long blobId = -2L; //posit
			if (form1200!=null) {
				blobId = form1200.getId();
				epct.setForm1200(null);
			}
			TxnProduct product = new TxnProduct("Euro-PCT", epct.getId(), patent.getEP_ApplicationNumber(), patent.getId(), epct.getEpctStatus(), epctoptions, blobId);
			products.add(product);
		}
		uiModel.addAttribute("products", products);
		uiModel.addAttribute("timeStr", timeStr());
		
		return "listtxnproducts";
    }

	
	
    @RequestMapping(value="/listepcts", method = RequestMethod.GET, produces = "text/html")
    public String listepcts(Model uiModel) {
		String err = "MiscController :: listepcts()  ";
		log().debug(err+"invoked");

		// Get ALL Epcts that are not yet committed
		List<Epct> allEpcts = Epct.findAllEpcts();
		List<Epct> epcts = new ArrayList<Epct>();
		for (Epct epct : allEpcts) {
			String epctStatus = epct.getEpctStatus();
			Form1200StatusEnum f12enum = new Form1200StatusEnum(epctStatus);
			if (f12enum.canSellForm1200()) epcts.add(epct);
			
			;
		}
		uiModel.addAttribute("epcts", epcts);
		uiModel.addAttribute("timeStr", timeStr());
		
		return "listepcts";
    }

	
	
	@RequestMapping(value="/changestatus", method = RequestMethod.POST, produces = "text/html")
    public String changestatus(Model uiModel, String p3sref, String nextstate) {
		String loc = "MiscController :: changestatus() : Txn = "+p3sref +" and new status is "+nextstate+" ";
		log().debug(loc+"invoked ");;
		
		if (nextstate.startsWith("MC: ")) {
			try {
				EmulateMCService emc = new EmulateMCService();
				emc.processHarnessInstruction(p3sref, nextstate);
			}
			catch (Exception e) {
				logErrorAndContinue(loc+" Exception: ",e);
				return "htmldocs/ohdear"; 
			}
		}
		else {
			try {
				FiddleDbService fiddle = new FiddleDbService();
				fiddle.processHarnessInstruction(p3sref, nextstate);
			}
			catch (Exception e) { return "htmldocs/ohdear"; }
		}
		
		
        return "done";
    }

	
	// glue : to connect a *Servlet to a jsp page
	@RequestMapping(value="/dun", method = RequestMethod.GET, produces = "text/html")
    public String dun(Model uiModel, HttpServletRequest request) {
		String loc = "MiscController :: dun () : ";
		log().debug(loc+"invoked ");;
		
		String retto = request.getParameter("returnto");
		log().debug(loc+"invoked with returnto = "+retto);;
		
		uiModel.addAttribute("returnto", retto); 
		
        return "done";
    }

	
	
	//@RequestMapping(value="/changeproductstatus", method = RequestMethod.POST, produces = "text/html")
	//public String changeproductstatus(Model uiModel, String productType, String productId, String nextstate) {
	//	String loc = "MiscController :: changeproductstatus() : productType="+productType+"  productId="+productId+"   and new status is "+nextstate+"  : ";
	//	log().debug(loc+"invoked ");;
	//	
	//	if ("epct".equals(productType)) {
	//		Form1200HarnessService form1200HarnessService = new Form1200HarnessService();
	//		form1200HarnessService.processEpctCommand(productId, nextstate, uiModel);
	//	}
	//	else log().error("Change ionvoked, yet not appropriate for productId="+productId+" :    from "+loc);
	//	//uiModel.addAttribute("TxnRef", txnName);  // would love to - but need Payment
	//
	//    return "done";
	//}

	
	@RequestMapping(value="/changeepctstatus", method = RequestMethod.POST, produces = "text/html")
    public String changeepctstatus(Model uiModel, String epctId, String nextstate) {
		String loc = "MiscController :: changeepctstatus() : epctId="+epctId+"   and new status is "+nextstate+"  : ";
		log().debug(loc+"invoked ");;
		
		Form1200HarnessService form1200HarnessService = new Form1200HarnessService();
		form1200HarnessService.processEpctCommand(epctId, nextstate, uiModel);
		
		uiModel.addAttribute("returnto", "listepcts"); 
        return "done";
    }
	
	
	
	@RequestMapping(value="/writemc", method = RequestMethod.GET, produces = "text/html")
    public String writemc(Model uiModel) {
		log().debug("writemc() in MiscController invoked. ");
		
		try {
			OSCommandService os = new OSCommandService();
			os.WriteToMC();
		}
		catch (Exception e) { return "htmldocs/ohdear"; }
		
        return "done";
    }

	@RequestMapping(value="/readmc", method = RequestMethod.GET, produces = "text/html")
    public String readmc(Model uiModel) {
		log().debug("readmc() in MiscController invoked. ");
		
		try {
			OSCommandService os = new OSCommandService();
			os.ReadFromMC();
		}
		catch (Exception e) { return "htmldocs/ohdear"; }
		
        return "done";
    }

	@RequestMapping(value="/readepo", method = RequestMethod.GET, produces = "text/html")
    public String readepo(Model uiModel) {
		log().debug("readepo() in MiscController invoked. ");
		
		try {
			OSCommandService os = new OSCommandService();
			os.ReadFromEPO();
		}
		catch (Exception e) { return "htmldocs/ohdear"; }
		
        return "done";
    }

	@RequestMapping(value="/followon", method = RequestMethod.GET, produces = "text/html")
    public String followon(Model uiModel) {
		log().debug("followon() in MiscController invoked. ");
		
		try {
			OSCommandService os = new OSCommandService();
			os.Followon();
		}
		catch (Exception e) { return "htmldocs/ohdear"; }
		
        return "done";
    }

	
	
	@RequestMapping(value="/whoami", method = RequestMethod.GET, produces = "text/html")
    public String whoami(Model uiModel) {
		System.out.println("whoami in MiscController invoked");

        P3SUser me = SecurityUtil.getMyUser();
        Business myBuisness = SecurityUtil.getMyBusiness();
    	List<PatentUI> patentUIs = patentService.listAllPatentUIsForMyBusiness();

    	BuildinfoPropertyReader buildinfoPropertyReader = new BuildinfoPropertyReader();
    	String buildTimestamp = buildinfoPropertyReader.getBuildTimestamp();
    	String dbname = buildinfoPropertyReader.whichDB();
		String hostname = Hostname.getHostname();

    	
        uiModel.addAttribute("me", me);
        uiModel.addAttribute("myBusiness", myBuisness);
        uiModel.addAttribute("patents", patentUIs);
        uiModel.addAttribute("numpatents", patentUIs.size() );
        uiModel.addAttribute("buildtimestamp", buildTimestamp );
        uiModel.addAttribute("dbname", dbname );
        uiModel.addAttribute("hostname", hostname );
        
        
        return "whoami";
    }

	
	
	@RequestMapping(value="/acgenerateemail", method = RequestMethod.POST, produces = "text/html")
    public String acgenerateemail(Model uiModel, String emailchoice) {
		log().debug("acgenerateemail in MiscController invoked  : param = "+emailchoice);

		int code = Integer.parseInt(emailchoice);
		EmailDevTest tester = new EmailDevTest();
		tester.testByCode(code);
		
        return "blank";
    }
    
	@RequestMapping(value="/actesttestpanic", method = RequestMethod.POST, produces = "text/html")
    public String actesttestpanic(Model uiModel, String message) {
		String keymessage = message;
		log().debug("actesttestpanic in MiscController invoked  : param = "+keymessage);

		String msg = null;
		String key = "Don't 0veruse";
		int lemmy = key.length();
		if (keymessage!=null && keymessage.length()>lemmy && keymessage.startsWith(key)) {
			panic("TEST from actest.html: "+keymessage.substring(lemmy));
		}
		
        return "blank";
    }

	
	   
	   
	   //------------------------------ view form1200 PDF from Blob --------------------------------------------
	   
		@RequestMapping(value = "/form1200PDF", method = RequestMethod.GET)
		public void form1200PdfImage(@RequestParam(value = "form1200id", required = false) Long form1200id, 
				HttpServletResponse response,HttpServletRequest request) throws ServletException, IOException {

			String err = CLASSNAME+"/form1200PDF  ";
			log().debug(err + "invoked  : form1200id = "+form1200id);

			byte[] bytearray = new byte[1048576]; // 1MB. Plenty big for 10k resized Avatars

			try {
				Form1200 form1200 = Form1200.findForm1200(form1200id);
				Blob blobby = form1200.getPdfBlob();

				if (blobby==null) {
						log().warn(err+" IS NO f1200 PDF IN dB FOR ID "+form1200id);
						response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
						response.getOutputStream().write(bytearray,0,0); 
				} else {
					int size=0;
					InputStream sImage = blobby.getBinaryStream();
					while( (size=sImage.read(bytearray)) != -1 ) {
						log().debug(err+" in loop reading f1200 pdf. Size this loop is "+size);

						response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
						response.getOutputStream().write(bytearray,0,size); 
					}
				}

				response.getOutputStream().close();
			    //log().debug(PREFIX+" AFTER loop. size NOW = "+size);
			}
			catch(Exception ex) {
				logInternalError().error(err+"Error retrieving f1200 pdf. Rqst was id "+form1200id, ex);
			}
		}


		
		

	protected String timeStr() {
		String result = ".";
		Date now = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		result = sdf.format(now);
		return result;
	}

}
