package com.bcs.p3s.display;

import java.math.BigDecimal;

import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Created for v2.1, as such data will (eventually) no longer be calculated for ALL patents on login.
 *
 */
public class costHistoryUI {

	// Reminder: rate is num USD needed to buy 1 EUR
	
	protected BigDecimal fxRateYesterday;
	protected BigDecimal subTotalEURYesterday;
	protected BigDecimal subTotalUSDYesterday;
	protected BigDecimal fxRateLastWeek;
	protected BigDecimal subTotalEURLastWeek;
	protected BigDecimal subTotalUSDLastWeek;
	protected BigDecimal fxRateLastMonth;
	protected BigDecimal subTotalEURLastMonth;
	protected BigDecimal subTotalUSDLastMonth;

	
	/**
	 * Creates a costHistoryUI for the given cost components.
	 * Note: dollarComponentUSD and euroComponentEUR have different <i>values</i>, which should be <i>added</i> together.
	 * 
	 * @param dollarComponentUSD The Dollar component of the overall fee, expressed in USD
	 * @param euroComponentEUR The Euro component of the overall fee, expressed in EUR
	 * @param rateToday The number of USD needed to buy 1 EUR
	 * @param rateYesterday
	 * @param rateLastWeek
	 * @param rateLastMonth
	 */
	public costHistoryUI(BigDecimal dollarComponentUSD, BigDecimal euroComponentEUR, 
			BigDecimal rateToday, BigDecimal rateYesterday, BigDecimal rateLastWeek, BigDecimal rateLastMonth) 
	{
		if (dollarComponentUSD==null || euroComponentEUR==null 
				|| rateToday==null || rateYesterday==null || rateLastWeek==null || rateLastMonth==null) 
		{
			throw new P3SRuntimeException("costHistoryUI passed a null : "
					+dollarComponentUSD+", "+euroComponentEUR+", "+rateToday+", "+rateYesterday+", "+rateLastWeek+", "+rateLastMonth);
		}
		
		setSubTotalEURYesterday( (dollarComponentUSD.divide(rateYesterday) ).add(euroComponentEUR));
		setSubTotalUSDYesterday(dollarComponentUSD.add( euroComponentEUR.multiply(rateYesterday) ));
		
		setSubTotalEURLastWeek( (dollarComponentUSD.divide(rateLastWeek) ).add(euroComponentEUR));
		setSubTotalUSDLastWeek(dollarComponentUSD.add( euroComponentEUR.multiply(rateLastWeek) ));
		
		setSubTotalEURLastMonth( (dollarComponentUSD.divide(rateLastMonth) ).add(euroComponentEUR));
		setSubTotalUSDLastMonth(dollarComponentUSD.add( euroComponentEUR.multiply(rateLastMonth) ));

	}

	
	// Setters that also set scale

	public void setSubTotalEURYesterday(BigDecimal subTotalEURYesterday) {
		this.subTotalEURYesterday = subTotalEURYesterday.setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	public void setSubTotalUSDYesterday(BigDecimal subTotalUSDYesterday) {
		this.subTotalUSDYesterday = subTotalUSDYesterday.setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	public void setSubTotalEURLastWeek(BigDecimal subTotalEURLastWeek) {
		this.subTotalEURLastWeek = subTotalEURLastWeek.setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	public void setSubTotalUSDLastWeek(BigDecimal subTotalUSDLastWeek) {
		this.subTotalUSDLastWeek = subTotalUSDLastWeek.setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	public void setSubTotalEURLastMonth(BigDecimal subTotalEURLastMonth) {
		this.subTotalEURLastMonth = subTotalEURLastMonth.setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	public void setSubTotalUSDLastMonth(BigDecimal subTotalUSDLastMonth) {
		this.subTotalUSDLastMonth = subTotalUSDLastMonth.setScale(2, BigDecimal.ROUND_HALF_UP);
	}

	
	// Ordinary getters/setters
	
	public BigDecimal getFxRateYesterday() {
		return fxRateYesterday;
	}
	public void setFxRateYesterday(BigDecimal fxRateYesterday) {
		this.fxRateYesterday = fxRateYesterday;
	}
	public BigDecimal getSubTotalEURYesterday() {
		return subTotalEURYesterday;
	}
	public BigDecimal getSubTotalUSDYesterday() {
		return subTotalUSDYesterday;
	}
	public BigDecimal getFxRateLastWeek() {
		return fxRateLastWeek;
	}
	public void setFxRateLastWeek(BigDecimal fxRateLastWeek) {
		this.fxRateLastWeek = fxRateLastWeek;
	}
	public BigDecimal getSubTotalEURLastWeek() {
		return subTotalEURLastWeek;
	}
	public BigDecimal getSubTotalUSDLastWeek() {
		return subTotalUSDLastWeek;
	}
	public BigDecimal getFxRateLastMonth() {
		return fxRateLastMonth;
	}
	public void setFxRateLastMonth(BigDecimal fxRateLastMonth) {
		this.fxRateLastMonth = fxRateLastMonth;
	}
	public BigDecimal getSubTotalEURLastMonth() {
		return subTotalEURLastMonth;
	}
	public BigDecimal getSubTotalUSDLastMonth() {
		return subTotalUSDLastMonth;
	}

	
}
