package com.bcs.p3s.util.currency;

import java.math.BigDecimal;
import java.math.RoundingMode;

import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

public class CurrencyUtil extends Universal {

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
	 * 12/11/2018 v2.1. Rather than a totally backwards-compatible solution (existing rate provided with existing name, plus inverted rate provided)
	 * Pat requests that all 'rates' are provided to him inverted, using the existing names
	 *  
	 * @param rate
	 * @return
	 */
	public static BigDecimal invertRate(BigDecimal rate) {
		if (rate==null) throw new P3SRuntimeException("CurrencyUtil.invertRate() passed NULL. Would NPE");
		return BigDecimal.ONE.divide(rate, 6, RoundingMode.HALF_UP);
	}
	/**
	 * As per invertRate(). But if 'rate' is null, use the default (NOT already inverted) rate provided.
	 * If THAT is null, use todays rate 
	 * @param rate to invert. May be null.
	 * @param a default rate to use, if rate is null. May also be null.
	 * @return inverted rate
	 */
	public static BigDecimal invertRateWithDefaults(BigDecimal rate, BigDecimal previous) { // if null, return null.
		if (rate==null && previous==null) {
			return invertRate(GlobalVariableSole.findOnlyGlobalVariableSole().getCurrent_P3S_rate());
		}
		else if (rate==null) {
			return invertRate(previous);
		}
		else return invertRate(rate);
	}

}
