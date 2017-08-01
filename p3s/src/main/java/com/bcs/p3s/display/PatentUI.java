package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.PatentServiceImpl;
import com.bcs.p3s.util.date.DateUtil;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING (i.e. cannot be (reliably) set by this class):
 * 	CurrentRenewalCost
 * 	CostBandEndDate
 * 	RenewalCostNextStage
 * 	RenewalDueDate
 * 
 * Further notes specific to this class:
 * 
 *   Agreed 6th June 2017 that a request for multiple patents would include, within each patent, 
 *   all the required data for the 'view patent' page.
 *   Hence this extended class contains all the notifications, et al
 * 
 * 
 * @author andyc
 *
 */
public class PatentUI extends Patent {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	PatentService patentService = new PatentServiceImpl();
	
    private BigDecimal currentRenewalCost;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date costBandEndDate;

    private BigDecimal renewalCostNextStage;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date renewalDueDate;

    
	List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();


	// Constructor - converting a Patent to a PatentUI
	public PatentUI(Patent patent) {

		this.setId(patent.getId());
		this.setVersion(patent.getVersion());
		
		this.setPatentApplicationNumber(patent.getPatentApplicationNumber());
		this.setTitle(patent.getTitle());
		this.setFilingDate(patent.getFilingDate());
		this.setPrimaryApplicantName(patent.getPrimaryApplicantName());
		this.setPatentPublicationNumber(patent.getPatentPublicationNumber());
		this.setClientRef(patent.getClientRef());
		this.setShortTitle(patent.getShortTitle());
		this.setEpoPatentStatus(patent.getEpoPatentStatus());
		this.setRenewalStatus(patent.getRenewalStatus());
		this.setBusiness(patent.getBusiness());
		this.setLastRenewedDateExEpo(patent.getLastRenewedDateExEpo()); 
		this.setRenewalYear(patent.getRenewalYear());
		this.setNotifications(null); // UI will never want Notifications. Just NotificationUIs

		
		// Special work required here
		System.out.println("(patentService==null) = "+(patentService==null));
		allNotificationUIs = patentService.createNotificationUIs(patent.getNotifications());

		

		// Now the additional fields - WHICH ARE
//		patentUI.setCurrentRenewalCost(new BigDecimal("1.11"));
//		patentUI.setCostBandEndDate(nowPlusNdays(2));
//		patentUI.setRenewalCostNextStage(new BigDecimal("1111111.11"));
//		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patent.getFilingDate()));
				
		DummyDataEngine dummy = new DummyDataEngine();
		System.out.println("Calling DummyDataEngine:populateExtendedPatentFieldsWithDummyData for patent "+patent.getPatentApplicationNumber());
    	dummy.populateExtendedPatentFieldsWithDummyData(this, patent);

	}

	
	
	
	
	

	
	
// Created 170703, but immediately redundant (for now)  acTidy
//	/**
//	 * Creates a Patent from 'this' PatentUI
//	 * 
//	 * Notes:
//	 * - creates Notifications from NotificationUIs
//	 * - otherwise, all fields are populated from the extended Patent fields.
//	 *  
//	 *  It is the clients responsibility to ensure all required fields in the PatentUI are populated
//	 *  
//	 * @return the corresponding Patent Object
//	 */
//	public Patent toPatent() {
//		Patent patent = new Patent();
//		
//		patent.setId(this.getId());
//		patent.setVersion(this.getVersion());
//		patent.setPatentApplicationNumber(this.getPatentApplicationNumber());
//		patent.setTitle(this.getTitle());
//		patent.setFilingDate(this.getFilingDate());
//		patent.setBusiness(this.getBusiness());
//		patent.setPrimaryApplicantName(this.getPrimaryApplicantName());
//		patent.setClientRef(this.getClientRef());
//		patent.setShortTitle(this.getShortTitle());
//		patent.setEpoPatentStatus(this.getEpoPatentStatus());
//		patent.setLastRenewedDateExEpo(this.getLastRenewedDateExEpo());
//		patent.setRenewalYear(this.getRenewalYear());
//		patent.setRenewalStatus(this.getRenewalStatus());
//		patent.setPatentPublicationNumber(this.getPatentPublicationNumber());
//
//		// Now - the Notifications
//		List<Notification> notifications = new ArrayList<Notification>();
//		for (NotificationUI nui : this.getNotificationUIs()) {
//			if (nui.getIsOn()) {
//				Notification notification = nui.toNotification();
//				notifications.add(notification);
//			}
//		}
//		patent.setNotifications(notifications);
//	    
//		return patent;
//	}
	
	
	
	

	
	// Getter/setters requiring special processing

	public List<NotificationUI> getNotificationUIs() {
		return this.allNotificationUIs;
	}
	public void setNotificationUIs(List<NotificationUI> allNotificationUIs) {
		// Hardly ever needed. See createNotificationUIs()
		this.allNotificationUIs = allNotificationUIs;
	}

	
	
	
	// Getter/setters that return String version of typed fields - for UI convenience
	public String getLastRenewedDateExEpoUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getLastRenewedDateExEpo());
		return res;
	}
	public String getFilingDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getFilingDate());
		return res;
	}
	public String getCostBandEndDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.costBandEndDate);
		return res;
	}
	public String getRenewalDueDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.renewalDueDate);
		return res;
	}
	
	
	
	// Ordinary getters/setters
	
	public BigDecimal getCurrentRenewalCost() {
		return currentRenewalCost;
	}

	public void setCurrentRenewalCost(BigDecimal currentRenewalCost) {
		this.currentRenewalCost = currentRenewalCost;
	}

	public Date getCostBandEndDate() {
		return costBandEndDate;
	}

	public void setCostBandEndDate(Date costBandEndDate) {
		this.costBandEndDate = costBandEndDate;
	}

	public BigDecimal getRenewalCostNextStage() {
		return renewalCostNextStage;
	}

	public void setRenewalCostNextStage(BigDecimal renewalCostNextStage) {
		this.renewalCostNextStage = renewalCostNextStage;
	}

	public Date getRenewalDueDate() {
		return renewalDueDate;
	}

	public void setRenewalDueDate(Date renewalDueDate) {
		this.renewalDueDate = renewalDueDate;
	}

}
