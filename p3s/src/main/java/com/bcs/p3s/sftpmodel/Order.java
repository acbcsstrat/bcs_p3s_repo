package com.bcs.p3s.sftpmodel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

public class Order {
	
	private String srcCurrency;
	
	private String destCurrency;
	
	
	private BigDecimal src_dest_fxRate;
	
	private BigDecimal subTotalUSD;
	
	private BigDecimal destCurrencyAmount;
	
	private BigDecimal holdingAmount;
	
	private BigDecimal convertedAmount;
	
	private String destinationOffice;
	
	private String paymentMethod;
	
	private String reference;
	
	@Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date paymentExpiryDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date datestamp;

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

	public BigDecimal getDestCurrencyAmount() {
		return destCurrencyAmount;
	}

	public void setDestCurrencyAmount(BigDecimal destCurrencyAmount) {
		this.destCurrencyAmount = destCurrencyAmount;
	}

	public BigDecimal getHoldingAmount() {
		return holdingAmount;
	}

	public void setHoldingAmount(BigDecimal holdingAmount) {
		this.holdingAmount = holdingAmount;
	}

	public BigDecimal getConvertedAmount() {
		return convertedAmount;
	}

	public void setConvertedAmount(BigDecimal convertedAmount) {
		this.convertedAmount = convertedAmount;
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

	public Date getPaymentExpiryDate() {
		return paymentExpiryDate;
	}

	public void setPaymentExpiryDate(Date paymentExpiryDate) {
		this.paymentExpiryDate = paymentExpiryDate;
	}

	public Date getDatestamp() {
		return datestamp;
	}

	public void setDatestamp(Date datestamp) {
		this.datestamp = datestamp;
	}
	
	
	

}
