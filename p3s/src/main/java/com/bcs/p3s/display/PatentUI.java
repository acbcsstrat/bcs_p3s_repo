package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING:
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
		this.setNotifications(patent.getNotifications());

		
		// Special work required here
		createNotificationUIs(patent.getNotifications());

		

		// Now the additional fields - WHICH ARE
//		patentUI.setCurrentRenewalCost(new BigDecimal("1.11"));
//		patentUI.setCostBandEndDate(nowPlusNdays(2));
//		patentUI.setRenewalCostNextStage(new BigDecimal("1111111.11"));
//		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patent.getFilingDate()));
				
		DummyDataEngine dummy = new DummyDataEngine();
		System.out.println("Calling DummyDataEngine:populateExtendedPatentFieldsWithDummyData for patent "+patent.getPatentApplicationNumber());
    	dummy.populateExtendedPatentFieldsWithDummyData(this, patent);

	}


	
	
	
	
	
	
	/**
	 * The JSON file (i.e. the UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public synchronized void createNotificationUIs(List<Notification> notifications) {

		// Assemble ALL notificationUIs (identifiable by ID)
		List<Notification> allNotifications = Notification.findAllNotifications();
		for (Notification anotification : allNotifications) {
			NotificationUI notificationUI = new NotificationUI(anotification);
			allNotificationUIs.add(notificationUI);
		}

		// In below code:
		//  indexOf relies on equals() in NotificationUI
		//  Sorting relies on compareTo() in NotificationUI
		
		
		// Switch ON as appropriate
		for (Notification notification : notifications) { // i.e. each ON notification
			NotificationUI matchTarget = new NotificationUI(notification);

			// find existing match, & switch on
			int imatch = allNotificationUIs.indexOf(matchTarget);
			if (imatch == -1) fail("NotificationUI handling has failed.");
			NotificationUI match = allNotificationUIs.get(imatch);
			match.setIsOn(true);
		}

		// Sort of displayOrder (for UI convenience)
		Collections.sort(allNotificationUIs);
		
//		System.out.println("acdebug - *ALL* notificationUIs after processing");
//		for (NotificationUI notificationUI : allNotificationUIs) {
//			System.out.println("          "+notificationUI.getId()+",   "+notificationUI.getIsOn()+",   "+notificationUI.getDisplayOrder()+",    "+notificationUI.getTitle());
//		}
	}

	
	
	

	
	// Getter/setters requiring special processing

	public List<NotificationUI> getNotificationUIs() {
		return this.allNotificationUIs;
		// No Setter - see createNotificationUIs()
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
