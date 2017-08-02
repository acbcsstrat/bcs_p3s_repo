package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;

import com.bcs.p3s.model.Fee;

public class CostAnalysisData {
	
	private Date greenStartDate;
	private Date amberStartDate;
	private Date redStartDate;
	private Date blueStartDate;
	private Date brownStartDate;
	private Date brownEndDate;
	
	private String greenStartDateUI;
	private String amberStartDateUI;
	private String redStartDateUI;
	private String blueStartDateUI;
	private String brownStartDateUI;
	private String brownEndDateUI;
	
	private BigDecimal greenCost;
	private BigDecimal amberCost;
	private BigDecimal redCost;
	private BigDecimal blueCost;
	private BigDecimal brownCost;
	
	private String currentcostBand;
	
	/**
	 * BELOW 3 PROPERTIES FOR DISPLAYING EXTRA INFO ON THE COST ANALYSIS PAGE
	 */
	private boolean extraText;
	private String extraTextDate;
	private BigDecimal extraTextCost;
	
	/**
	 * FEE BREAKDOWN
	 */
	private FeeUI fee;
	
	
	/**
	 * LINE CHART DATA
	 * @return HashMap
	 */
	HashMap<Date,BigDecimal> lineChart;
	
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

	public Date getBlueStartDate() {
		return blueStartDate;
	}

	public void setBlueStartDate(Date blueStartDate) {
		this.blueStartDate = blueStartDate;
	}

	public Date getBrownStartDate() {
		return brownStartDate;
	}

	public void setBrownStartDate(Date brownStartDate) {
		this.brownStartDate = brownStartDate;
	}

	public Date getBrownEndDate() {
		return brownEndDate;
	}

	public void setBrownEndDate(Date brownEndDate) {
		this.brownEndDate = brownEndDate;
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

	public String getBlueStartDateUI() {
		return blueStartDateUI;
	}

	public void setBlueStartDateUI(String blueStartDateUI) {
		this.blueStartDateUI = blueStartDateUI;
	}

	public String getBrownStartDateUI() {
		return brownStartDateUI;
	}

	public void setBrownStartDateUI(String brownStartDateUI) {
		this.brownStartDateUI = brownStartDateUI;
	}

	public String getBrownEndDateUI() {
		return brownEndDateUI;
	}

	public void setBrownEndDateUI(String brownEndDateUI) {
		this.brownEndDateUI = brownEndDateUI;
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

	public BigDecimal getBlueCost() {
		return blueCost;
	}

	public void setBlueCost(BigDecimal blueCost) {
		this.blueCost = blueCost;
	}

	public BigDecimal getBrownCost() {
		return brownCost;
	}

	public void setBrownCost(BigDecimal brownCost) {
		this.brownCost = brownCost;
	}

	public String getCurrentcostBand() {
		return currentcostBand;
	}

	public void setCurrentcostBand(String currentcostBand) {
		this.currentcostBand = currentcostBand;
	}

	public boolean isExtraText() {
		return extraText;
	}

	public void setExtraText(boolean extraText) {
		this.extraText = extraText;
	}

	public String getExtraTextDate() {
		return extraTextDate;
	}

	public void setExtraTextDate(String extraTextDate) {
		this.extraTextDate = extraTextDate;
	}

	public BigDecimal getExtraTextCost() {
		return extraTextCost;
	}

	public void setExtraTextCost(BigDecimal extraTextCost) {
		this.extraTextCost = extraTextCost;
	}

	public FeeUI getFee() {
		return fee;
	}

	public void setFee(FeeUI fee) {
		this.fee = fee;
	}

	public HashMap<Date, BigDecimal> getLineChart() {
		return lineChart;
	}

	public void setLineChart(HashMap<Date, BigDecimal> lineChart) {
		this.lineChart = lineChart;
	}
	
	

}
