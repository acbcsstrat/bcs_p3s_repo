package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.DiscountPercent;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.util.lang.Universal;

/**
 * Provides the P3S pricing available to the currently logged-in user
 */
public class PricingEngine extends Universal {

	protected String PREFIX = this.getClass().getName() + " : "; 

	/**
	 * The 'Effective' is is the Standard fee, LESS any discount this client/business may have negotiated
	 */
	public P3SFeeSole getEffectiveP3sFees(Business business) {
		String err = PREFIX + " getEffectiveP3sFees() : ";
		if (business==null) fail(err + "passed null");

		P3SFeeSole effectiveFee = P3SFeeSole.findP3SFeeSole(1L); //assuming P3SSole having single entry every time
			
		List<DiscountPercent> discount = DiscountPercent.findDiscountPercentsByBusiness(business).getResultList();
		if(discount.size() > 0){
			DiscountPercent agreedDiscount = discount.get(0); // Typically 0. Maybe 1. No more
			log().debug("Buisness id [" + business.getId() + "] IS eligible for DISCOUNTED FEES");

			effectiveFee = applyDiscount(effectiveFee, agreedDiscount);
		}
		else{
			log().debug("Buisness id [" + business.getId() + "] is NOT eligible for DISCOUNTED FEES");
		}
		logEffectiveFee(business, effectiveFee);
		return effectiveFee;
	}
	

	/**
	 * Do the sum : times by (100+percentage) / 100
	 */
	public BigDecimal increaseByPercentage(BigDecimal existing, BigDecimal percentage) {
		if (existing==null || percentage==null) return null;

		BigDecimal oneHundred = new BigDecimal(100);
		BigDecimal numerator = oneHundred.add(percentage);
		BigDecimal answer = existing.multiply(numerator).divide(oneHundred);
		return answer;
	}
	/**
	 * Do the sum : times by percentage / 100
	 */
	public BigDecimal multiplyByPercentage(BigDecimal existing, BigDecimal percentage) {
		if (existing==null || percentage==null) return null;

		BigDecimal oneHundred = new BigDecimal(100);
		BigDecimal answer = existing.multiply(percentage).divide(oneHundred);
		return answer;
	}
	
		
	protected P3SFeeSole applyDiscount(P3SFeeSole standardFee, DiscountPercent agreedDiscount) {
		String err = PREFIX + " applyDiscount() : ";
		if (standardFee==null || agreedDiscount==null) fail(err+" passed a null"); 

		BigDecimal oneHundred = new BigDecimal(100);

		BigDecimal processingFee = null;
		BigDecimal expressFee = null;
		BigDecimal urgentFee = null;
		BigDecimal latePayPenalty = null;
		
		//all discount values in %

		// Processing fee & penalty fee are USD amounts, so for them the equation is:
		//EQUATION :- discounted processing fee = standard processing fee * ( (100 - discount%) / 100 )
		processingFee = standardFee.getProcessingFee_USD().multiply(
				(oneHundred.subtract(agreedDiscount.getProcessingFee())).divide(oneHundred));
		latePayPenalty = standardFee.getLatePayPenalty_USD().multiply(
				(oneHundred.subtract(agreedDiscount.getLatePayPenalty())).divide(oneHundred));
		
		// Express and Urgent fees are a percentage uplift, so for them the equation is:
		//EQUATION :- urgent/express fee% = urgent/express % - discount % (e.g. 25% - 5%) 
		expressFee = standardFee.getExpressFee_Percent().subtract(agreedDiscount.getExpressFee());
		urgentFee = standardFee.getUrgentFee_Percent().subtract(agreedDiscount.getUrgentFee());
		
		P3SFeeSole discountedFee = new P3SFeeSole();
		discountedFee.setProcessingFee_USD(processingFee);
		discountedFee.setExpressFee_Percent(expressFee);
		discountedFee.setUrgentFee_Percent(urgentFee);
		discountedFee.setLatePayPenalty_USD(latePayPenalty);
		return discountedFee;
	}


	protected void logEffectiveFee(Business business, P3SFeeSole effectiveFee) {
		String feeApplied = "Business ["+business.getId()+"] accessing Fees of : "
				+"$"+effectiveFee.getProcessingFee_USD()+", "
				+effectiveFee.getExpressFee_Percent()+"%, "
				+effectiveFee.getUrgentFee_Percent()+"%, "
				+"$"+effectiveFee.getLatePayPenalty_USD();
		log().debug(feeApplied);
	}
}
