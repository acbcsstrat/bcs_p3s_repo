package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;



// Created for API section 2.6
// Exists purely to provide structure to the JSON file

public class FxRateUI {

    private BigDecimal 	currentRate;
    private Date 		currentRateActiveDate;
    private BigDecimal 	lastRate;
    private Date 		lastRateActiveDate;




    // Routine Bean getters & setters

    public BigDecimal getCurrentRate() {
		return currentRate;
	}
	public void setCurrentRate(BigDecimal currentRate) {
		this.currentRate = currentRate;
	}
	public Date getCurrentRateActiveDate() {
		return currentRateActiveDate;
	}
	public void setCurrentRateActiveDate(Date currentRateActiveDate) {
		this.currentRateActiveDate = currentRateActiveDate;
	}
	public BigDecimal getLastRate() {
		return lastRate;
	}
	public void setLastRate(BigDecimal lastRate) {
		this.lastRate = lastRate;
	}
	public Date getLastRateActiveDate() {
		return lastRateActiveDate;
	}
	public void setLastRateActiveDate(Date lastRateActiveDate) {
		this.lastRateActiveDate = lastRateActiveDate;
	}

}
