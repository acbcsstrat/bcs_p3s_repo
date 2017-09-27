package com.bcs.p3s.engine;

import java.util.Date;

import com.bcs.p3s.util.lang.Universal;

/**
 * This engine performs all calculations relating to timing of payments.
 * It will (acToDo) include
 * - upon custommer Bank Transfer committal: calculating when the customer's bank transfer must have reached our account
 * - MAYBE upon the Euros from Moneycorp reaching the EPO - How soon we should issue the renewal instruction (currently immediate)
 * - If renewed in Red, has the money arrived in time
 */
public class PaymentTimingEngine extends Universal { // acTidy Universal added for notYet() only

	public Date whenCustomerFundsMustHaveReachedOurUsAccount(Date from) {
		
		// This engine will perform proper processing here, once the rules are known
		DummyDataEngine dummy = new DummyDataEngine();
		Date targetDate = dummy.add48hours(from);

		return targetDate;
	}
	
	
	public boolean didTheRedFundsArriveInTime() {
		notYet("PaymentTimingEngine didTheRedFundsArriveInTime");
		
		return true;
	}
	
	
}
