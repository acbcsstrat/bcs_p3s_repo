package com.bcs.p3s.display;

import java.math.BigDecimal;

public abstract class FeeCurrencyComponents {

	protected BigDecimal dollarComponentUSD;	// The Dollar component of the overall fee, expressed in USD
	protected BigDecimal euroComponentEUR ; 	// The Euro component of the overall fee, expressed in EUR

	
	// methods
	public abstract void setDollarComponentUSD();
	public abstract void setEuroComponentEUR();

	public BigDecimal safeAddition(BigDecimal notNullNum, BigDecimal mightBeNull) {
		if (mightBeNull==null) return notNullNum;
		return notNullNum.add(mightBeNull);
	}
	
	
	// Ordinary getters. (Setters are abstract)

	public BigDecimal getDollarComponentUSD() {
		return dollarComponentUSD;
	}
	public BigDecimal getEuroComponentEUR() {
		return euroComponentEUR;
	}
	
}
