package com.bcs.p3s.display.form1200;

import java.math.BigDecimal;
import java.util.Date;
import java.util.TreeMap;

import com.bcs.p3s.display.RenewalFeeUI;

/**
 * CostAnalysis data for a Renewal
 *
 */
public class CostAnalysisDataForm1200 {

	
	
	
	
	
	// ciopied from renewal
	private Date greenStartDate;
	private Date amberStartDate;
	private Date redStartDate;
	private Date blueStartDate;
	private Date blackStartDate;
	private Date blackPhoneUpStart;
	private Date blackAllEnd;
	
	private String greenStartDateUI;
	private String amberStartDateUI;
	private String redStartDateUI;
	private String blueStartDateUI;
	private String blackStartDateUI;
	private String blackPhoneUpStartUI;
	private String blackAllEndUI;
	
	private BigDecimal greenStageCost;
	private BigDecimal amberStageCost;
	private BigDecimal redStageCost;
	private BigDecimal blueStageCost;
	private BigDecimal blackStageCost;
	
	private String currentcostBand;
	
	/**
	 * BELOW 3 PROPERTIES FOR DISPLAYING EXTRA INFO ON THE COST ANALYSIS PAGE - MAY BE NOT IN MVP
	 */
	private boolean extraText;
	private String extraTextDate;
	private BigDecimal extraTextCost;
	
	/**
	 * FEE BREAKDOWN
	 */
	private RenewalFeeUI renewalFee;
	
	
	/**
	 * LINE CHART DATA
	 * @return HashMap
	 */
	TreeMap<Date,RenewalFeeUI> lineChart;
	

}
