package com.bcs.p3s.display.form1200;

import java.math.BigDecimal;
import java.util.Date;
import java.util.TreeMap;

import com.bcs.p3s.display.Form1200FeeUI;

/**
 * CostAnalysis data for a E-PCT
 * from v2.1 API section 3.3 Cost Analysis Info for FORM1200
 * Table 3.3 Fetch cost analysis data
 */
public class CostAnalysisDataForm1200 {

	private Date greenStartDate;
	private Date amberStartDate;
	private Date redStartDate;
	private Date redEndDate;

	private String greenStartDateUI;
	private String amberStartDateUI;
	private String redStartDateUI;
	private String redEndDateUI;
	
	private BigDecimal greenCost;
	private BigDecimal amberCost;
	private BigDecimal redCost;

	private String currentcostBand; // see RenewalColourEnum

	private Form1200FeeUI form1200FeeUI;
	
	/**
	 * LINE CHART DATA
	 * @return HashMap
	 */
	//TreeMap<Date,Form1200FeeUI> lineChart;
	TreeMap<Date,BigDecimal> lineChart;

	
	
	
	
	
	
	
	
	// Ordinary Getters & Setters
	
	public Date getGreenStartDate() {
		return greenStartDate;
	}
	public void setGreenStartDate(Date greenStartDate) {
		this.greenStartDate = greenStartDate;
	}

	public Date getAmberStartDate() {
		return amberStartDate;
	}
	public void setAmberStartDate(Date amberStartDate) {
		this.amberStartDate = amberStartDate;
	}

	public Date getRedStartDate() {
		return redStartDate;
	}
	public void setRedStartDate(Date redStartDate) {
		this.redStartDate = redStartDate;
	}

	public Date getRedEndDate() {
		return redEndDate;
	}
	public void setRedEndDate(Date redEndDate) {
		this.redEndDate = redEndDate;
	}

	public String getGreenStartDateUI() {
		return greenStartDateUI;
	}
	public void setGreenStartDateUI(String greenStartDateUI) {
		this.greenStartDateUI = greenStartDateUI;
	}

	public String getAmberStartDateUI() {
		return amberStartDateUI;
	}
	public void setAmberStartDateUI(String amberStartDateUI) {
		this.amberStartDateUI = amberStartDateUI;
	}

	public String getRedStartDateUI() {
		return redStartDateUI;
	}
	public void setRedStartDateUI(String redStartDateUI) {
		this.redStartDateUI = redStartDateUI;
	}

	public String getRedEndDateUI() {
		return redEndDateUI;
	}
	public void setRedEndDateUI(String redEndDateUI) {
		this.redEndDateUI = redEndDateUI;
	}

	public BigDecimal getGreenCost() {
		return greenCost;
	}
	public void setGreenCost(BigDecimal greenCost) {
		this.greenCost = greenCost;
	}

	public BigDecimal getAmberCost() {
		return amberCost;
	}
	public void setAmberCost(BigDecimal amberCost) {
		this.amberCost = amberCost;
	}

	public BigDecimal getRedCost() {
		return redCost;
	}
	public void setRedCost(BigDecimal redCost) {
		this.redCost = redCost;
	}

	public String getCurrentcostBand() {
		return currentcostBand;
	}
	public void setCurrentcostBand(String currentcostBand) {
		this.currentcostBand = currentcostBand;
	}

	public Form1200FeeUI getForm1200FeeUI() {
		return form1200FeeUI;
	}
	public void setForm1200FeeUI(Form1200FeeUI form1200FeeUI) {
		this.form1200FeeUI = form1200FeeUI;
	}

	public TreeMap<Date, BigDecimal> getLineChart() {
		return lineChart;
	}
	public void setLineChart(TreeMap<Date,BigDecimal> lineChart) {
		this.lineChart = lineChart;
	}
}
