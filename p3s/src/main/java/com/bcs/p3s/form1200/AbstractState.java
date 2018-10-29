package com.bcs.p3s.form1200;

/**
 * Abstract state for 2character Country/States
 *  as used for Form1200 processing
 */
public abstract class AbstractState {
	
	public String stateCode;
	public String stateName;
	boolean isSelected;

	
	
	
	
	// getters & setters
	public String getStateCode() {
		return stateCode;
	}
	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}
	public String getStateName() {
		return stateName;
	}
	public void setStateName(String stateName) {
		this.stateName = stateName;
	}
	public boolean isSelected() {
		return isSelected;
	}
	public void setSelected(boolean isSelected) {
		this.isSelected = isSelected;
	}
	

}
