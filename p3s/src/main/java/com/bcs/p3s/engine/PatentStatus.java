package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.Date;

import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.util.lang.Universal;

/**
 * Used by PatentStatusEngine to hold PatentStatus 
 *
 * Most (all?) entities are NOT primitives, such that they CAN be null, to indicate that they have not been set
 * 
 */
public class PatentStatus{

	
	/** last day of month ... */
	protected Date renewalDueDate;

	protected Date nineMonthStart;
	protected Date nineMonthEnd;

	/** patent renewal year number for this patent now */
	protected Integer activeRenewalYear;
	
	/**  */
	protected RenewalColourEnum colour = null; 
	
	/** If we can offer a price right now, this is the price ! */
	protected BigDecimal renewalPriceUSD = null;

	protected String currentRenewalStatus;
	
	/**
	 * If currentRenewalStatus is SHOW_PRICE populate the CalendarColour object for renewalDueDate
	 */
	protected CalendarColour currentColorDates;
	

	public Date getRenewalDueDate() {
		return renewalDueDate;
	}

	public void setRenewalDueDate(Date renewalDueDate) {
		this.renewalDueDate = renewalDueDate;
	}

	public Date getNineMonthStart() {
		return nineMonthStart;
	}

	public void setNineMonthStart(Date nineMonthStart) {
		this.nineMonthStart = nineMonthStart;
	}

	public Date getNineMonthEnd() {
		return nineMonthEnd;
	}

	public void setNineMonthEnd(Date nineMonthEnd) {
		this.nineMonthEnd = nineMonthEnd;
	}

	public Integer getActiveRenewalYear() {
		return activeRenewalYear;
	}

	public void setActiveRenewalYear(Integer thisYearNumber) {
		this.activeRenewalYear = thisYearNumber;
	}

	public RenewalColourEnum getColour() {
		return colour;
	}

	public void setColour(RenewalColourEnum colour) {
		this.colour = colour;
	}

	public BigDecimal getRenewalPriceUSD() {
		return renewalPriceUSD;
	}

	public void setRenewalPriceUSD(BigDecimal renewalPriceUSD) {
		this.renewalPriceUSD = renewalPriceUSD;
	}

	public String getCurrentRenewalStatus() {
		return currentRenewalStatus;
	}

	public void setCurrentRenewalStatus(String currentRenewalStatus) {
		this.currentRenewalStatus = currentRenewalStatus;
	}

	public CalendarColour getCurrentColorDates() {
		return currentColorDates;
	}

	public void setCurrentColorDates(CalendarColour currentColorDates) {
		this.currentColorDates = currentColorDates;
	}
	
	

}
