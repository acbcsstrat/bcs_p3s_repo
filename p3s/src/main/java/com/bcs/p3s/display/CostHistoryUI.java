package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Created for v2.1, as such data will (eventually) no longer be calculated for ALL patents on login.
 *
 */
public class CostHistoryUI {

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
	 * Convenience constructor. Creates a costHistoryUI for the given fees.
	 * 
	 * This gets the required fxRates from the db
	 */
	public CostHistoryUI(FeeCurrencyComponents fees) {
		if (fees==null) throw new P3SRuntimeException("costHistoryUI passed a null.");

		populateHistoricRates();

		BigDecimal ddollars = fees.getDollarComponentUSD();
		BigDecimal rateYest = fxRateYesterday;
		BigDecimal eeuros = fees.getEuroComponentEUR();
		BigDecimal operand = ddollars;
		operand = operand.divide(rateYest,2,RoundingMode.HALF_UP);
		operand = operand.add(eeuros);
		
		setSubTotalEURYesterday( (fees.getDollarComponentUSD().divide(fxRateYesterday,2,RoundingMode.HALF_UP) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDYesterday(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().multiply(fxRateYesterday) ));
		
		setSubTotalEURLastWeek( (fees.getDollarComponentUSD().divide(fxRateLastWeek,2,RoundingMode.HALF_UP) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDLastWeek(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().multiply(fxRateLastWeek) ));
		
		setSubTotalEURLastMonth( (fees.getDollarComponentUSD().divide(fxRateLastMonth,2,RoundingMode.HALF_UP) ).add(fees.getEuroComponentEUR()));
		setSubTotalUSDLastMonth(fees.getDollarComponentUSD().add( fees.getEuroComponentEUR().multiply(fxRateLastMonth) ));
	}

	
//	// Redundant less-convenient constructor
//	/**
//	 * Creates a costHistoryUI for the given cost components.
//	 * Note: dollarComponentUSD and euroComponentEUR have different <i>values</i>, which should be <i>added</i> together.
//	 * 
//	 * @param dollarComponentUSD The Dollar component of the overall fee, expressed in USD
//	 * @param euroComponentEUR The Euro component of the overall fee, expressed in EUR
//	 * @param rateToday The number of USD needed to buy 1 EUR
//	 * @param rateYesterday
//	 * @param rateLastWeek
//	 * @param rateLastMonth
//	 */
//	public costHistoryUI(BigDecimal dollarComponentUSD, BigDecimal euroComponentEUR, 
//			BigDecimal rateToday, BigDecimal rateYesterday, BigDecimal rateLastWeek, BigDecimal rateLastMonth) 
//	{
//		if (dollarComponentUSD==null || euroComponentEUR==null 
//				|| rateToday==null || rateYesterday==null || rateLastWeek==null || rateLastMonth==null) 
//		{
//			throw new P3SRuntimeException("costHistoryUI passed a null : "
//					+dollarComponentUSD+", "+euroComponentEUR+", "+rateToday+", "+rateYesterday+", "+rateLastWeek+", "+rateLastMonth);
//		}
//		
//		setSubTotalEURYesterday( (dollarComponentUSD.divide(rateYesterday) ).add(euroComponentEUR));
//		setSubTotalUSDYesterday(dollarComponentUSD.add( euroComponentEUR.multiply(rateYesterday) ));
//		
//		setSubTotalEURLastWeek( (dollarComponentUSD.divide(rateLastWeek) ).add(euroComponentEUR));
//		setSubTotalUSDLastWeek(dollarComponentUSD.add( euroComponentEUR.multiply(rateLastWeek) ));
//		
//		setSubTotalEURLastMonth( (dollarComponentUSD.divide(rateLastMonth) ).add(euroComponentEUR));
//		setSubTotalUSDLastMonth(dollarComponentUSD.add( euroComponentEUR.multiply(rateLastMonth) ));
//
//	} acTidy

	
	
	
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
		
		setFxRateYesterday(getHistoricRateOrNull(yesterday));
		setFxRateLastWeek(getHistoricRateOrNull(weekAgo));
		setFxRateLastMonth(getHistoricRateOrNull(monthAgo));
		protectAgainstMissingDayRates();
	}
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
