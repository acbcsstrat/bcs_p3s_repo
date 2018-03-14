package com.bcs.p3s.wrap;

import java.math.BigDecimal;

import com.bcs.p3s.model.EpoFee;
import com.bcs.p3s.model.P3SFeeSole;

public class CombinedFee {
	
	EpoFee epoFee;
	P3SFeeSole p3sFee;
	BigDecimal fxRate;
	
	public EpoFee getEpoFee() {
		return epoFee;
	}
	public void setEpoFee(EpoFee epoFee) {
		this.epoFee = epoFee;
	}
	public P3SFeeSole getP3sFee() {
		return p3sFee;
	}
	public void setP3sFee(P3SFeeSole p3sFee) {
		this.p3sFee = p3sFee;
	}
	public BigDecimal getFxRate() {
		return fxRate;
	}
	public void setFxRate(BigDecimal fxRate) {
		this.fxRate = fxRate;
	}
	
	

}
