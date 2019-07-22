package com.bcs.p3s.form1200;

import java.util.LinkedHashMap;

import com.bcs.p3s.display.form1200.PageDescriptionEnum;
import com.bcs.p3s.display.form1200.PageDescriptionUI;

/**
 * Abstract state for 2character Country/States
 *  as used for Form1200 processing
 */
public abstract class AbstractState {
	
	public String stateCode;
	public String stateName;
	boolean isSelected;

	
	
	public void extractStateUI(LinkedHashMap<String, Object> asMap) {
		String strStateCode = (String) asMap.get("stateCode");
		String strStateName = (String) asMap.get("stateName");
		//String strSelected  = (String) asMap.get("selected");
		//Boolean boolSelected = new Boolean(strSelected); 
		Boolean boolSelected = (Boolean) asMap.get("selected");
		stateCode = strStateCode;
		stateName = strStateName;
		isSelected = boolSelected;
	}
	
	
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
