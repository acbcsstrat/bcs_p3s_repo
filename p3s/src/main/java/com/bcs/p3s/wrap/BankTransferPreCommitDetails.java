package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.PatentUI;

/**
 * Created for API action 4.2 - Checkout – Bank Transfer prior to Commit
 */
public class BankTransferPreCommitDetails {

	protected List<PatentUI> orderedPatentUIs = new ArrayList<PatentUI>();

	protected BigDecimal totalCostUSD;
	
	protected Date dateNowLocalTime;
	protected String  dateNowLocalTimeUI;

	protected Date transTargetEndDate;
	protected String transTargetEndDateUI;

	protected String warningMessage;


	
	
	
	
	// Ordinary getters & setters
	public List<PatentUI> getOrderedPatentUIs() {
		return orderedPatentUIs;
	}

	public void setOrderedPatentUIs(List<PatentUI> orderedPatentUIs) {
		this.orderedPatentUIs = orderedPatentUIs;
	}

	public BigDecimal getTotalCostUSD() {
		return totalCostUSD;
	}

	public void setTotalCostUSD(BigDecimal totalCostUSD) {
		this.totalCostUSD = totalCostUSD;
	}

	public Date getDateNowLocalTime() {
		return dateNowLocalTime;
	}

	public void setDateNowLocalTime(Date dateNowLocalTime) {
		this.dateNowLocalTime = dateNowLocalTime;
	}

	public String getDateNowLocalTimeUI() {
		return dateNowLocalTimeUI;
	}

	public void setDateNowLocalTimeUI(String dateNowLocalTimeUI) {
		this.dateNowLocalTimeUI = dateNowLocalTimeUI;
	}

	public Date getTransTargetEndDate() {
		return transTargetEndDate;
	}

	public void setTransTargetEndDate(Date transTargetEndDate) {
		this.transTargetEndDate = transTargetEndDate;
	}

	public String getTransTargetEndDateUI() {
		return transTargetEndDateUI;
	}

	public void setTransTargetEndDateUI(String transTargetEndDateUI) {
		this.transTargetEndDateUI = transTargetEndDateUI;
	}

	public String getWarningMessage() {
		return warningMessage;
	}

	public void setWarningMessage(String warningMessage) {
		this.warningMessage = warningMessage;
	}
	
	// convenience, for debugging & logging
	public String toString() {
		String CRLF = "\n";
		String tos = "BankTransferPreCommitDetails is:"+CRLF;
		String patentIDs = "  PatentIDs are";
		for (PatentUI pui : orderedPatentUIs) {
			patentIDs += ", "+pui.getId();
		}
		tos += patentIDs+CRLF;
		tos += totalCostUSD+CRLF;
		tos += "dateNowLocalTime="+dateNowLocalTime+CRLF;
		tos += dateNowLocalTimeUI+CRLF;
		tos += "transTargetEndDate="+transTargetEndDate+CRLF;
		tos += transTargetEndDateUI+CRLF;
		return tos;
	}


}
