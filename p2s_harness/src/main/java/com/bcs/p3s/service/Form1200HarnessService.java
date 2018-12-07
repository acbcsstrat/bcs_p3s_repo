package com.bcs.p3s.service;

import org.springframework.ui.Model;

import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.lang.Universal;

public class Form1200HarnessService extends Universal implements Form1200HarnessConstants {

	public void processEpctCommand(String epctId, String nextstate, Model uiModel) {
		String msg = CLASSNAME+" processEpctCommand(epctId="+epctId+", nextstate="+nextstate+") : ";
		log().debug(msg);
	
		if (AWAIT_PDF_GEN_START.equals(nextstate)
		 || EPCT_BEING_GENERATED.equals(nextstate)
		 || EPCT_SAVED.equals(nextstate)) 
		{
			Epct epct = Epct.findEpct(Long.valueOf(epctId));
			String existingStatus = epct.getEpctStatus();
			Patent patent = epct.getPatent();
			epct.setEpctStatus(nextstate);
			patent.setEpctStatus(nextstate);
			epct.merge();
			patent.merge();
			log().info(msg+"Completed Change Epct("+epctId+") status from "+existingStatus+" to "+nextstate);

		}
		else log().error("Invoked with INVALID nextstate="+nextstate+"  : from "+msg);
	}

//	public void processEpctCommand(String productId, String nextstate, Model uiModel) {
//		String msg = CLASSNAME+" processEpctCommand(productId="+productId+", nextstate="+nextstate+") : ";
//		log().debug(msg);
//	
//		if (AWAIT_PDF_GEN_START.equals(nextstate)
//		 || EPCT_BEING_GENERATED.equals(nextstate)
//		 || EPCT_SAVED.equals(nextstate)) 
//		{
//			Epct epct = Epct.findEpct(Long.valueOf(productId));
//			String existingStatus = epct.getEpctStatus();
//			Patent patent = epct.getPatent();
//			epct.setEpctStatus(nextstate);
//			patent.setEpctStatus(nextstate);
//			epct.merge();
//			patent.merge();
//			log().info(msg+"Completed Change Epct("+productId+") status from "+existingStatus+" to "+nextstate);
//
////			uiModel.addAttribute("TxnRef", "TxnRef");
////			uiModel.addAttribute("TxnUrl", "uRL");
//		}
//		else if (UPLOAD_PDF.equals(nextstate)) {
//			log().debug("you sent  UPLOAD_PDF");
//		}
//		else if (VIEW_PDF.equals(nextstate)) {
//			log().debug("you sent VIEW_PDF");
////			/avatarImage
////			/form1200PDF
//		}
//		else if (DOWNLOAD_PDF.equals(nextstate)) {
//			log().debug("you sent DOWNLOAD_PDF");
//		}
//		else log().error("BadLogic error from "+msg);
//		
//
//	}

	
	
}
