package com.bcs.p3s.display;

import java.util.List;

import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.wrap.PatentExtendedData;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING (i.e. cannot be (reliably) set by this class):
 * 	None
 * 
 * Further notes specific to this class:
 * 	This class DOES carry both the Patent Object and the Payment (aka Transaction) object 
 * 
 * @author andyc
 *
 */
public class EpctUI extends Epct {

	// Additional UI members go here - acTidy

//    private String renewalDueDateUI;
//    private String certificateUrl;
//    private String invoiceUrl;
//    private PatentUI patentUI;
//    private RenewalFeeUI renewalFeeUI;

	private String invoiceUrl;
	private PatentUI patentUI;
	private Form1200FeeUI form1200FeeUI;
    
	// Now add items, as required, from the API section 4.1 / Table 4.1a
	//Items from Patent
	private String filingLang;
		//private Date filingDueDate;
		// private String filingDueDateUI;
		// this is for renewals !! Ignore
	private String PCT_ApplicationNumber;
	private String PCT_PublicationNumber;
	private String form1200Status;
	private String internationalSearchAuthority;		
	//Items from Epct (or elsewhere)
	private Integer totalClaims;						// from epct
	private List<ExtensionStateUI> extensionStatesUI;		// from epct
	private List<ValidationStateUI> validationStatesUI;		// from epct
	//private String activePaymentId	
	private String form1200PdfUrl;						// from form1200
	
	
	
	//Items from elsewhere
	
    
	// Constructor - converting a Epct to a EpctUI
	public EpctUI(Epct epct,  List<PatentExtendedData> extendedDatas) {

		this.setId(epct.getId());
		this.setVersion(epct.getVersion());
		this.setCreatedBy(epct.getCreatedBy());
		this.setCreatedDate(epct.getCreatedDate());
		
		// nullify data thats not required (safes coding & JSON work)
		// ditto: totalPages, descriptionStartPage, descriptionEndPage, claimsStartPage, claimsEndPage, drawingsStartPage, drawingsEndPage, isYear3RenewalDue, isYear3RenewalPaying, epctApplicationExpiryDate;
		// Inherited fields: totalClaims, 
		
		this.setEpctSubmittedDate(epct.getEpctSubmittedDate());
		this.setEpctStatus(epct.getEpctStatus());
		
		PatentUI patentUI = new PatentUI(epct.getPatent(), extendedDatas);
		this.setPatent(null);
		this.setPatentUI(patentUI);
		

		//Get the FeeUI
		Form1200FeeUI form1200FeeUI = new Form1200FeeUI(epct.getForm1200Fee());
		this.setForm1200Fee(null); 
		this.setForm1200FeeUI(form1200FeeUI);
		

		// For urls - read the website context 
		String context = null;
		String urlBase = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			context = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_CONTEXT); 
			urlBase = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE);
		} catch (P3SPropertyException e) {
			System.out.println("EpctUI constructor : property read failed");
			e.printStackTrace();
		}

//		//Get the certificate details
//		//Certificate certificate = Certificate.
//		this.setCertificateUrl(null);
//		//if (renewal.getCertificate() != null) this.setCertificateUrl(renewal.getCertificate().getUrl());
//		if (renewal.getCertificate() != null) {
//			this.setCertificateUrl(context + "/certificate/" + renewal.getId().toString());
//			this.setCertificate(renewal.getCertificate());
//			this.getCertificate().setRenewal(null);
//		}
		
		//Get the invoice url
		Payment activePaymentId = epct.findActivePaymentId();
		//if(renewal.getActivePaymentId().getLatestInvoice() != null) {
		if(activePaymentId != null) {
			String url = "";
			if (context!=null) {
				url = context + "/invoice/" + activePaymentId.getId().toString(); 
			}
			this.setInvoiceUrl(url);
		}


		
		
		
		// Set the additional fields introduced in v2.1
		//Items from Patent
		this.setFilingLang(patentUI.getInternationalFilingLang());
//		//private Date filingDueDate;
//		// private String filingDueDateUI;
//		// this is for renewals !! Ignore
		this.setPCT_ApplicationNumber(patentUI.getPCT_applicationNumber());
		this.setPCT_PublicationNumber(patentUI.getPCT_publicationNumber());
		this.setForm1200Status(patentUI.getEpctStatus());
		this.setInternationalSearchAuthority(patentUI.getInternationalSearchAuthority());
		//Items from Epct (or elsewhere)
			//		this.setExtensionStates(null);
			//		this.setValidationStates(null);
		DummyForm1200Engine dummy = new DummyForm1200Engine();
//		String extsnStatesCSV = this.getExtensionStates();
//		String validStatesCSV = this.getValidationStates();

		String extsnStatesCSV = epct.getExtensionStates();
		String validStatesCSV = epct.getValidationStates();
		
		
		
		
		
		
		extensionStatesUI = dummy.listStrStates2ExtnsStates(dummy.csStings2ist(extsnStatesCSV)); // this 'dummy' code might actually become real ? / valid
		validationStatesUI = dummy.listStrStates2ValidStates(dummy.csStings2ist(validStatesCSV));
		//private String activePaymentId	

		
		// Get the form1200PdfUrl
		if(this.getForm1200() != null) {
			String url = "";
			if (urlBase!=null) {
				url = urlBase + "download.pdf?epctId=" + this.getId();
			}
			this.setForm1200PdfUrl(url);
		}

		
		
		
		//Get the paymentUI details  - acTidy
//		renewal.getActivePaymentId().setRenewals(null);
//		renewal.getActivePaymentId().setLatestInvoice(null);
//		renewal.getActivePaymentId().setInitiatedByUserId(null);
//		this.setActivePaymentId(renewal.getActivePaymentId());
		
		//set patent to null use only patentUI
		
//		PatentUI pui = new PatentUI(this.getPatent(),extendedDatas);
//		this.setPatent(null);
//		pui.setBusiness(null);
//		//pui.setNotifications(null);
//		pui.setNotificationUIs(null);
		
		// NOte: - at 170726, devt is not able to set following fields - so use DummyDataEngine - acTidy
		//System.out.println("   EpctUI constructor: acDebug acINCOMPLETE - at 170726, devt is not able to set following fields - so use DummyDataEngine");
		//(new Universal()).log().debug("   EpctUI constructor: acDebug acINCOMPLETE - at 170726, devt is not able to set following fields - so use DummyDataEngine");
/*		 * 	CurrentRenewalCost
		 * 	CostBandEndDate
		 * 	RenewalCostNextStage
		 * 	RenewalDueDate
*/
		/*DummyDataEngine dummyEngine = new DummyDataEngine();
		dummyEngine.populateExtendedPatentFieldsWithDummyData(pui, this.getPatent());*/

		//this.setPatentUI(pui);

		
		// Finally, remove LARGE unwanted inherited data (ie Epct)
		// yet to adientify such
	}


	
	// Getter/setters requiring special processing

//	public List<NotificationUI> getNotificationUIs() {
//		return this.allNotificationUIs;
//		// No Setter - see createNotificationUIs()
//	}

// v2.1 - above was v1 renewals - but API not specifiy Notifications here - AC 181102
	
	
	
	// Getter/setters that return String version of typed fields - for UI convenience
//	public String getLastRenewedDateExEpoUI() {
//		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getLastRenewedDateExEpo());
//		return res;
//	}
//	public String getFilingDateUI() {
//		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getFilingDate());
//		return res;
//	}
//	public String getCostBandEndDateUI() {
//		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.costBandEndDate);
//		return res;
//	}
//	public String getRenewalDueDateUI() {
//		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.renewalDueDate);
//		return res;
//	}
	
	
	
	// Ordinary getters/setters
	
//	public String getRenewalDueDateUI() {
//		return renewalDueDateUI;
//	}
//	public void setRenewalDueDateUI(String renewalDueDateUI) {
//		this.renewalDueDateUI = renewalDueDateUI;
//	}

//	public String getCertificateUrl() {
//		return certificateUrl;
//	}
//	public void setCertificateUrl(String certificateUrl) {
//		this.certificateUrl = certificateUrl;
//	}

	public PatentUI getPatentUI() {
		return patentUI;
	}
	public void setPatentUI(PatentUI patentUI) {
		this.patentUI = patentUI;
	}

//	public RenewalFeeUI getRenewalFeeUI() {
//		return renewalFeeUI;
//	}
//	public void setRenewalFeeUI(RenewalFeeUI renewalFeeUI) {
//		this.renewalFeeUI = renewalFeeUI;
//	}
	
	
	public String getInvoiceUrl() {
		return invoiceUrl;
	}

	public void setInvoiceUrl(String invoiceUrl) {
		this.invoiceUrl = invoiceUrl;
	}

	public Form1200FeeUI getForm1200FeeUI() {
		return form1200FeeUI;
	}
	public void setForm1200FeeUI(Form1200FeeUI form1200FeeUI) {
		this.form1200FeeUI = form1200FeeUI;
	}

	public String getFilingLang() {
		return filingLang;
	}
	public String getPCT_ApplicationNumber() {
		return PCT_ApplicationNumber;
	}
	public String getPCT_PublicationNumber() {
		return PCT_PublicationNumber;
	}
	public String getForm1200Status() {
		return form1200Status;
	}
	public String getInternationalSearchAuthority() {
		return internationalSearchAuthority;
	}
	public Integer getTotalClaims() {
		return totalClaims;
	}
	public List<ExtensionStateUI> getExtensionStatesUI() {
		return extensionStatesUI;
	}
	public List<ValidationStateUI> getValidationStatesUI() {
		return validationStatesUI;
	}
	public String getForm1200PdfUrl() {
		return form1200PdfUrl;
	}
	public void setFilingLang(String filingLang) {
		this.filingLang = filingLang;
	}
	public void setPCT_ApplicationNumber(String pCT_ApplicationNumber) {
		PCT_ApplicationNumber = pCT_ApplicationNumber;
	}
	public void setPCT_PublicationNumber(String pCT_PublicationNumber) {
		PCT_PublicationNumber = pCT_PublicationNumber;
	}
	public void setForm1200Status(String form1200Status) {
		this.form1200Status = form1200Status;
	}
	public void setInternationalSearchAuthority(String internationalSearchAuthority) {
		this.internationalSearchAuthority = internationalSearchAuthority;
	}
	public void setTotalClaims(Integer totalClaims) {
		this.totalClaims = totalClaims;
	}
	public void setExtensionStatesUI(List<ExtensionStateUI> extensionStatesUI) {
		this.extensionStatesUI = extensionStatesUI;
	}
	public void setValidationStatesUI(List<ValidationStateUI> validationStatesUI) {
		this.validationStatesUI = validationStatesUI;
	}
	public void setForm1200PdfUrl(String form1200PdfUrl) {
		this.form1200PdfUrl = form1200PdfUrl;
	}




//	public boolean isRenewedSuccessfully() {
//		boolean result = false;
//		String status = this.getRenewalStatus();
//		if (RenewalStatusEnum.RENEWAL_IN_PLACE.equalsIgnoreCase(status))
//			result = true;
//		return result;
//	}
	
	//	public BigDecimal getCurrentRenewalCost() {
//		return currentRenewalCost;
//	}
//
//	public void setCurrentRenewalCost(BigDecimal currentRenewalCost) {
//		this.currentRenewalCost = currentRenewalCost;
//	}
//
//	public Date getCostBandEndDate() {
//		return costBandEndDate;
//	}
//
//	public void setCostBandEndDate(Date costBandEndDate) {
//		this.costBandEndDate = costBandEndDate;
//	}
//
//	public BigDecimal getRenewalCostNextStage() {
//		return renewalCostNextStage;
//	}
//
//	public void setRenewalCostNextStage(BigDecimal renewalCostNextStage) {
//		this.renewalCostNextStage = renewalCostNextStage;
//	}
//
//	public Date getRenewalDueDate() {
//		return renewalDueDate;
//	}
//
//	public void setRenewalDueDate(Date renewalDueDate) {
//		this.renewalDueDate = renewalDueDate;
//	}

	
	
	
}
