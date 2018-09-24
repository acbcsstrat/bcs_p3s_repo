package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Certificate;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.PatentServiceImpl;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.service.TransactionServiceImpl;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
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
public class RenewalUI extends Renewal {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	//TransactionService transactionService = new TransactionServiceImpl();
	
	// Additional UI members go here

    private String renewalDueDateUI;
    private String certificateUrl;
    private String invoiceUrl;
    private PatentUI patentUI;
    private RenewalFeeUI renewalFeeUI;

    
    
	// Constructor - converting a Renewal to a RenewalUI
	public RenewalUI(Renewal renewal,  List<PatentExtendedData> extendedDatas) {

		
		this.setId(renewal.getId());
		this.setVersion(renewal.getVersion());

		this.setPatent(renewal.getPatent());
		
		this.setRenewalYear(renewal.getRenewalYear());
		this.setRenewalDueDate(renewal.getRenewalDueDate());
		this.setRenewalPeriod(renewal.getRenewalPeriod());
		this.setRenewalStatus(renewal.getRenewalStatus());
		this.setRenewalAttemptsMade(renewal.getRenewalAttemptsMade());
		

		// Now the additional fields - WHICH ARE
		this.setRenewalDueDateUI((new DateUtil()).dateToUSStringWithDayOfWeek(this.getRenewalDueDate()));

		// For urls - read the website 
		
		// Read web context
		String context = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			context = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_CONTEXT); 
		} catch (P3SPropertyException e) {
			System.out.println("RenewalUI constructor : property read failed");
			e.printStackTrace();
		}

		//Get the certificate details
		//Certificate certificate = Certificate.
		this.setCertificateUrl(null);
		//if (renewal.getCertificate() != null) this.setCertificateUrl(renewal.getCertificate().getUrl());
		if (renewal.getCertificate() != null) {
			this.setCertificateUrl(context + "/certificate/" + renewal.getId().toString());
			this.setCertificate(renewal.getCertificate());
			this.getCertificate().setRenewal(null);
		}
		
		//Get the invoice url
		// getUrl method is redundant until we create & store PDFs locally
		//if(renewal.getActivePaymentId().getLatestInvoice() != null)
		//	this.setInvoiceUrl(renewal.getActivePaymentId().getLatestInvoice().getUrl());
		if(renewal.getActivePaymentId().getLatestInvoice() != null) {
			//this.setInvoiceUrl(renewal.getActivePaymentId().getLatestInvoice().getUrl());
			String url = "KKKKKKKKkkk";
			if (context!=null) {
				url = context + "/invoice/" + renewal.getActivePaymentId().getId().toString(); 
			}
			this.setInvoiceUrl(url);
		}

		//Get the FeeUI
		RenewalFeeUI renewalFeeUI = new RenewalFeeUI(renewal.getRenewalFee());
		this.setRenewalFee(null); // Hide detail from frontend. Why?
		this.setRenewalFeeUI(renewalFeeUI);
		
		
		//Get the paymentUI details
		renewal.getActivePaymentId().setRenewals(null);
		renewal.getActivePaymentId().setLatestInvoice(null);
		renewal.getActivePaymentId().setInitiatedByUserId(null);
		this.setActivePaymentId(renewal.getActivePaymentId());
		
		//set patent to null use only patentUI
		
		PatentUI pui = new PatentUI(this.getPatent(),extendedDatas);
		this.setPatent(null);
		pui.setBusiness(null);
		//pui.setNotifications(null);
		pui.setNotificationUIs(null);
		
		// NOte: - at 170726, devt is not able to set following fields - so use DummyDataEngine - acTidy
		//System.out.println("   RenewalUI constructor: acDebug acINCOMPLETE - at 170726, devt is not able to set following fields - so use DummyDataEngine");
		//(new Universal()).log().debug("   RenewalUI constructor: acDebug acINCOMPLETE - at 170726, devt is not able to set following fields - so use DummyDataEngine");
/*		 * 	CurrentRenewalCost
		 * 	CostBandEndDate
		 * 	RenewalCostNextStage
		 * 	RenewalDueDate
*/
		/*DummyDataEngine dummyEngine = new DummyDataEngine();
		dummyEngine.populateExtendedPatentFieldsWithDummyData(pui, this.getPatent());*/

		this.setPatentUI(pui);
	}



	
	// Getter/setters requiring special processing

//	public List<NotificationUI> getNotificationUIs() {
//		return this.allNotificationUIs;
//		// No Setter - see createNotificationUIs()
//	}

	
	
	
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
	
	public String getRenewalDueDateUI() {
		return renewalDueDateUI;
	}
	public void setRenewalDueDateUI(String renewalDueDateUI) {
		this.renewalDueDateUI = renewalDueDateUI;
	}

	public String getCertificateUrl() {
		return certificateUrl;
	}
	public void setCertificateUrl(String certificateUrl) {
		this.certificateUrl = certificateUrl;
	}

	public PatentUI getPatentUI() {
		return patentUI;
	}
	public void setPatentUI(PatentUI patentUI) {
		this.patentUI = patentUI;
	}

	public RenewalFeeUI getRenewalFeeUI() {
		return renewalFeeUI;
	}
	public void setRenewalFeeUI(RenewalFeeUI renewalFeeUI) {
		this.renewalFeeUI = renewalFeeUI;
	}
	
	
	public String getInvoiceUrl() {
		return invoiceUrl;
	}

	public void setInvoiceUrl(String invoiceUrl) {
		this.invoiceUrl = invoiceUrl;
	}




	public boolean isRenewedSuccessfully() {
		boolean result = false;
		String status = this.getRenewalStatus();
		if (RenewalStatusEnum.RENEWAL_IN_PLACE.equalsIgnoreCase(status))
			result = true;
		return result;
	}
	
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
