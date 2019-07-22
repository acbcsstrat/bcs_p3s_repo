package com.bcs.p3s.wrap;

import java.math.BigDecimal;

import com.bcs.p3s.model.EpoRenewalFee;
import com.bcs.p3s.model.P3SFeeSole;

public class CombinedFee {
	
	EpoRenewalFee epoRenewalFee;
	P3SFeeSole p3sFee;
	BigDecimal fxRate;
	
	public EpoRenewalFee getEpoRenewalFee() {
		return epoRenewalFee;
	}
	public void setEpoRenewalFee(EpoRenewalFee epoRenewalFee) {
		this.epoRenewalFee = epoRenewalFee;
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
