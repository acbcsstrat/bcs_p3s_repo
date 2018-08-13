package com.bcs.p3s.docs.htmldoc.model;

import java.math.BigDecimal;

import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

/**
 * Holds details of this Patent/Renewal for displaying on a htlmDoc page
 */
public class Patent4htmlDoc extends Universal {

	protected String numberInList;
	protected String listSize; 
	protected String applicationNumber;
	protected String clientRef;
	protected String shortName;
	protected String title;
	protected String filingDate;
	protected String officialRenewalFeeUsd;
	protected String officialExtensionFeeUsd;
	protected String processingFeeUsd;
	protected String expressClearanceFeeUsd; 
	protected String urgentClearanceFeeUsd;
	protected String totalFeeForPatentUsd;

	
	// Enforce Set (most) data via constructor (by not providing setters)
	public Patent4htmlDoc (Renewal renewal) {
		Patent patent = renewal.getPatent();
		DateUtil dateUtil = new DateUtil();
		RenewalFee fee = renewal.getFee();
		BigDecimal rate = fee.getFxRate();
		
		this.applicationNumber = patent.getEP_ApplicationNumber();
		this.clientRef = patent.getClientRef();
		this.shortName = patent.getShortTitle();
		this.title = patent.getTitle();
		this.filingDate = dateUtil.dateToUSStringWithoutDayOfWeek(patent.getInternationalFilingDate());
		this.officialRenewalFeeUsd = eurToUsd(fee.getRenewalFee_EUR(), rate).toString();
		this.officialExtensionFeeUsd = eurToUsd(fee.getExtensionFee_EUR(), rate).toString();
		this.processingFeeUsd = fee.getProcessingFee_USD().toString();
		this.expressClearanceFeeUsd = fee.getExpressFee_USD().toString();
		this.urgentClearanceFeeUsd = fee.getUrgentFee_USD().toString();
		
		BigDecimal subtotalBD = eurToUsd(fee.getRenewalFee_EUR(), rate)
								.add(eurToUsd(fee.getExtensionFee_EUR(), rate))
								.add(fee.getProcessingFee_USD())
								.add(fee.getExpressFee_USD())
								.add(fee.getUrgentFee_USD());
		this.totalFeeForPatentUsd = subtotalBD.toString(); 
		// Client to subsequently set numberInList & listSize
	}

	
	protected BigDecimal eurToUsd(BigDecimal eurFee, BigDecimal usdToEurRate) {
		BigDecimal usdFeeBD = (eurFee.multiply(usdToEurRate)).setScale(2, BigDecimal.ROUND_HALF_UP);
		
		log().debug("Patent4htmlDoc eurToUsd invoked with "+eurFee.toString()+" @"+usdToEurRate+" returns "+usdFeeBD.toString());
		return usdFeeBD;
	}
	
	
	
	// selected setters
	public void setNumberInList(String numberInList) {
		this.numberInList = numberInList;
	}
	public void setListSize(String listSize) {
		this.listSize = listSize;
	}
	
	
	// Ordinary getters
	public String getNumberInList() {
		return numberInList;
	}
	public String getListSize() {
		return listSize;
	}
	public String getApplicationNumber() {
		return applicationNumber;
	}
	public String getClientRef() {
		return clientRef;
	}
	public String getShortName() {
		return shortName;
	}
	public String getTitle() {
		return title;
	}
	public String getFilingDate() {
		return filingDate;
	}
	public String getOfficialRenewalFeeUsd() {
		return officialRenewalFeeUsd;
	}
	public String getOfficialExtensionFeeUsd() {
		return officialExtensionFeeUsd;
	}
	public String getProcessingFeeUsd() {
		return processingFeeUsd;
	}
	public String getExpressClearanceFeeUsd() {
		return expressClearanceFeeUsd;
	}
	public String getUrgentClearanceFeeUsd() {
		return urgentClearanceFeeUsd;
	}
	public String getTotalFeeForPatentUsd() {
		return totalFeeForPatentUsd;
	}
	
}
