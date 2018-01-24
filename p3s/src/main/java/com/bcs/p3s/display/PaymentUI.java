package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.apache.commons.digester.ExtendedBaseRules;
import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.enump3s.McFailCodeEnum;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.model.Invoice;
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
import com.bcs.p3s.wrap.PatentExtendedData;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING (i.e. cannot be (reliably) set by this class):
 * 		None
 * 
 * Further notes specific to this class:
 * 		None
 * 
 * 
 * @author andyc
 *
 */


// Note: because of near-circular relationships, objects could get VERY large.
// To prevent this breaking the JSON representations, certain fields, which are not needed, are deliberately nulled in the PaymentUI constructor 



public class PaymentUI extends Payment {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	TransactionService transactionService = new TransactionServiceImpl();
	
	// Additional UI members go here

    private String transStartDateUI;
    private String transTargetEndDateUI;
    private String lastUpdatedDateUI;
    private String invoiceUrl;
    private List<RenewalUI> renewalUIs = new ArrayList<RenewalUI>();

	
    
	// Constructor - converting a Payment (aka Transaction) to a PaymentUI
	public PaymentUI(Payment payment, List<PatentExtendedData> sessionData) {
		
		this.setId(payment.getId());
		this.setVersion(payment.getVersion());
		
		this.setP3S_TransRef(payment.getP3S_TransRef());  // (payment
		this.setMC_TransRef(null); // See JavaDoc for Payment:MC_TransRef
		this.setTransType(payment.getTransType());
		this.setInitiatedByUserId(payment.getInitiatedByUserId());
		this.setTransStartDate(payment.getTransStartDate());
		this.setTransTargetEndDate(payment.getTransTargetEndDate());
		this.setLastUpdatedDate(payment.getLastUpdatedDate());
		this.setLatestTransStatus(payment.getLatestTransStatus());

		this.setHasFailed(payment.getHasFailed());
		String failReason = payment.getFailureReason();
		if (payment.getHasFailed() && isEmpty(failReason) ) {
			McFailCodeEnum mcEnum = new McFailCodeEnum(payment.getMC_failCode());
			failReason = mcEnum.toCustomerFacingString();
		}
		this.setFailureReason(failReason);

		Invoice invoice = payment.getLatestInvoice();
		invoice.setPayment(null);
		invoice.setPreceedingInvoiceId(null);
		this.setLatestInvoice(invoice);
		
		this.setTransAmount_USD(payment.getTransAmount_USD());
		this.setIsBillingAddressSame(payment.getIsBillingAddressSame());
		this.setBillingAddressStreet(payment.getBillingAddressStreet());
		this.setBillingAddressCity(payment.getBillingAddressCity());
		this.setBillingAddressState(payment.getBillingAddressState());
		this.setBillingAddressZip(payment.getBillingAddressZip());
		this.setRenewals(null);   // Don't need Renewals, Just RenewalUIs
		//everytime when sending paymentUI to FE make fx_target to null -- hide the value from user
		this.setFxTarget(null);
		
		// Now the additional fields - WHICH ARE
		this.setTransStartDateUI((new DateUtil()).dateToUSStringWithDayOfWeek(this.getTransStartDate()));
		this.setTransTargetEndDateUI((new DateUtil()).dateToUSStringWithDayOfWeek(this.getTransTargetEndDate()));
		this.setLastUpdatedDateUI((new DateUtil()).dateToUSStringWithDayOfWeek(this.getLastUpdatedDate()));
		// setInvoiceUrl() occurs below
		
		List<Renewal> rens =  payment.getRenewals();
		for (Renewal aRenewal : rens) {
			// Remove unwant data that would break the JSON
			RenewalUI aRenUI = new RenewalUI(aRenewal,sessionData);
			aRenUI.setPatent(null);
			aRenUI.setActivePaymentId(null);
			//aRenUI.getFee().setRenewal(null); 
			// now remove data that doesn't break anything - but which is large, and we just don't need it
			//aRenUI.getPatentUI().setNotifications(null);
			aRenUI.getPatentUI().setNotificationUIs(null);
			
			this.getRenewalUIs().add(aRenUI);
			// Warning: at 170726 is not possible to populate those 4 extra PatentUI fields !   - acToDo
			//System.out.println("Warning: at 170726 is not possible to populate those 4 extra PatentUI fields !   - acToDo");
		}

//		patentUI.setCurrentRenewalCost(new BigDecimal("1.11")); // acTidy
//		patentUI.setCostBandEndDate(nowPlusNdays(2));
//		patentUI.setRenewalCostNextStage(new BigDecimal("1111111.11"));
//		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patent.getFilingDate()));

		
		// Read web context (for URLs) 0 from property file
		String context = null;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			context = reader.getGenericProperty(P3SPropertyNames.P3S_WEB_CONTEXT); 
		} catch (P3SPropertyException e) {
			System.out.println("PaymentUI constructor : property read failed");
			e.printStackTrace();
		}
		// Set the invoice url
		String url = (context==null) ? "" : context;
		url += ("/invoice/" + this.getId().toString()); 
		this.setInvoiceUrl(url);
		
	}

	
	
	
	
	
	// Special methods
	
	public boolean isHistoric() {
		boolean result = false;
		String status = this.getLatestTransStatus();
		if (PaymentStatusEnum.COMPLETED.equalsIgnoreCase(status)
				|| this.getHasFailed()) {
			result = true;
		}
		return result;
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

	public String getTransStartDateUI() {
		return transStartDateUI;
	}
	public void setTransStartDateUI(String transStartDateUI) {
		this.transStartDateUI = transStartDateUI;
	}
	
	public String getTransTargetEndDateUI() {
		return transTargetEndDateUI;
	}
	public void setTransTargetEndDateUI(String transTargetEndDateUI) {
		this.transTargetEndDateUI = transTargetEndDateUI;
	}
	
	public String getLastUpdatedDateUI() {
		return lastUpdatedDateUI;
	}
	public void setLastUpdatedDateUI(String lastUpdatedDateUI) {
		this.lastUpdatedDateUI = lastUpdatedDateUI;
	}
	public String getInvoiceUrl() {
		return invoiceUrl;
	}
	public void setInvoiceUrl(String invoiceUrl) {
		this.invoiceUrl = invoiceUrl;
	}
	public List<RenewalUI> getRenewalUIs() {
		return renewalUIs;
	}
	public void setRenewalUIs(List<RenewalUI> renewalUIs) {
		this.renewalUIs = renewalUIs;
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

	public boolean isEmpty(String val) {
		if (val==null || val.trim().length()==0) return true;
		return false;
	}

}
