package com.bcs.p3s.display;

import java.util.List;

import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.wrap.PatentExtendedData;

/**
 * A wrapper around PatentUI needed for the additional fields added for v2.1
 * 
 * Note: PatentUI attempted to largely populated itself
 * This is not possible here. Client is responsible for ensuring this is appropriately populated.
 * Hence this being a separate class
 * 
 * @author andyc
 *
 */
public class PatentV2UI extends PatentUI {

	protected PortfolioUI  portfolioUI;
	
	protected String form1200PdfUrl;  // existing simile is: "invoiceUrl":"/p3sweb/invoice/34" 
	
	protected Integer renewalStageProgress;		// Integer percentage from last colour-change to next. Not used if in Grey
	protected Integer form1200StageProgress;
	
	protected Form1200FeeUI form1200FeeUI;		// null unless Form1200 sale is viable
	
	protected List<NotificationUI> renewalNotificationUIs;
	protected List<NotificationUI> form1200NotificationUIs;
	
	
	
	
	// Constructor - converting a Patent to a PatentUI
	public PatentV2UI(Patent patent, List<PatentExtendedData> extendedDatas) {
		super(patent, extendedDatas);

		
	}


	
	
	
	// Getter/setters requiring special processing

	
	
	
	// Getter/setters that return String version of typed fields - for UI convenience

	public String getInternationalFilingDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getInternationalFilingDate());
		return res;
	}
	public String getPriorityDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getPriorityDate());
		return res;
	}

	
	
	// Ordinary getters/setters

	public PortfolioUI getPortfolioUI() {
		return portfolioUI;
	}
	public void setPortfolioUI(PortfolioUI portfolioUI) {
		this.portfolioUI = portfolioUI;
	}
	public String getForm1200PdfUrl() {
		return form1200PdfUrl;
	}
	public void setForm1200PdfUrl(String form1200PdfUrl) {
		this.form1200PdfUrl = form1200PdfUrl;
	}
	public Integer getRenewalStageProgress() {
		return renewalStageProgress;
	}
	public void setRenewalStageProgress(Integer renewalStageProgress) {
		this.renewalStageProgress = renewalStageProgress;
	}
	public Integer getForm1200StageProgress() {
		return form1200StageProgress;
	}
	public void setForm1200StageProgress(Integer form1200StageProgress) {
		this.form1200StageProgress = form1200StageProgress;
	}
	public Form1200FeeUI getForm1200FeeUI() {
		return form1200FeeUI;
	}
	public void setForm1200FeeUI(Form1200FeeUI form1200FeeUI) {
		this.form1200FeeUI = form1200FeeUI;
	}
	public List<NotificationUI> getRenewalNotificationUIs() {
		return renewalNotificationUIs;
	}
	public void setRenewalNotificationUIs(List<NotificationUI> renewalNotificationUIs) {
		this.renewalNotificationUIs = renewalNotificationUIs;
	}
	public List<NotificationUI> getForm1200NotificationUIs() {
		return form1200NotificationUIs;
	}
	public void setForm1200NotificationUIs(List<NotificationUI> form1200NotificationUIs) {
		this.form1200NotificationUIs = form1200NotificationUIs;
	}
	
	
}
