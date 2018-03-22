package com.bcs.p3s.controller.web;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.email.EmailDevTest;
import com.bcs.p3s.enump3s.TxnNextStateEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Txn;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.EmulateMCService;
import com.bcs.p3s.service.FiddleDbService;
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
public class MiscController extends Universal {

		@Autowired
		PatentService patentService;  //Service which will do all data retrieval/manipulation work


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

            return "listtxns";
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
	    

	
}
