/**
 * 
 */
package com.bcs.p3s.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Claims;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.service.EPOAccessImpl;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.date.DateUtil;

/**
 * @author MerinP
 *
 */
@Service("MiscService")
public class MiscServiceImpl extends ServiceAuthorisationTools implements MiscService {
	
	final String[] urgentColors = {RenewalColourEnum.AMBER, RenewalColourEnum.RED , RenewalColourEnum.BLACK};

	@Override
	public LoginMessageUI findAllLoginMessagesForUser(PostLoginSessionBean pLoginBean){
		
	/**
	 * Includes 2 sections
	 * 		1. Retrieve all System Messages from database
	 * 		2. Find all Urgent Patents info
	 * 			2.1 When a band change will take place within a week for end of green or blue.
	 * 			2.2 When in Amber, red or Black,
	 */
	
	String msg = "findAllLoginMessagesForUser()";
	log().debug(msg + " invoked");
	if(pLoginBean == null){
		log().debug(msg +" invoked with session null");
		return null;
	}
	
	LoginMessageUI loginMessages = new LoginMessageUI();
	/** Logic change for System Messages.Now displaying all messages in LoginMessage table for all 
	 * 	user unless they told to inhibit the msg
	 */
	//List<LoginMessage> allSystemMessages = pLoginBean.getUser().getLoginMessagesToInhibit();
	/*List<LoginMessage> allSystemMessages = LoginMessage.findAllLoginMessages();
	List<LoginMessage> systemMessages = new ArrayList<LoginMessage>();
	//List<LoginMessageUI> loginMessagesUI = new ArrayList<LoginMessageUI>();
	Calendar today = Calendar.getInstance();
	for(LoginMessage eachMessage : allSystemMessages){
			
		Calendar displayFrom = Calendar.getInstance();
		displayFrom.setTime(eachMessage.getDisplayFromDate());
			
		Calendar displayTill = Calendar.getInstance();
		displayTill.setTime(eachMessage.getDisplayToDate());
			
		if(today.getTime().after(displayFrom.getTime()) && today.getTime().before(displayTill.getTime())){
			systemMessages.add(eachMessage);
		}
	}*/
	
	//Check whether user told to inhibit any of these messages
	
	List<LoginMessage> systemMessagesToDisplay = getLoginMessagesToDisplayForUser(pLoginBean);
		
	loginMessages.setSystemMessages(systemMessagesToDisplay);
	log().debug(msg +" found [" + systemMessagesToDisplay +"] to be displayed to user[" +pLoginBean.getUser().getId() +"]");
	//find urgent Patents info
	TypedQuery<Patent> patents = Patent.findPatentsByBusiness(pLoginBean.getBusiness());
	if(!(patents.getResultList() == null))
		loginMessages.setUrgentPatents(getUrgentPatentsForModalDisplay(patents.getResultList(),pLoginBean));
	
	return loginMessages;
		
}
	
	@Override
	public void suppressLoginMessages(List<Long> ids, P3SUser user){
		
		String msg = "suppressLoginMessages()";
		log().debug(msg + " invoked for messages ids :: " + ids.toString());
		boolean isAnyMaliciousData = false;
		
		if(ids.isEmpty()){
			log().debug(msg + " invoked with no messages being selected. No processing required this time");
			return;
		 }
		
		//check whether the extracted ids are relevant to the user - checking for malicious ids being sent over
		//isAnyMaliciousData = checkMessageForThisUser(ids);
		if(isAnyMaliciousData)
		{
			log().debug(msg + " invoked with MALICIOUS DATA");
			return;
		}
		  
		List<LoginMessage> allMessages = user.getLoginMessagesToInhibit();
		
		/** Change of logic: mapping table to store inhibited messages for the user starts **/
		 
		/*for(Long id : ids){
			for(LoginMessage eachMsg : allMessages){
				if(id.equals(eachMsg.getId())){
					allMessages.remove(eachMsg);
					log().debug("Suppressed message from user of message id :: " + eachMsg.getId());
					break;
				}
			}
		}*/
		
		for(Long id : ids){
			LoginMessage loginMsg = LoginMessage.findLoginMessage(id);
			allMessages.add(loginMsg);
			log().debug("Added message id[" + id.toString() +"] such that it will get inhibited for user[" +user.getId() +"]");
		}
		
		/** Change of logic: mapping table to store inhibited messages for the user ends **/
		
		user.setLoginMessagesToInhibit(allMessages);
		user.merge();
		log().debug("Suppressed messages from user " + ids.toString());
		return;
	}
	
	protected List<PatentUI> getUrgentPatentsForModalDisplay(List<Patent> patents,PostLoginSessionBean pLoginBean){
		
		String msg = "getUrgentPatentsForModalDisplay()";
		log().debug(msg + " invoked for finding List of urgent Patents");
		
		List<PatentUI> urgentPatents = new ArrayList<PatentUI>();
		
		for(Patent patent : patents){
			PatentUI patentUI= new PatentUI(patent,pLoginBean.getExtendedPatentUI());
			int days = 0;
			
			if(Arrays.asList(urgentColors).contains(patentUI.getCostBandColour())){
				log().debug("Patent[" +patentUI.getId() +"] is in URGENT COLOUR. Added to urgent message list");
				urgentPatents.add(patentUI);
			}
			else if(!RenewalColourEnum.GREY.equals(patentUI.getCostBandColour())){
				days = new DateUtil().daysBetween(Calendar.getInstance().getTime(), patentUI.getCostBandEndDate());
				//do we need to display the patent as urgent patent if status is not Show price?
				if(days <= P3SPropertyNames.GREE_BLUE_ENDS_IN && RenewalStatusEnum.SHOW_PRICE.equals(patentUI.getRenewalStatus())){
					urgentPatents.add(patentUI);
					log().debug("Patent[" +patentUI.getId() +"] has reached GREEN/BLUE end. Added to urgent message list");
				}
			}
		}
		
		log().debug(msg + " returning ["+  urgentPatents.size() + "] urgent patents");
		return urgentPatents;
	}
	
	protected List<LoginMessage> getLoginMessagesToDisplayForUser(PostLoginSessionBean pLoginBean){
		
		List<LoginMessage> allSystemMessages = LoginMessage.findAllLoginMessages();
		List<LoginMessage> suppressedMessages = pLoginBean.getUser().getLoginMessagesToInhibit();
		
		List<LoginMessage> activeSystemMessages = new ArrayList<LoginMessage>();
		//List<LoginMessageUI> loginMessagesUI = new ArrayList<LoginMessageUI>();
		Calendar today = Calendar.getInstance();
		for(LoginMessage eachMessage : allSystemMessages){
				
			Calendar displayFrom = Calendar.getInstance();
			displayFrom.setTime(new DateUtil().getMidnight(eachMessage.getDisplayFromDate()));
				
			Calendar displayTill = Calendar.getInstance();
			displayTill.setTime(new DateUtil().getEndOfDate(eachMessage.getDisplayToDate()));
				
			if(today.getTime().after(displayFrom.getTime()) && today.getTime().before(displayTill.getTime())){
				if(!(containsId(suppressedMessages, eachMessage.getId())))
					activeSystemMessages.add(eachMessage);
			}
		}
		
		
		return activeSystemMessages;
		
	}
	
	
	public boolean containsId(List<LoginMessage> list, long id) {
	    for (LoginMessage object : list) {
	        if (object.getId() == id) {
	            return true;
	        }
	    }
	    return false;
	}

	//------------ Below are the scraping methods for FORM1200 -----------
	@Override
	public Claims getClaims(String patentPublicationNumber) {
					
		Claims claims = new Claims();
					
		EPOAccessImpl epoAccess = new EPOAccessImpl();
		claims = epoAccess.readEPOForClaims(patentPublicationNumber);
		return claims;
	}
	
	@Override
	public Form1200Record readEPOForForm1200(String patentApplicationNumber) {
	
		Form1200Record form1200 = new Form1200Record();
		Claims claims = new Claims();
		String abstractTxt = null;
			
		try{
			EPOAccessImpl epoAccess = new EPOAccessImpl();
			form1200 = epoAccess.readEPORegisterForForm1200(patentApplicationNumber);
						
			
			claims = epoAccess.readEPOForClaims(form1200.getEP_PublicationNumber());
			form1200.setAllClaims(claims.getAllClaims());
			
			abstractTxt = epoAccess.readEPOForAbstract(form1200.getEP_PublicationNumber());
			form1200.setAbstractTxt(abstractTxt);
		}
		catch(NullPointerException e){
			if(form1200 == null || claims ==null || abstractTxt == null)
				logErrorAndContinue("Scrape returned no data");
		}
					
		return form1200;
	}

	@Override
	public String readAbstract(String patentPublicationNumber) {
		
		String abstractTxt = null;
		EPOAccessImpl epoAccess = new EPOAccessImpl();
		abstractTxt = epoAccess.readEPOForAbstract(patentPublicationNumber);
		return abstractTxt;
	}
}
