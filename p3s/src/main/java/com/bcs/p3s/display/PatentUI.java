package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.context.annotation.Scope;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.PatentExtendedData;


/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 *
 * Below: an old v1 comment
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
 *   October2018 : This class substantially extended for v2.1
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
	
	
    protected BigDecimal currentRenewalCostUSD;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    protected Date costBandEndDate;

    protected BigDecimal renewalCostNextStageUSD;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    protected Date renewalDueDate;

    protected String costBandColour;  
    
    /**
     * To support FE on the property name change from patentApplicationNumber to EP_ApplicationNumber
     */
    protected String patentApplicationNumber;
    protected String patentPublicationNumber;
    protected Date filingDate;

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
    
    protected RenewalFeeUI renewalFeeUI;

	protected Form1200FeeUI form1200FeeUI;
    
    
	List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();


	// Constructor - converting a Patent to a PatentUI
	public PatentUI(Patent patent, List<PatentExtendedData> extendedDatas) {

		this.setId(patent.getId());
		this.setVersion(patent.getVersion());
		
		this.setEP_ApplicationNumber(patent.getEP_ApplicationNumber());
		this.setTitle(patent.getTitle());
		this.setInternationalFilingDate(patent.getInternationalFilingDate());
		this.setPrimaryApplicantName(patent.getPrimaryApplicantName());
		this.setEP_PublicationNumber(patent.getEP_PublicationNumber());
		this.setClientRef(patent.getClientRef());
		this.setShortTitle(patent.getShortTitle());
		this.setEpoPatentStatus(patent.getEpoPatentStatus());
		this.setRenewalStatus(patent.getRenewalStatus());
		this.setBusiness(patent.getBusiness());
		this.setLastRenewedDateExEpo(patent.getLastRenewedDateExEpo()); 
		this.setLastRenewedYearEpo(patent.getLastRenewedYearEpo()); 
		this.setRenewalYear(patent.getRenewalYear());
		this.setPatentApplicationNumber(patent.getEP_ApplicationNumber());
		this.setPatentPublicationNumber(patent.getEP_PublicationNumber());
		this.setFilingDate(patent.getInternationalFilingDate());
		this.setRepresentative(patent.getRepresentative());
		
		this.setInternationalFilingLang(patent.getInternationalFilingLang());
		this.setPCT_applicationNumber(patent.getPCT_applicationNumber());
		this.setPCT_publicationNumber(patent.getPCT_publicationNumber());
		this.setInternationalSearchAuthority(patent.getInternationalSearchAuthority());
		this.setDesignated_states(patent.getDesignated_states());
		this.setEpctStatus(patent.getEpctStatus());
		this.setEpctNotAvailableReason(patent.getEpctNotAvailableReason());
		this.setIpcCodes(patent.getIpcCodes());
		this.setPriorityDate(patent.getPriorityDate());
		this.setPCT_publishedDate(patent.getPCT_publishedDate());
		
		allNotificationUIs =createNotificationUIs(patent.getId(),SecurityUtil.getMyUser().getId());

		//SETTING REMAINING FROM EXTENDED DATA ARGUMENT PASSED
		if(! (extendedDatas == null) ){
			for(PatentExtendedData extendedData : extendedDatas){
				if(extendedData.getPatentId() == null){ // Happens within add-patent processing 
					this.setRenewalDueDate(extendedData.getRenewalDueDate());
					this.setCostBandColour(extendedData.getCurrentCostBand());
					this.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					this.setCostBandEndDate(extendedData.getCostBandEndDate());
					this.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
					break;
				}
				
				else if(extendedData.getPatentId().equals(this.getId())){
					this.setRenewalDueDate(extendedData.getRenewalDueDate());
					this.setCostBandColour(extendedData.getCurrentCostBand());
					this.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
					this.setCostBandEndDate(extendedData.getCostBandEndDate());
					this.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());

					// Set all the *costUSD & *costEUR fields
					if (extendedData.getFee()!=null) {
						RenewalFeeUI renewalFeeUI = new RenewalFeeUI(extendedData.getFee());
						this.setRenewalFeeUI(renewalFeeUI);
					}
					break;
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
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getInternationalFilingDate());
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

	public RenewalFeeUI getRenewalFeeUI() {
		return renewalFeeUI;
	}
	public void setRenewalFeeUI(RenewalFeeUI renewalFeeUI) {
		this.renewalFeeUI = renewalFeeUI;
	}

	public Form1200FeeUI getForm1200FeeUI() {
		return form1200FeeUI;
	}
	public void setForm1200FeeUI(Form1200FeeUI form1200FeeUI) {
		this.form1200FeeUI = form1200FeeUI;
	}
	
	

	public String getPatentApplicationNumber() {
		return patentApplicationNumber;
	}

	public void setPatentApplicationNumber(String EP_ApplicationNumber) {
		this.patentApplicationNumber = EP_ApplicationNumber;
	}
	
	

	public String getPatentPublicationNumber() {
		return patentPublicationNumber;
	}

	public void setPatentPublicationNumber(String EP_PublicationNumber) {
		this.patentPublicationNumber = EP_PublicationNumber;
	}
	
	public Date getFilingDate() {
		return filingDate;
	}

	public void setFilingDate(Date internationalFilingDate) {
		this.filingDate = internationalFilingDate;
	}

	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public synchronized List<NotificationUI> createNotificationUIs(Long patent_id,Long user_id) {

		//String err = PREFIX+"createNotificationUIs() ";
		//checkNoActionRequired(err);  // because such data is not sensitive. Is anonymous

		//log().debug(err+" invoked ");
		
		List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();
		List<Notification> allOnNotifications = new ArrayList<Notification>();
		
		// Assemble ALL notificationUIs (identifiable by ID)
		//List<Notification> allNotifications = Notification.findAllNotifications();
		List<Notification> allNotifications = Notification.findAllNotifications();
		if(!(patent_id == null)){
			allOnNotifications = new NotificationMapping().getAllPatentNotificationsForUser(patent_id, user_id);
		}
		else{
			for(Notification notification : allNotifications){
				if(notification.getDefaultOn())
					allOnNotifications.add(notification);
			}
		}
		
		for (Notification anotification : allNotifications) {
			NotificationUI notificationUI = new NotificationUI(anotification);
			allNotificationUIs.add(notificationUI);
		}

		// In below code:
		//  indexOf relies on equals() in NotificationUI
		//  Sorting relies on compareTo() in NotificationUI
		
		
		// Switch ON as appropriate
		for (Notification notification : allOnNotifications) { // i.e. each ON notification
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
