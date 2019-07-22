package com.bcs.p3s.util.currency;

import java.math.BigDecimal;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.Form1200FeeUI;
import com.bcs.p3s.display.RenewalFeeUI;
import com.bcs.p3s.display.form1200.CostAnalysisDataForm1200;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.util.lang.Universal;

/**
 * Used for calculating amber & red costs given total green cost (in USD)
 * 
 * The issue is the that Euro component of the fee must increase by the given percentage,
 * but eour USD processing fee must not
 *
 * So all calculations in this class are:
 *   subtract ProcFee, increase by percentage, add procFee back on
 */
public class OfficialFeeUpliftCalculator extends Universal {

	
	public BigDecimal increaseOfficialComponent(BigDecimal stdCostUSD, BigDecimal percentIncrease, P3SFeeSole p3sFees)
	{
		if (stdCostUSD==null || percentIncrease==null || p3sFees==null) 
			fail(" increaseOfficialComponent() passed a null : "
					+(stdCostUSD==null) + (percentIncrease==null) + (p3sFees==null));

		String idh = " increaseOfficialComponent("+stdCostUSD.toString()+")  ";
		
		// Extract the Processing fee
		BigDecimal processingFeeUSD = p3sFees.getProcessingFee_USD();
		if (processingFeeUSD==null) fail("processingFeeUSD is not available : "+idh);
		
		
		// Now perform the calculation
		
		BigDecimal officialFee = stdCostUSD.subtract(processingFeeUSD);
		BigDecimal officialIncrease = officialFee.multiply(percentIncrease).divide(new BigDecimal(100.0)); 
		BigDecimal increasedTotalFeeUSD = officialFee.add(officialIncrease).add(processingFeeUSD);
		
		return increasedTotalFeeUSD;
	}
	
	

	// rtfm !!!!!
//	public BigDecimal increaseOfficialComponent(BigDecimal stdCostUSD, BigDecimal percentIncreate,
//				Object CostAnalysisDataContainingProcessingFee) 
//	{
//		if (stdCostUSD==null || percentIncreate==null || CostAnalysisDataContainingProcessingFee==null) 
//			fail(" increaseOfficialComponent() passed a null : "
//					+(stdCostUSD==null) + (percentIncreate==null) + (CostAnalysisDataContainingProcessingFee==null));
//
//		String idh = " increaseOfficialComponent("+stdCostUSD.toString()+")  ";
//		
//		// Extract the Processing fee (if any)
//		BigDecimal processingFeeUSD = null;
//		if (CostAnalysisDataContainingProcessingFee instanceof CostAnalysisData) {
//			// Is Renewal data
//			CostAnalysisData caData = (CostAnalysisData) CostAnalysisDataContainingProcessingFee;
//			RenewalFeeUI renewalFeeUI = caData.getRenewalFee();
//			if (renewalFeeUI!=null) {
//				processingFeeUSD = renewalFeeUI.getProcessingFeeUSD(); // Conceivably null
//			}
//		}
//		else if (CostAnalysisDataContainingProcessingFee instanceof CostAnalysisDataForm1200) {
//			// Is Form1200 data
//			CostAnalysisDataForm1200 caData = (CostAnalysisDataForm1200) CostAnalysisDataContainingProcessingFee;
//			Form1200FeeUI form1200FeeUI = caData.getForm1200FeeUI();
//			if (form1200FeeUI!=null) {
//				processingFeeUSD = form1200FeeUI.getProcessingFeeUSD(); // Conceivably null
//			}
//		}
//		else fail("caData is unsupported : "+idh+ "  "+CostAnalysisDataContainingProcessingFee.getClass().getName());
//
//		// If processingFee is null, reluctantly, goto the database ..
//		if (processingFeeUSD==null) {
//			P3SFeeSole p3sFees = P3SFeeSole.findP3SFeeSole(1L); //assuming P3SSole having single entry every time
//			processingFeeUSD = p3sFees.getProcessingFee_USD();
//			if (processingFeeUSD==null) fail("Cannot determine processingFeeUSD. From "+idh);
//			log().debug("Eventually - Extracted processingFee of "+processingFeeUSD.toString()+" for "+idh);
//		}
//		else log().debug("Extracted processingFee of "+processingFeeUSD.toString()+" for "+idh);
//		
//		
//		
//		// Now perform the calculation
//		
//		BigDecimal result = null;
//		
//		
//		
//		
//		return result;
//	}
	
	
}
