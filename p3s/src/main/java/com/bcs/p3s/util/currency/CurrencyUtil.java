package com.bcs.p3s.util.currency;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CurrencyUtil {

	/**
	 * 
	 * @param dollars
	 * @param fxRate how-many-dollars-to-buy-one-Euro
	 * @return
	 */
	public BigDecimal dollarsToEuro(BigDecimal dollars, BigDecimal fxRate) {
		if (dollars==null || fxRate==null || (fxRate.compareTo(BigDecimal.ZERO) <= 0)) return null;
		BigDecimal euros = dollars.divide(fxRate, 2, BigDecimal.ROUND_HALF_UP);
		return euros;
	}
	public BigDecimal euroToDollars(BigDecimal euros, BigDecimal fxRate) {
		if (euros==null || fxRate==null || (fxRate.compareTo(BigDecimal.ZERO) <= 0)) return null;
		BigDecimal dollars = euros.multiply(fxRate);
		dollars = dollars.setScale(2, BigDecimal.ROUND_HALF_UP);
		return dollars;
	}
	
	/**
	 * The rate we get from Moneycorp is dollars-to-buy-one-euro.   = ~1.2
	 * The on-screen rate, (for Americans), should be what's-a-dollar-worth-in-Euros  = ~0.8
	 * Hence this method can be used to calculate that inversion
	 * 
	 * 12/11/2018 v2.1. Rather than a totally backwards-compatible solution (existing rate provided with exisiting name, plus inverted rate provided)
	 * Pat requests that all 'rates' are provided to him inverted, using the existing names
	 *  
	 * @param rate
	 * @return
	 */
	public static BigDecimal invertRate(BigDecimal rate) {
		return BigDecimal.ONE.divide(rate, 6, RoundingMode.HALF_UP);
	}

}
