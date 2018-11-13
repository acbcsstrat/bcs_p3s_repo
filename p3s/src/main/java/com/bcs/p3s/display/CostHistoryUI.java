package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.util.currency.CurrencyUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Created for v2.1, as such data will (eventually) no longer be calculated for ALL patents on login.
 *
 * Note: This is a *UI object, to RATE values provided will have already been inverted 
 * - i.e. WhatEurosDoes1DollarBuy - i.e. = ~0.8
 *  
 * v2.1 - Nov2018 - This is currently the ONLY place in the application where calculations are performed on the WhatEurosDoes1DollarBuy rate
 *  rather than the  dollarsfor1EuroRate
 *  
 */
public class CostHistoryUI {

	// Reminder: rate HEREis num USD needed to buy 1 EUR
	
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
	 * Convenience constructor. Creates a costHistoryUI for the given fees.
	 * 
	 * This gets the required fxRates from the db
	 */
	public CostHistoryUI(FeeCurrencyComponents fees) {
		if (fees==null) throw new P3SRuntimeException("costHistoryUI passed a null.");

		populateHistoricRates();

		// Reminder: Rate inverted to usual usage
		setSubTotalEURYesterday( (fees.getDollarComponentUSD().multiply(fxRateYesterday) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDYesterday(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().divide(fxRateYesterday,2,RoundingMode.HALF_UP) ));
		
		setSubTotalEURLastWeek( (fees.getDollarComponentUSD().multiply(fxRateLastWeek) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDLastWeek(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().divide(fxRateLastWeek,2,RoundingMode.HALF_UP) ));
		
		setSubTotalEURLastMonth( (fees.getDollarComponentUSD().multiply(fxRateLastMonth) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDLastMonth(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().divide(fxRateLastMonth,2,RoundingMode.HALF_UP) ));
	}

	
	
	// Internal methods
	
	protected void populateHistoricRates() {
		Date today = new Date();
		LocalDate ldToday = today.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate ldYesterday = ldToday.minusDays(1);
		LocalDate ldWeekAgo = ldToday.minusWeeks(1);
		LocalDate ldMonthAgo = ldToday.minusMonths(1);

		Date yesterday = Date.from(ldYesterday.atStartOfDay(ZoneId.systemDefault()).toInstant());
		Date weekAgo = Date.from(ldWeekAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());
		Date monthAgo = Date.from(ldMonthAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());
		
		// Set as WhatEurosDoes1DollarBuy rate
		BigDecimal disRate = getSafeRate(yesterday);
		setFxRateYesterday(CurrencyUtil.invertRate(disRate));
		disRate = getSafeRate(weekAgo);
		setFxRateLastWeek(CurrencyUtil.invertRate(disRate));
		disRate = getSafeRate(monthAgo);
		setFxRateLastMonth(CurrencyUtil.invertRate(disRate));
		
		protectAgainstMissingDayRates();
	}
	protected BigDecimal getSafeRate(Date when) { // Avoid nulls due to missing rate history data (which will occur on DEV PCs)
		BigDecimal result = getHistoricRateOrNull(when);
		if (result==null) result = GlobalVariableSole.findOnlyGlobalVariableSole().getCurrent_P3S_rate();
		return result;
	}
	/**
	 * Provides the 'usual' dollarsfor1EuroRate rate
	 * @param historicDate
	 * @return
	 */
	protected BigDecimal getHistoricRateOrNull(Date historicDate) {
		// Protect against missing day rates (shouldn't happen, but possible)
		BigDecimal historicRateOrNull = null;
		try {
			ArchivedRate rateObj = ArchivedRate.findArchivedRateForDate(historicDate);
			historicRateOrNull = rateObj.getFxRate_P3s();
		} catch (Exception e) { /* swallow */ }
		return historicRateOrNull;
	}
	protected void protectAgainstMissingDayRates() {
		// Shouldn't ever happen, but might (& will on dev PCs)
		// So actions here are Least-Worst fix (don't break site, don't show outlandish data)
		if (isRateEmpty(fxRateYesterday) && isRateEmpty(fxRateLastWeek)) {
			fxRateYesterday = GlobalVariableSole.findOnlyGlobalVariableSole().getCurrent_P3S_rate();
		}
		if (isRateEmpty(fxRateLastWeek)) fxRateLastWeek = fxRateYesterday;
		if (isRateEmpty(fxRateLastMonth)) fxRateLastMonth = fxRateLastWeek;
	}
	protected boolean isRateEmpty(BigDecimal aRate) {
		if (aRate==null || aRate.compareTo(BigDecimal.ZERO) <= 0) return true;
		else return false;
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
