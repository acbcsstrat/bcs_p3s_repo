package com.bcs.p3s.sftp.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

public class Order {
	
	private String p3sTransRef;
	
	private String srcCurrency;
	
	private String destCurrency;
	
	private BigDecimal src_dest_fxRate;
	
	private BigDecimal subTotalUSD;
	
	private BigDecimal amountToEPO_USD;
	
	private BigDecimal holdingAmountUSD;
	
	private BigDecimal amountToEPO_EUR;
	
	private String destinationOffice;
	
	private String paymentMethod;
	
	private String reference;
	
	//all dates in yyyy/MM/dd HH:mm:ss z format
	private String paymentValueDate;
	
	private String currentDatestamp;

	
	public String getP3sTransRef() {
		return p3sTransRef;
	}

	public void setP3sTransRef(String p3sTransRef) {
		this.p3sTransRef = p3sTransRef;
	}

	public String getSrcCurrency() {
		return srcCurrency;
	}

	public void setSrcCurrency(String srcCurrency) {
		this.srcCurrency = srcCurrency;
	}

	
	public String getDestCurrency() {
		return destCurrency;
	}

	public void setDestCurrency(String destCurrency) {
		this.destCurrency = destCurrency;
	}

	public BigDecimal getSrc_dest_fxRate() {
		return src_dest_fxRate;
	}

	public void setSrc_dest_fxRate(BigDecimal src_dest_fxRate) {
		this.src_dest_fxRate = src_dest_fxRate;
	}


	public BigDecimal getSubTotalUSD() {
		return subTotalUSD;
	}

	public void setSubTotalUSD(BigDecimal subTotalUSD) {
		this.subTotalUSD = subTotalUSD;
	}

	public BigDecimal getAmountToEPO_USD() {
		return amountToEPO_USD;
	}

	public void setAmountToEPO_USD(BigDecimal amountToEPO_USD) {
		this.amountToEPO_USD = amountToEPO_USD;
	}

	public BigDecimal getHoldingAmountUSD() {
		return holdingAmountUSD;
	}

	public void setHoldingAmountUSD(BigDecimal holdingAmount) {
		this.holdingAmountUSD = holdingAmount;
	}

	public BigDecimal getAmountToEPO_EUR() {
		return amountToEPO_EUR;
	}

	public void setAmountToEPO_EUR(BigDecimal amountToEPO_EUR) {
		this.amountToEPO_EUR = amountToEPO_EUR;
	}

	public String getDestinationOffice() {
		return destinationOffice;
	}

	public void setDestinationOffice(String destinationOffice) {
		this.destinationOffice = destinationOffice;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public String getPaymentValueDate() {
		return paymentValueDate;
	}

	public void setPaymentValueDate(String paymentExpiryDate) {
		this.paymentValueDate = paymentExpiryDate;
	}

	public String getCurrentDatestamp() {
		return currentDatestamp;
	}

	public void setCurrentDatestamp(String currentDatestamp) {
		this.currentDatestamp = currentDatestamp;
	}
	
	
	

}
