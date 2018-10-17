package com.bcs.p3s.util.currency;

import java.math.BigDecimal;

public class CurrencyUtil {

	public BigDecimal dollarsToEuro(BigDecimal dollars, BigDecimal fxRate) {
		if (dollars==null || fxRate==null || (fxRate.compareTo(BigDecimal.ZERO) <= 0)) return null;
		BigDecimal euros = dollars.divide(fxRate, 2, BigDecimal.ROUND_HALF_UP);
		return euros;
	}
	public BigDecimal euroToDollars(BigDecimal euros, BigDecimal fxRate) {
		if (euros==null || fxRate==null || (fxRate.compareTo(BigDecimal.ZERO) <= 0)) return null;
		BigDecimal dollars = euros.multiply(fxRate);
		return dollars;
	}

}
