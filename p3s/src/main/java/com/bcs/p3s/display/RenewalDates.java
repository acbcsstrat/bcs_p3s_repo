package com.bcs.p3s.display;

import java.util.Date;

public class RenewalDates {
	
	private Date currentWindowOpenDate;
	private Date currentWindowCloseDate;
	
	private Date currentRenewalDueDate;
	
	private Date nextWindowOpenDate;
	private Date nexttWindowCloseDate;
	
	private Date nextRenewalDueDate;
	
	private Date previousWindowOpenDate;
	private Date previousWindowCloseDate;
	
	private Date previousRenewalDueDate;
	
	private boolean renewalWindowStillOpened;
	
	private Integer renewalYear;

	
	public Date getCurrentWindowOpenDate() {
		return currentWindowOpenDate;
	}

	public void setCurrentWindowOpenDate(Date currentWindowOpenDate) {
		this.currentWindowOpenDate = currentWindowOpenDate;
	}

	public Date getCurrentWindowCloseDate() {
		return currentWindowCloseDate;
	}

	public void setCurrentWindowCloseDate(Date currentWindowCloseDate) {
		this.currentWindowCloseDate = currentWindowCloseDate;
	}

	public Date getCurrentRenewalDueDate() {
		return currentRenewalDueDate;
	}

	public void setCurrentRenewalDueDate(Date currentFilingDate) {
		this.currentRenewalDueDate = currentFilingDate;
	}

	
	
	public Date getNextWindowOpenDate() {
		return nextWindowOpenDate;
	}

	public void setNextWindowOpenDate(Date nextWindowOpenDate) {
		this.nextWindowOpenDate = nextWindowOpenDate;
	}

	public Date getNexttWindowCloseDate() {
		return nexttWindowCloseDate;
	}

	public void setNexttWindowCloseDate(Date nexttWindowCloseDate) {
		this.nexttWindowCloseDate = nexttWindowCloseDate;
	}

	public Date getNextRenewalDueDate() {
		return nextRenewalDueDate;
	}

	public void setNextRenewalDueDate(Date nextFilingDate) {
		this.nextRenewalDueDate = nextFilingDate;
	}

	public boolean isRenewalWindowStillOpened() {
		return renewalWindowStillOpened;
	}

	public void setRenewalWindowStillOpened(boolean renewalWindowStillOpened) {
		this.renewalWindowStillOpened = renewalWindowStillOpened;
	}

	public Date getPreviousWindowOpenDate() {
		return previousWindowOpenDate;
	}

	public void setPreviousWindowOpenDate(Date previousWindowOpenDate) {
		this.previousWindowOpenDate = previousWindowOpenDate;
	}

	public Date getPreviousWindowCloseDate() {
		return previousWindowCloseDate;
	}

	public void setPreviousWindowCloseDate(Date previousWindowCloseDate) {
		this.previousWindowCloseDate = previousWindowCloseDate;
	}

	public Date getPreviousRenewalDueDate() {
		return previousRenewalDueDate;
	}

	public void setPreviousRenewalDueDate(Date previousRenewalDueDate) {
		this.previousRenewalDueDate = previousRenewalDueDate;
	}

	public Integer getRenewalYear() {
		return renewalYear;
	}

	public void setRenewalYear(Integer renewalYear) {
		this.renewalYear = renewalYear;
	}

	
	
}
