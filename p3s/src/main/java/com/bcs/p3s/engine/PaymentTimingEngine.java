package com.bcs.p3s.engine;

import java.util.Date;

/**
 * This engine performs all calculations relating to timing of payments.
 * It will (acToDo) include
 * - upon custommer Bank Transfer committal: calculating when the customer's bank transfer must have reached our account
 * - opon the Euros from Moneycorp reaching the EPO - How soon we should issue the renewal instruction
 *
 */
public class PaymentTimingEngine {

	public Date whenCustomerFundsMustHaveReachedOurUsAccount(Date from) {
		
		// This engine will perform proper processing here, once the rules are known
		DummyDataEngine dummy = new DummyDataEngine();
		Date targetDate = dummy.add48hours(from);

		return targetDate;
	}
	
}
