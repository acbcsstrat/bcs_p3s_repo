package com.bcs.p3s.display;

import java.util.Date;

public class RenewalDates {
	
	private Date currentWindowOpenDate;
	private Date currentWindowCloseDate;
	
	private Date currentFilingDate;
	
	private Date nextWindowOpenDate;
	private Date nexttWindowCloseDate;
	
	private Date nextFilingDate;
	
	private boolean renewalWindowStillOpened;

	
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

	public Date getCurrentFilingDate() {
		return currentFilingDate;
	}

	public void setCurrentFilingDate(Date currentFilingDate) {
		this.currentFilingDate = currentFilingDate;
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

	public Date getNextFilingDate() {
		return nextFilingDate;
	}

	public void setNextFilingDate(Date nextFilingDate) {
		this.nextFilingDate = nextFilingDate;
	}

	public boolean isRenewalWindowStillOpened() {
		return renewalWindowStillOpened;
	}

	public void setRenewalWindowStillOpened(boolean renewalWindowStillOpened) {
		this.renewalWindowStillOpened = renewalWindowStillOpened;
	}

	
	
}
