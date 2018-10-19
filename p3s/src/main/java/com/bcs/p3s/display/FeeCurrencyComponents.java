package com.bcs.p3s.display;

import java.math.BigDecimal;

/*
 * Most fees consist of USD elements & EUR elements.
 * The fxRate affects one, & not the other, depending on which currency is required.
 * This convenience abstract class simplifies such processing
 * 
 * For Clarification : dollarComponentUSD and euroComponentEUR have different <i>values</i>, which should be <i>added</i> together.
 */
public abstract class FeeCurrencyComponents {

	protected BigDecimal dollarComponentUSD = BigDecimal.ZERO;	// The Dollar component of the overall fee, expressed in USD
	protected BigDecimal euroComponentEUR   = BigDecimal.ZERO;	// The Euro component of the overall fee, expressed in EUR

	
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
