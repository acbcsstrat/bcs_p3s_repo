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
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.PatentServiceImpl;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.service.TransactionServiceImpl;
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
public class PaymentUI extends Payment {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	TransactionService transactionService = new TransactionServiceImpl();
	
	// Additional members go here

	// Constructor - converting a Payment (aka Transaction) to a PaymentUI
	public PaymentUI(Payment payment) {

		
		this.setId(payment.getId());
		this.setVersion(payment.getVersion());
		
		this.setP3S_TransRef(payment.getP3S_TransRef());  // (payment
		this.setMC_TransRef(payment.getMC_TransRef());
		this.setTransType(payment.getTransType());
		this.setInitiatedByUserId(payment.getInitiatedByUserId());
		this.setTransStartDate(payment.getTransStartDate());
		this.setTransTargetEndDate(payment.getTransTargetEndDate());
		this.setLastUpdatedDate(payment.getLastUpdatedDate());
		this.setLatestTransStatus(payment.getLatestTransStatus());
		this.setStatusDesc(payment.getStatusDesc());
		this.setLatestInvoice(payment.getLatestInvoice());
		this.setTransAmount_USD(payment.getTransAmount_USD());
		this.setIsBillingAddressSame(payment.getIsBillingAddressSame());
		this.setBillingAddressStreet(payment.getBillingAddressStreet());
		this.setBillingAddressCity(payment.getBillingAddressCity());
		this.setBillingAddressState(payment.getBillingAddressState());
		this.setBillingAddressZip(payment.getBillingAddressZip());
		

		// Now the additional fields - WHICH ARE
//		patentUI.setCurrentRenewalCost(new BigDecimal("1.11"));
//		patentUI.setCostBandEndDate(nowPlusNdays(2));
//		patentUI.setRenewalCostNextStage(new BigDecimal("1111111.11"));
//		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patent.getFilingDate()));
				
//		DummyDataEngine dummy = new DummyDataEngine();
//		System.out.println("Calling DummyDataEngine:populateExtendedPatentFieldsWithDummyData for patent "+patent.getPatentApplicationNumber());
//    	dummy.populateExtendedPatentFieldsWithDummyData(this, patent);

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
