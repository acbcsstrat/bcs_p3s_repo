package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.PaymentUI;
import com.bcs.p3s.wrap.BasketContents;

public interface PaymentService {

	/**
	 * Provide details for display in the Show Basket page
	 * @return A fully populated BasketDetailsWrapper object
	 */
	public BasketContents showBasketDetails(List<Long> patentIds);

}
