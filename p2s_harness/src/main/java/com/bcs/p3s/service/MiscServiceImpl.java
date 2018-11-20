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
		List<LoginMessage> allSystemMessages = pLoginBean.getUser().getLoginMessagesToInhibit();
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
		}
			
		loginMessages.setSystemMessages(systemMessages);
		log().debug(msg +" found [" + systemMessages +"] to be displyed to user[" +pLoginBean.getUser().getId());
		//find urgent Patents info
		TypedQuery<Patent> patents = Patent.findPatentsByBusiness(pLoginBean.getBusiness());
		if(!(patents.getResultList() == null))
			loginMessages.setUrgentPatents(getUrgentPatentsForModalDisplay(patents.getResultList(),pLoginBean));
		
		return loginMessages;
			
	}
	
	//Note :- Code not being TESTED
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
		isAnyMaliciousData = checkMessageForThisUser(ids);
		if(isAnyMaliciousData)
		{
			log().debug(msg + " invoked with MALICIOUS DATA");
			return;
		}
		  
		List<LoginMessage> allMessages = user.getLoginMessagesToInhibit();
		
		for(Long id : ids){
			for(LoginMessage eachMsg : allMessages){
				if(id.equals(eachMsg.getId())){
					allMessages.remove(eachMsg);
					log().debug("Suppressed message from user of message id :: " + eachMsg.getId());
					break;
				}
			}
		}
		
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
	

}
