package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.context.annotation.Scope;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.engine.StageManager;
import com.bcs.p3s.enump3s.Form1200StatusEnum;
import com.bcs.p3s.enump3s.NotificationProductTypeEnum;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
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
    protected BigDecimal totalRenewalOfficialFeesEUR; // added for currentOfficialFeeEUR. Not nice.
    protected BigDecimal totalRenewalOfficialFeesUSD;
    
	protected Form1200FeeUI form1200FeeUI;
    
    
	List<NotificationUI> allRenewalNotificationUIs = new ArrayList<NotificationUI>();
	List<NotificationUI> allEpctNotificationUIs = new ArrayList<NotificationUI>();


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
		this.setEpctStatus(Form1200StatusEnum.statusForUI(patent.getEpctStatus()));
		this.setEpctNotAvailableReason(patent.getEpctNotAvailableReason());
		this.setIpcCodes(patent.getIpcCodes());
		this.setPriorityDate(patent.getPriorityDate());
		this.setPCT_publishedDate(patent.getPCT_publishedDate());
		
		long myUserId = SecurityUtil.getMyUser().getId();
		allRenewalNotificationUIs = assembleAllNotificationUIs(patent.getId(), myUserId, NotificationProductTypeEnum.RENEWAL);
		allEpctNotificationUIs = assembleAllNotificationUIs(patent.getId(), myUserId, NotificationProductTypeEnum.EPCT);

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
						
						// yes, hereafter is an utter & frantic bodge
						BigDecimal euroFees = extendedData.getFee().calcTotalOfEuroFees();
						this.setTotalRenewalOfficialFeesEUR(euroFees);
			    		GlobalVariableSole glob = GlobalVariableSole.findOnlyGlobalVariableSole();
			    		BigDecimal fxRate = glob.getCurrent_P3S_rate();
			    		this.setTotalRenewalOfficialFeesUSD(euroFees.multiply(fxRate));
					} 
					else 
					{
						// IF is an EPCT - is valid 
						if (StageManager.isInFiling(patent.getEpoPatentStatus()))
						{
							System.out.println(" PatentUi constructor - its an EPCT - can we get price ?");
							if (Form1200StatusEnum.isInactive(patent.getEpctStatus())) {
								// leave TotalRenewalOfficialFeesEUR / USD as zero
								System.out.println(" PatentUi constructor - is an INACTIVE EPCT - so leave TotalRenewalOfficialFeesEUR / USD as zero");
							}
							else 
							{
								System.out.println(" PatentUi constructor - is an ACTIVE EPCT - so try get price");
								// cobbled from ServiceManager line 36
					    		EpctEngine epctEngine = new EpctEngine(patent);
					    		if ( ! epctEngine.isNotAvailable()) {
					    			P3SService unused = epctEngine.prepareForm1200Service();
					    			Form1200Fee fee = epctEngine.getFee();
					    			BigDecimal euroFees = fee.calcTotalOfEuroFees();

									this.setTotalRenewalOfficialFeesEUR(euroFees);
						    		GlobalVariableSole glob = GlobalVariableSole.findOnlyGlobalVariableSole();
						    		BigDecimal fxRate = glob.getCurrent_P3S_rate();
						    		this.setTotalRenewalOfficialFeesUSD(euroFees.multiply(fxRate));
					    		}
							}
						}
						else
						{
							// is in prosecution - but no extendedData.getFee
							System.out.println("More  HE LL -0 Renewal extendedData.getFee()==null PatentId="+patent.getId()+". Is OK if notActive - eg RenewalInPlace. IS="+patent.getRenewalStatus()+"      (PatentUI line217)");
						}
				} // End of : extendedData.getFee() or not
					break;
				} // End of : There IS extendedData for this item
			} // END OF: FOR EACH PatentExtendedData
		}
	} // End of Constructor

	
	
	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications (for this patent, user & productType),
	 *  and, for each, whether it is on or off.
	 * NotificationMappings just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into a Collection. Then update those that are ON. Then sort.
	 * Sorted by display order
	 * @param patent_id
	 * @param user_id
	 * @param productType a NotificationProductTypeEnum value as a String
	 * @return	All possible NotificationUIs, each indicating if onn or off
	 */
	public synchronized List<NotificationUI> assembleAllNotificationUIs(Long patent_id, Long user_id, String productType) {
		if (patent_id==null || patent_id==0 || user_id==null || user_id==0 || productType==null) return null;

		

		List<NotificationMapping> allOnNotificationMappings = NotificationMapping.findAllOnNotificationMappings(patent_id, user_id);
		Set<Long> ONs = new HashSet<>();
		for (NotificationMapping nm : allOnNotificationMappings) {
			ONs.add(nm.getNotification_id());
		}
		
		List<NotificationUI> result = new ArrayList<NotificationUI>();		
		List<Notification> allNotifications = Notification.findAllNotificationsByProductType(productType.toString());
		NotificationUI notificationUI = null;
		for (Notification notification : allNotifications) {
			notificationUI = new NotificationUI(notification);

			Long notificationId = notification.getId();
			if (ONs.contains(notificationId)) {
				notificationUI.setIsOn(true);
			}

			result.add(notificationUI);
		}
		return result;
	}	
	

	
	
	
	// Getter/setters requiring special processing


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

//	public BigDecimal getCurrentRenewalCost() {
//		return currentRenewalCostUSD;
//	}
//	public BigDecimal getRenewalCostNextStage() {
//		return renewalCostNextStageUSD;
//	}
	
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

	public List<NotificationUI> getRenewalNotificationUIs() {
		return allRenewalNotificationUIs;
	}

	public void setRenewalNotificationUIs(List<NotificationUI> allRenewalNotificationUIs) {
		this.allRenewalNotificationUIs = allRenewalNotificationUIs;
	}

	public List<NotificationUI> getEpctNotificationUIs() {
		return allEpctNotificationUIs;
	}

	public void setEpctNotificationUIs(List<NotificationUI> allEpctNotificationUIs) {
		this.allEpctNotificationUIs = allEpctNotificationUIs;
	}

	public BigDecimal getTotalRenewalOfficialFeesEUR() {
		return totalRenewalOfficialFeesEUR;
	}
	public void setTotalRenewalOfficialFeesEUR(BigDecimal totalRenewalOfficialFeesEUR) {
		this.totalRenewalOfficialFeesEUR = totalRenewalOfficialFeesEUR;
	}
	
	public BigDecimal getTotalRenewalOfficialFeesUSD() {
		return totalRenewalOfficialFeesUSD;
	}
	public void setTotalRenewalOfficialFeesUSD(BigDecimal totalRenewalOfficialFeesUSD) {
		this.totalRenewalOfficialFeesUSD = totalRenewalOfficialFeesUSD;
	}

}
