package com.bcs.p3s.display;

import java.math.BigDecimal;

import com.bcs.p3s.util.lang.Universal;

/*
 * Most fees consist of USD elements & EUR elements.
 * The fxRate affects one, & not the other, depending on which currency is required.
 * This convenience abstract class simplifies such processing
 * 
 * For Clarification : dollarComponentUSD and euroComponentEUR have different <i>values</i>, which should be <i>added</i> together.
 */
public abstract class FeeCurrencyComponents extends Universal {

	protected BigDecimal dollarComponentUSD = BigDecimal.ZERO;	// The Dollar component of the overall fee, expressed in USD
	protected BigDecimal euroComponentEUR   = BigDecimal.ZERO;	// The Euro component of the overall fee, expressed in EUR
	protected BigDecimal currentOfficialFeeUSD   = BigDecimal.ZERO;	// The Euro component of the overall fee, expressed in USD (see comment below)
	
	
	// abstract methods

	public abstract void setDollarComponentUSD();
	public abstract void setEuroComponentEUR(BigDecimal rate); // This now sets euroComponentEUR AND currentOfficialFeeUSD. Rate param is a reminder of this  

	
	// methods

	public BigDecimal safeAddition(BigDecimal notNullNum, BigDecimal mightBeNull) {
		if (mightBeNull==null) return notNullNum;
		return notNullNum.add(mightBeNull);
	}
	protected void checkRateFeasable(BigDecimal rate) {
		if (rate==null) fail(CLASSNAME+"checkRateFeasable() given null as rate");
		if (rate.compareTo(new BigDecimal("0.1")) < 0) { // Confirm not near-Zero. 0.1=Extreme. Expect roughly 1.2
			log().error(CLASSNAME+"checkRateFeasable() given unFeasable rate");
			fail(CLASSNAME+"checkRateFeasable() unFeasable rate is "+rate.toString());
		}
	}
	public BigDecimal getEuroComponentUSD(BigDecimal rate) {
		checkRateFeasable(rate);
		return getEuroComponentEUR().multiply(rate);
	}
	
	// 181211 Pat requests further items: currentOfficialFeeEUR & currentOfficialFeeUSD. Implement as extra one property & getters (+ required code change). Implement latter by duplicate getter for euroComponentEUR 

	
	
	// Special Getter
	public BigDecimal getCurrentOfficialFeeEUR() {
		return euroComponentEUR;
	}
	
	
	// Ordinary getters. (Setters are abstract)

	public BigDecimal getDollarComponentUSD() {
		return dollarComponentUSD;
	}
	public BigDecimal getEuroComponentEUR() {
		return euroComponentEUR;
	}
	public BigDecimal getCurrentOfficialFeeUSD() {
		return currentOfficialFeeUSD;
	}
	
}
