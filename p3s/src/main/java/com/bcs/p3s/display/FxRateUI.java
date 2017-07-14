package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;



// Created for API section 2.6 & 2.9
// Holds a single FX Rate, and the datetime it became effective

public class FxRateUI {

    protected 	BigDecimal 	rate;
    protected 	Date 		rateActiveDate;

    // For dev convenience
    public FxRateUI() { ; }
    public FxRateUI(BigDecimal rightnowRate, Date when) {
		rate = rightnowRate;
		rateActiveDate = when;
    }
    public String toString() {
    	return rate.toString() + "  at " + rateActiveDate.getTime();
    }

    


    // Routine Bean getters & setters
    
    public BigDecimal getRate() {
		return rate;
	}
	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}
	public Date getRateActiveDate() {
		return rateActiveDate;
	}
	public void setRateActiveDate(Date rateActiveDate) {
		this.rateActiveDate = rateActiveDate;
	}

}
