package com.bcs.p3s.engine;

/**
 * Payment Processing
 * Perhaps this will be merged into some other engine, sometime?
 *
 */
public class PaymentProcessingEngine {

	public String generateP3sTransRef() {
		DummyDataEngine dummy = new DummyDataEngine();
		String result = dummy.generatep3sTransRef();
		return result;
	}
	
}
