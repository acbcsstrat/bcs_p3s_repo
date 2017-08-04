package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.Date;

import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.util.lang.Universal;

/**
 * Used by PatentStatusEngine to hold PatentStatus 
 *
 * Most (all?) entities are NOT primitives, such that they CAN be null, to indicate that they have not been set
 * 
 */
public class PatentStatus extends Universal {

	/** Are we able to offer a price to renew this patent */
	protected Boolean canRenew = null;   

	/** Are outside the annual 9month renewal window */
	protected Boolean doldrums = null;
	
	/** last day of month ... */
	protected Date renewalDueDate;

	protected Date nineMonthStart;
	protected Date nineMonthEnd;

	/** EPO confirm patent has been renewed for this patent year number */
	protected Integer epoYearNumberRenewed; // Integer so can be null
	
	/** patent renewal year number for this patent now */
	protected Integer thisYearNumber; 
	
	/** EPO confirm year n renewed & this is year n+1 */
	protected Boolean goodFollowOn = null; 

	/**
	 * For 'this' year number, we already have a renewal in progress
	 * Note: a 'failed' (i.e. didn't pay in time) renewal does Not qualify here
	 */
	protected Boolean alreadyRenewing = null;
	
	/**
	 * For 'this' year number, we have already completed a renewal.
	 */
	protected Boolean alreadyRenewed = null;
	
	/**  */
	protected RenewalColourEnum colour = null; 
	
	/** If we can offer a price right now, this is the price ! */
	protected BigDecimal renewalPriceUSD = null;

	protected String currentRenewalStatus;

	
//	/**  */
//	protected 
//	
//	/**  */
//	protected 
	
	
	
	
	
	

	// routine bean getters & setters
	public Boolean getCanRenew() {
		return canRenew;
	}

	public void setCanRenew(Boolean canRenew) {
		this.canRenew = canRenew;
	}

	public Boolean getDoldrums() {
		return doldrums;
	}

	public void setDoldrums(Boolean doldrums) {
		this.doldrums = doldrums;
	}

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

	public Integer getEpoYearNumberRenewed() {
		return epoYearNumberRenewed;
	}

	public void setEpoYearNumberRenewed(Integer epoYearNumberRenewed) {
		this.epoYearNumberRenewed = epoYearNumberRenewed;
	}

	public Integer getThisYearNumber() {
		return thisYearNumber;
	}

	public void setThisYearNumber(Integer thisYearNumber) {
		this.thisYearNumber = thisYearNumber;
	}

	public Boolean getGoodFollowOn() {
		return goodFollowOn;
	}

	public void setGoodFollowOn(Boolean goodFollowOn) {
		this.goodFollowOn = goodFollowOn;
	}

	public Boolean getAlreadyRenewing() {
		return alreadyRenewing;
	}

	public void setAlreadyRenewing(Boolean alreadyRenewing) {
		this.alreadyRenewing = alreadyRenewing;
	}

	public Boolean getAlreadyRenewed() {
		return alreadyRenewed;
	}

	public void setAlreadyRenewed(Boolean alreadyRenewed) {
		this.alreadyRenewed = alreadyRenewed;
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
	
	

}
