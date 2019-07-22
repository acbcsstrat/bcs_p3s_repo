package com.bcs.p3s.display;

import java.math.BigDecimal;

// Created for API section 2.6
// Holds the current rate (i.e. Today's) and the last/previous rate (i.e. yesterdays)


public class FxRateCurrentUI {

	protected	FxRateUI  currentFXRate;
	protected	FxRateUI  lastFXRate;
	

    // Routine Bean getters & setters

	public FxRateUI getCurrentFXRate() {
		return currentFXRate;
	}
	public void setCurrentFXRate(FxRateUI currentFXRate) {
		this.currentFXRate = currentFXRate;
	}
	public FxRateUI getLastFXRate() {
		return lastFXRate;
	}
	public void setLastFXRate(FxRateUI lastFXRate) {
		this.lastFXRate = lastFXRate;
	}

}
