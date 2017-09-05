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
	private Date blackStartDate;
	private Date blackEndDate;
	
	private String greenStartDateUI;
	private String amberStartDateUI;
	private String redStartDateUI;
	private String blueStartDateUI;
	private String blackStartDateUI;
	private String blackEndDateUI;
	
	private BigDecimal greenStageCost;
	private BigDecimal amberStageCost;
	private BigDecimal redStageCost;
	private BigDecimal blueStageCost;
	private BigDecimal blackStageCost;
	
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
	HashMap<String,FeeUI> lineChart;
	
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

	public Date getBlackStartDate() {
		return blackStartDate;
	}

	public void setBlackStartDate(Date blackStartDate) {
		this.blackStartDate = blackStartDate;
	}

	public Date getBlackEndDate() {
		return blackEndDate;
	}

	public void setBlackEndDate(Date blackEndDate) {
		this.blackEndDate = blackEndDate;
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

	public String getBlackStartDateUI() {
		return blackStartDateUI;
	}

	public void setBlackStartDateUI(String blackStartDateUI) {
		this.blackStartDateUI = blackStartDateUI;
	}

	public String getBlackEndDateUI() {
		return blackEndDateUI;
	}

	public void setBlackEndDateUI(String blackEndDateUI) {
		this.blackEndDateUI = blackEndDateUI;
	}

	public BigDecimal getGreenStageCost() {
		return greenStageCost;
	}

	public void setGreenStageCost(BigDecimal greenCost) {
		this.greenStageCost = greenCost;
	}

	public BigDecimal getAmberStageCost() {
		return amberStageCost;
	}

	public void setAmberStageCost(BigDecimal amberCost) {
		this.amberStageCost = amberCost;
	}

	public BigDecimal getRedStageCost() {
		return redStageCost;
	}

	public void setRedStageCost(BigDecimal redCost) {
		this.redStageCost = redCost;
	}

	public BigDecimal getBlueStageCost() {
		return blueStageCost;
	}

	public void setBlueStageCost(BigDecimal blueCost) {
		this.blueStageCost = blueCost;
	}

	public BigDecimal getBlackStageCost() {
		return blackStageCost;
	}

	public void setBlackStageCost(BigDecimal blackCost) {
		this.blackStageCost = blackCost;
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

	public HashMap<String, FeeUI> getLineChart() {
		return lineChart;
	}

	public void setLineChart(HashMap<String, FeeUI> lineChart) {
		this.lineChart = lineChart;
	}
	
	

}
