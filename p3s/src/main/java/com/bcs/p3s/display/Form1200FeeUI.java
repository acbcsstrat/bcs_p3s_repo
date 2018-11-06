package com.bcs.p3s.display;

import java.math.BigDecimal;

import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.util.currency.CurrencyUtil;



/**
 * As usual (for *UI classes) is a wrapper around the named class. 
 * However, here many fields here have been renamed by the API document
 *
 */
public class Form1200FeeUI extends FeeCurrencyComponents {

	// This class <i>could</i> extend Form1200Fee, but given the risk of exposing epct&onweard data 
	// and the fact that most fields need renaming, will implement the slow, explicit way.
	
	protected BigDecimal supplementarySearchFeeEUR;
	protected BigDecimal designationFeeEUR;
	protected BigDecimal validationFeeEUR;
	protected BigDecimal extensionFeeEUR;
	protected BigDecimal examinationFeeEUR;
	protected BigDecimal filingFeeEUR;
	protected BigDecimal claimsFee1EUR;
	protected BigDecimal claimsFee2EUR;
	protected BigDecimal renewalFeeEUR;
	protected BigDecimal excessPageFeeEUR;
	protected BigDecimal processingFeeEUR;
	protected BigDecimal expressFeeEUR;
	protected BigDecimal urgentFeeEUR;
	protected BigDecimal supplementarySearchFeeUSD;
	protected BigDecimal designationFeeUSD;
	protected BigDecimal extensionFeeUSD;
	protected BigDecimal validationFeeUSD;
	protected BigDecimal examinationFeeUSD;
	protected BigDecimal filingFeeUSD;
	protected BigDecimal claimsFee1USD;
	protected BigDecimal claimsFee2USD;
	protected BigDecimal renewalFeeUSD;
	protected BigDecimal excessPageFeeUSD;
	protected BigDecimal processingFeeUSD;
	protected BigDecimal expressFeeUSD;
	protected BigDecimal urgentFeeUSD;
	protected BigDecimal subTotalEUR;
	protected BigDecimal fxRate;
    protected BigDecimal subTotalUSD;
	protected CostHistoryUI costHistoryUI;
	

	
	
	
	public Form1200FeeUI(Form1200Fee fee){

		// Map form1200Fee fields to <i>similar</i> names here (as specified by API) 

		this.setSupplementarySearchFeeEUR(fee.getSupplementarySearchFee_EUR());
		this.setDesignationFeeEUR(fee.getDesignationStatesFee_EUR());
		this.setValidationFeeEUR(fee.getTotalValidationStatesFee_EUR());
		this.setExtensionFeeEUR(fee.getTotalExtensionStatesFee_EUR());
		this.setExaminationFeeEUR(fee.getExaminationFee_EUR());
		this.setFilingFeeEUR(fee.getFilingFee_EUR());
		this.setClaimsFee1EUR(fee.getTotalClaimsFee1_EUR());
		this.setClaimsFee2EUR(fee.getTotalClaimsFee2_EUR());
		this.setRenewalFeeEUR(fee.getRenewalFee_EUR());
		this.setExcessPageFeeEUR(fee.getTotalExcessPageFee_EUR());

		this.setProcessingFeeUSD(fee.getProcessingFee_USD());
		this.setExpressFeeUSD(fee.getExpressFee_USD());
		this.setUrgentFeeUSD(fee.getUrgentFee_USD());
		this.setSubTotalUSD(fee.getSubTotal_USD());
		this.setFxRate(fee.getFxRate());
		checkRateFeasable(fee.getFxRate());
				
		// Calculate the other fields
		this.setProcessingFeeEUR(dollarsToEuro(processingFeeUSD));
		this.setExpressFeeEUR(dollarsToEuro(expressFeeUSD));
		this.setUrgentFeeEUR(dollarsToEuro(urgentFeeUSD));

		this.setSupplementarySearchFeeUSD(euroToDollars(supplementarySearchFeeEUR));
		this.setDesignationFeeUSD(euroToDollars(designationFeeEUR));
		this.setExtensionFeeUSD(euroToDollars(extensionFeeEUR));
		this.setValidationFeeUSD(euroToDollars(validationFeeEUR));
		this.setExaminationFeeUSD(euroToDollars(examinationFeeEUR));
		this.setFilingFeeUSD(euroToDollars(filingFeeEUR));
		this.setClaimsFee1USD(euroToDollars(claimsFee1EUR));
		this.setClaimsFee2USD(euroToDollars(claimsFee2EUR));
		this.setRenewalFeeUSD(euroToDollars(renewalFeeEUR));
		this.setExcessPageFeeUSD(euroToDollars(excessPageFeeEUR));

		this.setSubTotalEUR(dollarsToEuro(subTotalUSD));

		
		// Populate costHistoryUI
		setDollarComponentUSD();
		setEuroComponentEUR();
		costHistoryUI = new CostHistoryUI(this);
	}


	
	
	// local methods
	
	public BigDecimal dollarsToEuro(BigDecimal dollars) {
		CurrencyUtil currencyUtil = new CurrencyUtil();
		return currencyUtil.dollarsToEuro(dollars, fxRate);
	}
	public BigDecimal euroToDollars(BigDecimal euros) {
		CurrencyUtil currencyUtil = new CurrencyUtil();
		return currencyUtil.euroToDollars(euros, fxRate);
	}

	
	// Implement the 2 abstract methods from supertype
	public void setDollarComponentUSD() {
		BigDecimal totalling = processingFeeUSD; 
		totalling = safeAddition(totalling, expressFeeUSD);
		totalling = safeAddition(totalling, urgentFeeUSD);
		//totalling = safeAddition(totalling, latePayPenaltyUSD);
		dollarComponentUSD = totalling;
	}
	public void setEuroComponentEUR() {
		BigDecimal totalling = filingFeeEUR; 
		totalling = safeAddition(totalling, supplementarySearchFeeEUR);
		totalling = safeAddition(totalling, designationFeeEUR);
		totalling = safeAddition(totalling, validationFeeEUR);
		totalling = safeAddition(totalling, extensionFeeEUR);
		totalling = safeAddition(totalling, examinationFeeEUR);
		totalling = safeAddition(totalling, claimsFee1EUR);
		totalling = safeAddition(totalling, claimsFee2EUR);
		totalling = safeAddition(totalling, renewalFeeEUR);
		totalling = safeAddition(totalling, excessPageFeeEUR);
		euroComponentEUR = totalling; 
	}


	// Ordinary getters/setters
	
	public BigDecimal getSupplementarySearchFeeEUR() {
		return supplementarySearchFeeEUR;
	}
	public void setSupplementarySearchFeeEUR(BigDecimal supplementarySearchFeeEUR) {
		this.supplementarySearchFeeEUR = supplementarySearchFeeEUR;
	}
	public BigDecimal getDesignationFeeEUR() {
		return designationFeeEUR;
	}
	public void setDesignationFeeEUR(BigDecimal designationFeeEUR) {
		this.designationFeeEUR = designationFeeEUR;
	}
	public BigDecimal getValidationFeeEUR() {
		return validationFeeEUR;
	}
	public void setValidationFeeEUR(BigDecimal validationFeeEUR) {
		this.validationFeeEUR = validationFeeEUR;
	}
	public BigDecimal getExtensionFeeEUR() {
		return extensionFeeEUR;
	}
	public void setExtensionFeeEUR(BigDecimal extensionFeeEUR) {
		this.extensionFeeEUR = extensionFeeEUR;
	}
	public BigDecimal getExaminationFeeEUR() {
		return examinationFeeEUR;
	}
	public void setExaminationFeeEUR(BigDecimal examinationFeeEUR) {
		this.examinationFeeEUR = examinationFeeEUR;
	}
	public BigDecimal getFilingFeeEUR() {
		return filingFeeEUR;
	}
	public void setFilingFeeEUR(BigDecimal filingFeeEUR) {
		this.filingFeeEUR = filingFeeEUR;
	}
	public BigDecimal getClaimsFee1EUR() {
		return claimsFee1EUR;
	}
	public void setClaimsFee1EUR(BigDecimal claimsFee1EUR) {
		this.claimsFee1EUR = claimsFee1EUR;
	}
	public BigDecimal getClaimsFee2EUR() {
		return claimsFee2EUR;
	}
	public void setClaimsFee2EUR(BigDecimal claimsFee2EUR) {
		this.claimsFee2EUR = claimsFee2EUR;
	}
	public BigDecimal getRenewalFeeEUR() {
		return renewalFeeEUR;
	}
	public void setRenewalFeeEUR(BigDecimal renewalFeeEUR) {
		this.renewalFeeEUR = renewalFeeEUR;
	}
	public BigDecimal getExcessPageFeeEUR() {
		return excessPageFeeEUR;
	}
	public void setExcessPageFeeEUR(BigDecimal excessPageFeeEUR) {
		this.excessPageFeeEUR = excessPageFeeEUR;
	}
	public BigDecimal getProcessingFeeEUR() {
		return processingFeeEUR;
	}
	public void setProcessingFeeEUR(BigDecimal processingFeeEUR) {
		this.processingFeeEUR = processingFeeEUR;
	}
	public BigDecimal getExpressFeeEUR() {
		return expressFeeEUR;
	}
	public void setExpressFeeEUR(BigDecimal expressFeeEUR) {
		this.expressFeeEUR = expressFeeEUR;
	}
	public BigDecimal getUrgentFeeEUR() {
		return urgentFeeEUR;
	}
	public void setUrgentFeeEUR(BigDecimal urgentFeeEUR) {
		this.urgentFeeEUR = urgentFeeEUR;
	}
	public BigDecimal getSupplementarySearchFeeUSD() {
		return supplementarySearchFeeUSD;
	}
	public void setSupplementarySearchFeeUSD(BigDecimal supplementarySearchFeeUSD) {
		this.supplementarySearchFeeUSD = supplementarySearchFeeUSD;
	}
	public BigDecimal getDesignationFeeUSD() {
		return designationFeeUSD;
	}
	public void setDesignationFeeUSD(BigDecimal designationFeeUSD) {
		this.designationFeeUSD = designationFeeUSD;
	}
	public BigDecimal getExtensionFeeUSD() {
		return extensionFeeUSD;
	}
	public void setExtensionFeeUSD(BigDecimal extensionFeeUSD) {
		this.extensionFeeUSD = extensionFeeUSD;
	}
	public BigDecimal getValidationFeeUSD() {
		return validationFeeUSD;
	}
	public void setValidationFeeUSD(BigDecimal validationFeeUSD) {
		this.validationFeeUSD = validationFeeUSD;
	}
	public BigDecimal getExaminationFeeUSD() {
		return examinationFeeUSD;
	}
	public void setExaminationFeeUSD(BigDecimal examinationFeeUSD) {
		this.examinationFeeUSD = examinationFeeUSD;
	}
	public BigDecimal getFilingFeeUSD() {
		return filingFeeUSD;
	}
	public void setFilingFeeUSD(BigDecimal filingFeeUSD) {
		this.filingFeeUSD = filingFeeUSD;
	}
	public BigDecimal getClaimsFee1USD() {
		return claimsFee1USD;
	}
	public void setClaimsFee1USD(BigDecimal claimsFee1USD) {
		this.claimsFee1USD = claimsFee1USD;
	}
	public BigDecimal getClaimsFee2USD() {
		return claimsFee2USD;
	}
	public void setClaimsFee2USD(BigDecimal claimsFee2USD) {
		this.claimsFee2USD = claimsFee2USD;
	}
	public BigDecimal getRenewalFeeUSD() {
		return renewalFeeUSD;
	}
	public void setRenewalFeeUSD(BigDecimal renewalFeeUSD) {
		this.renewalFeeUSD = renewalFeeUSD;
	}
	public BigDecimal getExcessPageFeeUSD() {
		return excessPageFeeUSD;
	}
	public void setExcessPageFeeUSD(BigDecimal excessPageFeeUSD) {
		this.excessPageFeeUSD = excessPageFeeUSD;
	}
	public BigDecimal getProcessingFeeUSD() {
		return processingFeeUSD;
	}
	public void setProcessingFeeUSD(BigDecimal processingFeeUSD) {
		this.processingFeeUSD = processingFeeUSD;
	}
	public BigDecimal getExpressFeeUSD() {
		return expressFeeUSD;
	}
	public void setExpressFeeUSD(BigDecimal expressFeeUSD) {
		this.expressFeeUSD = expressFeeUSD;
	}
	public BigDecimal getUrgentFeeUSD() {
		return urgentFeeUSD;
	}
	public void setUrgentFeeUSD(BigDecimal urgentFeeUSD) {
		this.urgentFeeUSD = urgentFeeUSD;
	}
	public BigDecimal getSubTotalEUR() {
		return subTotalEUR;
	}
	public void setSubTotalEUR(BigDecimal subTotalEUR) {
		this.subTotalEUR = subTotalEUR;
	}
	public BigDecimal getFxRate() {
		return fxRate;
	}
	public void setFxRate(BigDecimal fxRate) {
		this.fxRate = fxRate;
	}
	public BigDecimal getSubTotalUSD() {
		return subTotalUSD;
	}
	public void setSubTotalUSD(BigDecimal subTotalUSD) {
		this.subTotalUSD = subTotalUSD;
	}
	public CostHistoryUI getCostHistoryUI() {
		return costHistoryUI;
	}
	public void setCostHistoryUI(CostHistoryUI costHistoryUI) {
		this.costHistoryUI = costHistoryUI;
	}

}

