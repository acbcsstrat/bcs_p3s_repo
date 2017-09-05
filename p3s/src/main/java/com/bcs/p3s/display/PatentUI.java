package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.servlet.ServletContext;

import org.springframework.context.annotation.Scope;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.PatentServiceImpl;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.PatentExtendedData;


/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING (i.e. cannot be (reliably) set by this class):
 * 	CurrentRenewalCostUSD
 * 	CostBandEndDate
 * 	RenewalCostNextStageUSD
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
@Component
@Scope(value="session")
public class PatentUI extends Patent {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	//PatentService patentService = new PatentServiceImpl();
	
	
    private BigDecimal currentRenewalCostUSD;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date costBandEndDate;

    private BigDecimal renewalCostNextStageUSD;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date renewalDueDate;

    private String costBandColour;  

	/*private BigDecimal currentRenewalFeeEUR;
	private BigDecimal currentExtensionFeeEUR;
	private BigDecimal currentProcessingFeeEUR;
	private BigDecimal currentExpressFeeEUR;
	private BigDecimal currentUrgentFeeEUR;
	private BigDecimal latePayPenaltyEUR;
	private BigDecimal currentTotalEUR;
	private BigDecimal currentRenewalFeeUSD;
	private BigDecimal currentExtensionFeeUSD;
	private BigDecimal currentProcessingFeeUSD;
	private BigDecimal currentExpressFeeUSD;
	private BigDecimal currentUrgentFeeUSD;
	private BigDecimal latePayPenaltyUSD;
	private BigDecimal currentTotalUSD;
	private BigDecimal fxRate;*/
    
    private FeeUI feeUI;

    
	List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();


	// Constructor - converting a Patent to a PatentUI
	public PatentUI(Patent patent, List<PatentExtendedData> extendedDatas) {

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
		this.setLastRenewedYearEpo(patent.getLastRenewedYearEpo()); 
		this.setRenewalYear(patent.getRenewalYear());
		this.setNotifications(null); // UI will never want Notifications. Just NotificationUIs

		
		// Special work required here
		//System.out.println("(patentService==null) = "+(patentService==null));
		allNotificationUIs =createNotificationUIs(patent.getNotifications());

		//SETTING REMAINING FROM EXTENDED DATA ARGUMENT PASSED
		if(! (extendedDatas == null) ){
			for(PatentExtendedData extendedData : extendedDatas){
				if(extendedData.getPatentId() == null){ // Happens within add-patent processing 
					this.setRenewalDueDate(extendedData.getRenewalDueDate());
					this.setCostBandColour(extendedData.getCurrentCostBand());
					this.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					this.setCostBandEndDate(extendedData.getCostBandEndDate());
					this.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
					
				}
				
				else if(extendedData.getPatentId().equals(this.getId())){
					this.setRenewalDueDate(extendedData.getRenewalDueDate());
					this.setCostBandColour(extendedData.getCurrentCostBand());
					this.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					this.setCostBandEndDate(extendedData.getCostBandEndDate());
					this.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());

					// Set all the *costUSD & *costEUR fields
					if (extendedData.getFee()!=null) {
						FeeUI feeUI = new FeeUI(extendedData.getFee());
						this.setFeeUI(feeUI);
					}
				}
			}
		}
	}
	
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
	
	
	
	// Start of Legacy / Redundant getters - to be removed soon, while/incase FrontEnd still uses them. FE to migrate to non-underscore naming, WITH currencyIdentification. // acToDo 01-sep-2017

	public BigDecimal getCurrentRenewalCost() {
		return currentRenewalCostUSD;
	}
	public BigDecimal getRenewalCostNextStage() {
		return renewalCostNextStageUSD;
	}
	
	// End of Legacy / Redundant getters - to be removed soon, while/incase FrontEnd still uses them. FE to migrate to non-underscore naming, WITH currencyIdentification.
	
	
	
	
	// Ordinary getters/setters
	
	public BigDecimal getCurrentRenewalCostUSD() {
		return currentRenewalCostUSD;
	}

	public void setCurrentRenewalCostUSD(BigDecimal currentRenewalCostUSD) {
		this.currentRenewalCostUSD = currentRenewalCostUSD;
	}

	public Date getCostBandEndDate() {
		return costBandEndDate;
	}

	public void setCostBandEndDate(Date costBandEndDate) {
		this.costBandEndDate = costBandEndDate;
	}

	public BigDecimal getRenewalCostNextStageUSD() {
		return renewalCostNextStageUSD;
	}

	public void setRenewalCostNextStageUSD(BigDecimal renewalCostNextStageUSD) {
		this.renewalCostNextStageUSD = renewalCostNextStageUSD;
	}

	public Date getRenewalDueDate() {
		return renewalDueDate;
	}

	public void setRenewalDueDate(Date renewalDueDate) {
		this.renewalDueDate = renewalDueDate;
	}

	public String getCostBandColour() {
		return costBandColour;
	}

	public void setCostBandColour(String costBandColour) {
		this.costBandColour = costBandColour;
	}

	public FeeUI getFeeUI() {
		return feeUI;
	}

	public void setFeeUI(FeeUI feeUI) {
		this.feeUI = feeUI;
	}

	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public synchronized List<NotificationUI> createNotificationUIs(List<Notification> notifications) {

		//String err = PREFIX+"createNotificationUIs() ";
		//checkNoActionRequired(err);  // because such data is not sensitive. Is anonymous

		//log().debug(err+" invoked ");
		
		List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();
		
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
//			if (imatch == -1) fail("NotificationUI handling has failed.");
			if (imatch == -1) {
				Universal universal = new Universal();
				universal.fail("NotificationUI handling has failed.");
			}
			NotificationUI match = allNotificationUIs.get(imatch);
			match.setIsOn(true);
		}

		// Sort of displayOrder (for UI convenience)
		Collections.sort(allNotificationUIs);
		
//		System.out.println("acdebug - *ALL* notificationUIs after processing");
//		for (NotificationUI notificationUI : allNotificationUIs) {
//			System.out.println("          "+notificationUI.getId()+",   "+notificationUI.getIsOn()+",   "+notificationUI.getDisplayOrder()+",    "+notificationUI.getTitle());
//		}
		return allNotificationUIs;
	}
	
	
	
	
}
