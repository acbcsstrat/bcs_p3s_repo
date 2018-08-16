package com.bcs.p3s.display.form1200;

/**
 * Holds Extension States (i.e. Countries)
 * Note: ExtensionStatesUI & ValidationStatesUI intentionally duplicate each other
 *
 */
public class ValidationStatesUI {

	public String stateCode;
	public String stateName;
	boolean isSelected;

	
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
