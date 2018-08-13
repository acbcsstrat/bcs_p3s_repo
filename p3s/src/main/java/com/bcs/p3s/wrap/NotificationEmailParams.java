package com.bcs.p3s.wrap;

import java.util.Date;

import com.bcs.p3s.engine.CostAnalysisDataEngine;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.model.EpoRenewalFee;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

public class NotificationEmailParams extends Universal{
	
	private String notificationName;
	
	private String template;
	
	private Patent patent;
	
	private P3SUser user;
	
	private String price;
	
	private String obTimeBeforeChangePhrase; // e.g. '2 weeks'
	
	private String obTimeStampOfNextColourChange; // e.g. 'Nov 22, 2017 17:01 UTC'
	
	
	public NotificationEmailParams(NotificationMapping nMapping, Notification notification,P3SUser user , CalendarColour colourDates) {
		super();
		log().debug("NotificationEmailParams constructor invoked");
		this.template = notification.getEmailTemplateId();
		this.patent = Patent.findPatent(nMapping.getPatent_id());
		this.user = user;
		this.obTimeBeforeChangePhrase = notification.getTitle();
		this.price = getPrice(this.patent,notification.getCostbandcolor());
		this.obTimeStampOfNextColourChange = getObTimeStampOfNextColourChange(notification.getCostbandcolor(), colourDates);
	}

	//overloaded getter getPrice()
	private String getPrice(Patent patent,String currentPhase){
		
		String msg = "Extended setter for price property";
		log().debug(msg +" invoked");
		String price = "";
		CombinedFee fee = new CostAnalysisDataEngine().getFeeObj(patent);
		
		if(fee.getEpoFee() == null || fee.getP3sFee() == null || fee.getFxRate() == null){
			log().error("Error calculating Fee object for patent with renewal year " + patent.getRenewalYear());
			return price;
		}
		RenewalFee currentFee = new CostAnalysisDataEngine().getCurrentPhaseCost(currentPhase, fee.getP3sFee(), fee.getEpoFee(), fee.getFxRate());
		
		if(!(currentFee.getSubTotal_USD() == null)){
			price = currentFee.getSubTotal_USD().toString();
			log().debug(msg + " returning Price as " + price);
		}
		
		return price;
		
	}
	
	//overloaded getter getObTimeStampOfNextColourChange()
	private String getObTimeStampOfNextColourChange(String currentPhase, CalendarColour colourDates){
		
		String msg = "Extended setter for obTimeStampOfNextColourChange property";
		log().debug(msg +" invoked");
		Date nextColourTime = new Date();
		String nextColourTimeString = "";
		
		
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.GREEN))
			nextColourTime = colourDates.getAmberStart();
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.AMBER))
			nextColourTime = colourDates.getRedStart();
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.RED))
			nextColourTime = colourDates.getBlueStart();
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLUE))
			nextColourTime = colourDates.getBlackStart();
		if(currentPhase.equalsIgnoreCase(RenewalColourEnum.BLACK))
			nextColourTime = colourDates.getBlackPhoneUpStart();
		
		nextColourTimeString = new DateUtil().dateToUSStringWithTimeZone(nextColourTime);
		
		log().debug(msg + " returning Next Timestamp as " + nextColourTimeString);
		return nextColourTimeString;
	}
	
	
	//Generic getters and setters
	public String getNotificationName() {
		return notificationName;
	}


	public void setNotificationName(String notificationName) {
		this.notificationName = notificationName;
	}


	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public Patent getPatent() {
		return patent;
	}

	public void setPatent(Patent patent) {
		this.patent = patent;
	}

	public P3SUser getUser() {
		return user;
	}

	public void setUser(P3SUser user) {
		this.user = user;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getObTimeBeforeChangePhrase() {
		return obTimeBeforeChangePhrase;
	}

	public void setObTimeBeforeChangePhrase(String obTimeBeforeChangePhrase) {
		this.obTimeBeforeChangePhrase = obTimeBeforeChangePhrase;
	}

	public String getObTimeStampOfNextColourChange() {
		return obTimeStampOfNextColourChange;
	}

	public void setObTimeStampOfNextColourChange(String obTimeSatmpOfNextColourChange) {
		this.obTimeStampOfNextColourChange = obTimeSatmpOfNextColourChange;
	}

	

}
