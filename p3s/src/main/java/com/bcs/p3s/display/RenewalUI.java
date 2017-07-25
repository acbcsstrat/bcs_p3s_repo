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
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.PatentServiceImpl;
import com.bcs.p3s.service.TransactionService;
import com.bcs.p3s.service.TransactionServiceImpl;
import com.bcs.p3s.util.date.DateUtil;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING:
// * 	CurrentRenewalCost
// * 	CostBandEndDate
// * 	RenewalCostNextStage
// * 	RenewalDueDate
// * 
// * Further notes specific to this class:
// * 
// *   Agreed 6th June 2017 that a request for multiple patents would include, within each patent, 
// *   all the required data for the 'view patent' page.
// *   Hence this extended class contains all the notifications, et al
// * 
 * 
 * @author andyc
 *
 */
public class RenewalUI extends Renewal {

//    @Autowired
//    PatentService patentService;  //Service which will do all data retrieval/manipulation work
	TransactionService transactionService = new TransactionServiceImpl();
	
	// Additional UI members go here

    private String renewalDueDateUI;


    
    
	// Constructor - converting a Renewal to a RenewalUI
	public RenewalUI(Renewal renewal) {

		
		this.setId(renewal.getId());
		this.setVersion(renewal.getVersion());

		this.setPatent(renewal.getPatent());
		this.setActivePaymentId(renewal.getActivePaymentId());
		this.setFee(renewal.getFee());
		this.setCertificate(renewal.getCertificate());
		this.setRenewalYear(renewal.getRenewalYear());
		this.setRenewalDueDate(renewal.getRenewalDueDate());
		this.setRenewalPeriod(renewal.getRenewalPeriod());
		this.setRenewalStatus(renewal.getRenewalStatus());
		this.setRenewalAttemptsMade(renewal.getRenewalAttemptsMade());
		

		// Now the additional fields - WHICH ARE
		this.setRenewalDueDateUI((new DateUtil()).dateToUSStringWithDayOfWeek(this.getRenewalDueDate()));
		
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
	
	public String getRenewalDueDateUI() {
		return renewalDueDateUI;
	}
	
	public void setRenewalDueDateUI(String renewalDueDateUI) {
		this.renewalDueDateUI = renewalDueDateUI;
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
