/**
 * 
 */
package com.bcs.p3s.service;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.persistence.TypedQuery;

import org.joda.time.Days;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

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
		List<LoginMessage> allSystemMessages = pLoginBean.getUser().getLoginMessagesToDisplay();
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
		
		//find urgent Patents info
		TypedQuery<Patent> patents = Patent.findPatentsByBusiness(pLoginBean.getBusiness());
		if(!(patents.getResultList() == null))
			loginMessages.setUrgentPatents(getUrgentPatentsForModalDisplay(patents.getResultList(),pLoginBean));
		
		return loginMessages;
			
	}
	
	//Note :- Code not being TESTED
	@Override
	public void suppressLoginMessages(List<Long> ids){
		
		String msg = "suppressLoginMessages()";
		log().debug(msg + " invoked ");
		boolean isAnyMaliciousData = false;
		
		if(ids == null){
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
		   
		for(Long id : ids){
			LoginMessage message = LoginMessage.findLoginMessage(id);
			message.remove();
		}
		
		log().debug("Suppressed messages from user " + ids);
		return;
	}
	
	protected List<PatentUI> getUrgentPatentsForModalDisplay(List<Patent> patents,PostLoginSessionBean pLoginBean){
		
		List<PatentUI> urgentPatents = new ArrayList<PatentUI>();
		
		for(Patent patent : patents){
			PatentUI patentUI= new PatentUI(patent,pLoginBean.getExtendedPatentUI());
			int days = 0;
			
			if(Arrays.asList(urgentColors).contains(patentUI.getCostBandColour())){
				urgentPatents.add(patentUI);
			}
			else if(!RenewalColourEnum.GREY.equals(patentUI.getCostBandColour())){
				days = new DateUtil().daysBetween(Calendar.getInstance().getTime(), patentUI.getCostBandEndDate());
				if(days <= P3SPropertyNames.GREE_BLUE_ENDS_IN)
					urgentPatents.add(patentUI);
			}
		}
		return urgentPatents;
	}
	

}
