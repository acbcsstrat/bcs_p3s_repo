package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.List;

import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
import com.bcs.p3s.wrap.InBasket;

public interface PaymentService {

	/**
	 * Provide details for display in the Show Basket page
	 * @return A fully populated BasketContents object
	 */
	public BasketContents showBasketContents(List<Long> patentIds);

	/**
	 * Provide details for display in the Bank Transfer Pre-Commit page
	 * @return A fully populated BankTransferPreCommitDetails object
	 */
	public BankTransferPreCommitDetails showBankTransferPreCommitDetails(InBasket basket);

	/**
	 * Provide details for display in the Bank Transfer Post-Commit page
	 * @return A fully populated BankTransferPostCommitDetails object
	 */
	public BankTransferPostCommitDetails showBankTransferPostCommitDetails(InBasket basket);

}
