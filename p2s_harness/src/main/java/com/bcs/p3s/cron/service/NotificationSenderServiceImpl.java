/**
 * 
 */
package com.bcs.p3s.cron.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.cron.engine.NotificationEngine;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailFactory;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.email.EmailSender;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.NotificationEmailParams;

/**
 * 
 * This service impl class holds all the necessary code to effectively Patent Notification Emails
 * Backed up by NotificationEngine
 * 
 * /**
	 * GET ALL PATENT IDS WITH STATUS AS SHOW_PRICE/TOO_LATE {coz we are sending emails in RED and BLACK period}
	 * GET List<NotificationMapping> for those patents
	 * GROUP THIS LIST by month to get a HashMap<String,List<NotificationMapping>>
	 * FOR EACH VALUE IN THE MAP CHECK ANY NOTIFICATION TO CHECK
	 */

/**
 * @author MerinP
 *
 */
public class NotificationSenderServiceImpl extends Universal implements NotificationSenderService {
	
	protected String PREFIX = this.getClass().getName() + " : "; 

	@Override
	public void sendNotificationEmails() {
		
		String msg = "sendNotificationEmails()";
		log().debug("Overnight process to "+ msg +" invoked");
		
		List<NotificationEmailParams> itemsToSend = new ArrayList<NotificationEmailParams>();
		
		itemsToSend = new NotificationEngine().findNotification();
		
		if(itemsToSend.isEmpty()){
			log().debug("No notifications to send this time.");
			return;
		}
		
		for(NotificationEmailParams eachEmail : itemsToSend){
			P3sEmailFactory factory = new P3sEmailFactory();
			/**
			 * BELOW ORDER TO FOLLOW::::
			 * 
			 * public P3sEmail create(String template, Object user, Object patent, Object price, 
			 * 							Object obTimeBeforeChangePhrase, Object obTimestampOfNextColourChange, null, null) 
			 */
			P3sEmail email = factory.create(eachEmail.getTemplate(), eachEmail.getUser(), eachEmail.getPatent(), 
							eachEmail.getPrice(), eachEmail.getObTimeBeforeChangePhrase(), eachEmail.getObTimeStampOfNextColourChange(), null, null);
	
			EmailSender emailer = new EmailSender(email);
			emailer.addRecipient(eachEmail.getUser().getEmailAddress());
			emailer.sendEmail();
		}
	}
	
	

}
