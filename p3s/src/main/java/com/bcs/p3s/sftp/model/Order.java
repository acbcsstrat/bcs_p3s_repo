package com.bcs.p3s.sftp.model;

import java.math.BigDecimal;
import java.util.ArrayList;

import javax.persistence.Column;


/**
 * Pojo for an Order file
 *
 */
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
	
	private String bankPaymentReference;
	
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
		this.src_dest_fxRate = this.src_dest_fxRate.setScale(4, BigDecimal.ROUND_HALF_UP);
	}


	public BigDecimal getSubTotalUSD() {
		return subTotalUSD;
	}

	public void setSubTotalUSD(BigDecimal subTotalUSD) {
		this.subTotalUSD = subTotalUSD;
		this.subTotalUSD = this.subTotalUSD.setScale(2, BigDecimal.ROUND_HALF_UP);
	}

	public BigDecimal getAmountToEPO_USD() {
		return amountToEPO_USD;
	}

	public void setAmountToEPO_USD(BigDecimal amountToEPO_USD) {
		this.amountToEPO_USD = amountToEPO_USD;
		this.amountToEPO_USD = this.amountToEPO_USD.setScale(2, BigDecimal.ROUND_HALF_UP);
	}

	public BigDecimal getHoldingAmountUSD() {
		return holdingAmountUSD;
	}

	public void setHoldingAmountUSD(BigDecimal holdingAmount) {
		this.holdingAmountUSD = holdingAmount;
		this.holdingAmountUSD = this.holdingAmountUSD.setScale(2, BigDecimal.ROUND_HALF_UP);
	}

	public BigDecimal getAmountToEPO_EUR() {
		return amountToEPO_EUR;
	}

	public void setAmountToEPO_EUR(BigDecimal amountToEPO_EUR) {
		this.amountToEPO_EUR = amountToEPO_EUR;
		this.amountToEPO_EUR = this.amountToEPO_EUR.setScale(2, BigDecimal.ROUND_HALF_UP);
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

	public String getBankPaymentReference() {
		return bankPaymentReference;
	}

	public void setBankPaymentReference(String bankPaymentReference) {
		this.bankPaymentReference = bankPaymentReference;
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
	
	
	
	protected String[] label = { 
			"PatentPlaceRef", 
			"Ccy1", 
			"Ccy2", 
			"Rate", 
			"Ccy1AmountProvided", 
			"Ccy1toCcy2AmountRequired", 
			"Ccy1toHOLDINGamountrequired", 
			"Ccy2AmountRequired", 
			"DestinationPatentOffice", 
			"Method", 
			"ReferenceForDestinationPayment", 
			"ValueDate", 
			"CreationTimestamp"
	};
	
//	public String toString() {
//		String CRLF = "\r\n";
//		String str = "Order content is:";
//		str = str + CRLF + label[0] + this.getP3sTransRef();
//		str = str + CRLF + label[1] + this.getSrcCurrency();
//		str = str + CRLF + label[2] + this.getDestCurrency();
//		str = str + CRLF + label[3] + this.getSrc_dest_fxRate();
//		str = str + CRLF + label[4] + this.getSubTotalUSD();
//		str = str + CRLF + label[5] + this.getAmountToEPO_USD();
//		str = str + CRLF + label[6] + this.getHoldingAmountUSD();
//		str = str + CRLF + label[7] + this.getAmountToEPO_EUR();
//		str = str + CRLF + label[8] + this.getDestinationOffice();
//		str = str + CRLF + label[9] + this.getPaymentMethod();
//		str = str + CRLF + label[10] + this.getBankPaymentReference();
//		str = str + CRLF + label[11] + this.getPaymentValueDate();
//		str = str + CRLF + label[12] + this.getCurrentDatestamp();
//		return str;
//	}
	
	public String toString() {
		String CRLF = "\r\n";
		String str = "Order content is:";
		str = str + CRLF + label[0] + " = " + this.getP3sTransRef();
		str = str + CRLF + label[1] + " = " + this.getSrcCurrency();
		str = str + CRLF + label[2] + " = " + this.getDestCurrency();
		str = str + CRLF + label[3] + " = " + this.getSrc_dest_fxRate();
		str = str + CRLF + label[4] + " = " + this.getSubTotalUSD();
		str = str + CRLF + label[5] + " = " + this.getAmountToEPO_USD();
		str = str + CRLF + label[6] + " = " + this.getHoldingAmountUSD();
		str = str + CRLF + label[7] + " = " + this.getAmountToEPO_EUR();
		str = str + CRLF + label[8] + " = " + this.getDestinationOffice();
		str = str + CRLF + label[9] + " = " + this.getPaymentMethod();
		str = str + CRLF + label[10] + " = " + this.getBankPaymentReference();
		str = str + CRLF + label[11] + " = " + this.getPaymentValueDate();
		str = str + CRLF + label[12] + " = " + this.getCurrentDatestamp();
		return str;
	}
	
	public ArrayList<String> toFormettedOutput() {
		ArrayList<String> op = new ArrayList<String>(label.length + 1);
		StringBuffer line1buff = new StringBuffer(label[0]);
		for (int ii=1; ii<(label.length+0); ii++) {
			line1buff.append(',');
			line1buff.append(label[ii]);
		}
		op.add(line1buff.toString());

		StringBuffer line2buff = new StringBuffer("");
		line2buff.append(this.getP3sTransRef());
		line2buff.append(','+this.getSrcCurrency());
		line2buff.append(','+this.getDestCurrency());
		line2buff.append(','+this.getSrc_dest_fxRate().toString());
		line2buff.append(','+this.getSubTotalUSD().toString());
		line2buff.append(','+this.getAmountToEPO_USD().toString());
		line2buff.append(','+this.getHoldingAmountUSD().toString());
		line2buff.append(','+this.getAmountToEPO_EUR().toString());
		line2buff.append(','+this.getDestinationOffice());
		line2buff.append(','+this.getPaymentMethod());
		line2buff.append(','+this.getBankPaymentReference());
		line2buff.append(','+this.getPaymentValueDate());
		line2buff.append(','+this.getCurrentDatestamp());
		op.add(line2buff.toString());

		return op;
	}

}
