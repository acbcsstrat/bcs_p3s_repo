package com.bcs.p3s.docs.htmldoc.model;

import java.math.BigDecimal;
import java.util.List;

import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.util.currency.CurrencyUtil;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

/**
 * Data common to >1 htmlDoc. Hence abstract
 * Specifically, the header sections of Proforma, Final & Penalty invoices 
 */
public abstract class AbstractInvoice extends Universal {

	protected final String BANK_TRANSFER = "Bank Transfer";
	
	protected String eType;			// Concrete class to ensure invoiceType and invoice:invoiceType match
	protected PostalAddressAndHyperlink ourAddress;
	protected PostalAddressAndHyperlink clientAddress;
	protected String docDate;
	protected String invoiceNumber; 
	protected String transactionType;
	protected String transactionReference;
	protected String moneyToArriveBy;
	protected String totalUsdPayable;
	protected String fxRateUsdPerEur;
	protected String fxRateEurPerUsd;
	
	public AbstractInvoice(Invoice invoice) {
		if (invoice==null) fail("AbstractInvoice constructor given null");
		eType = invoice.getInvoiceType();
		DateUtil dateUtil = new DateUtil();
		docDate = dateUtil.dateToUSStringWithoutDayOfWeek(invoice.getIssueDate());
		Payment payment = invoice.getPayment();
		transactionReference = payment.getP3S_TransRef();
		invoiceNumber = transactionReference + getInvoiceNumberSuffix();
		moneyToArriveBy = dateUtil.dateToUSformatWithDayOfWeek2200UTC(payment.getTransTargetEndDate());
		totalUsdPayable = payment.getTransAmount_USD().toString();
		ourAddress = new PostalAddressAndHyperlink(); // Default constructor defaults to our address
		clientAddress = clientAddress(payment);
		setBothRates(payment);
	}

	

	
	protected PostalAddressAndHyperlink clientAddress(Payment payment) {
		P3SUser user = payment.getInitiatedByUserId();
		String personName = (user.getFirstName() + " " + user.getLastName()).trim();
		String organisation = user.getBusiness().getBusinessName();
		String addressStreet = payment.getBillingAddressStreet();
		String addressCity = payment.getBillingAddressCity();
		String addressState = payment.getBillingAddressState();
		String addressZip = payment.getBillingAddressZip();
		String hyperlink = user.getEmailAddress();
		
		PostalAddressAndHyperlink clientAddress = new PostalAddressAndHyperlink(
				personName, organisation, addressStreet, addressCity, addressState, addressZip, hyperlink);
		return clientAddress;
	}
	
	protected String getInvoiceNumberSuffix() {
		return getInvoiceNumberSuffix(eType);
	}
	
	protected String getInvoiceNumberSuffix(String invoiceTypeEnumStr) {
		String suffix = "";
		if (InvoiceTypeEnum.PROFORMA.equalsIgnoreCase(invoiceTypeEnumStr)) suffix = "PF";
		if (InvoiceTypeEnum.PENALTY.equalsIgnoreCase(invoiceTypeEnumStr)) suffix = "P";
		return suffix;
	}
	
	protected void setBothRates(Payment payment) {
		// Rate stored in Fee. There may be multiple Fees per transaction, but all will have the same rate
		String rate = "";
		BigDecimal fxRateBD = null;
		
		List<Renewal> renewals = payment.getRenewals();
		if (renewals.size()>0) {
			RenewalFee aFee = renewals.get(0).getRenewalFee();
			fxRateBD = aFee.getFxRate().setScale(5, BigDecimal.ROUND_HALF_UP);
		}
		else 
		{
			List<Epct> epcts = payment.getEpcts();
			if (epcts.size()>0) {
				Form1200Fee fFee = epcts.get(0).getForm1200Fee();
				fxRateBD = fFee.getFxRate().setScale(5, BigDecimal.ROUND_HALF_UP);
			}
			else fail("Payment("+payment.getId()+") has neither renewals nor epct. Impossible for v2.1");
		}
		rate = fxRateBD.toString();

		String eurPerUsd = ""; // Empty is better than stackDump!
		if (fxRateBD.compareTo(BigDecimal.ZERO)>0) {
			BigDecimal inverted = CurrencyUtil.invertRate(fxRateBD);
			eurPerUsd = inverted.toString();
		}
		
	
		fxRateUsdPerEur = rate;
		fxRateEurPerUsd = eurPerUsd; 
	}
	
	
	// Getters
	public PostalAddressAndHyperlink getOurAddress() {
		return ourAddress;
	}
	public PostalAddressAndHyperlink getClientAddress() {
		return clientAddress;
	}
	public String getDocDate() {
		return docDate;
	}
	public String getInvoiceNumber() {
		return invoiceNumber;
	}
	public String getTransactionType() {
		return transactionType;
	}
	public String getTransactionReference() {
		return transactionReference;
	}
	public String getMoneyToArriveBy() {
		return moneyToArriveBy;
	}
	public String getTotalUsdPayable() {
		return totalUsdPayable;
	}
	public String getFxRateUsdPerEur() {
		return fxRateUsdPerEur;
	}
	public String getFxRateEurPerUsd() {
		return fxRateEurPerUsd;
	}
}
