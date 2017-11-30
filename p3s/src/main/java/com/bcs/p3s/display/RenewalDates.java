package com.bcs.p3s.display;

import java.util.Date;

import com.bcs.p3s.model.CalendarColour;

public class RenewalDates {
	
	protected Date currentWindowOpenDate;
	protected Date currentWindowCloseDate;
	
	protected Date currentRenewalDueDate;
	
	protected Date nextWindowOpenDate;
	protected Date nextWindowCloseDate;
	
	protected Date nextRenewalDueDate;
	
	protected boolean renewalWindowOpened;
	
	protected Integer renewalYear;
	
	protected CalendarColour currentColorDates;
	
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

	public Date getNextWindowCloseDate() {
		return nextWindowCloseDate;
	}

	public void setNextWindowCloseDate(Date nextWindowCloseDate) {
		this.nextWindowCloseDate = nextWindowCloseDate;
	}

	public Date getNextRenewalDueDate() {
		return nextRenewalDueDate;
	}

	public void setNextRenewalDueDate(Date nextFilingDate) {
		this.nextRenewalDueDate = nextFilingDate;
	}

	public boolean isRenewalWindowOpened() {
		return renewalWindowOpened;
	}

	public void setRenewalWindowOpened(boolean renewalWindowOpened) {
		this.renewalWindowOpened = renewalWindowOpened;
	}

	public Integer getRenewalYear() {
		return renewalYear;
	}

	public void setRenewalYear(Integer renewalYear) {
		this.renewalYear = renewalYear;
	}

	public CalendarColour getCurrentColorDates() {
		return currentColorDates;
	}

	public void setCurrentColorDates(CalendarColour currentColorDates) {
		this.currentColorDates = currentColorDates;
	}

	
	
}
