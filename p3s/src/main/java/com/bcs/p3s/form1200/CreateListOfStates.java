package com.bcs.p3s.form1200;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.display.form1200.ExtensionStatesUI;
import com.bcs.p3s.display.form1200.ValidationStatesUI;

/**
 * Creates hardcoded list of states, matching the EPO specification 
 * uses: https://my.epoline.org/portal/classic/epoline.Scheduleoffees
 */
public class CreateListOfStates {

	public static List<ExtensionStatesUI> generateListOfExtensionStates() {
		List<ExtensionStatesUI> eStates = new ArrayList<ExtensionStatesUI>();
		
		ExtensionStatesUI aState = null;
		
		aState = new ExtensionStatesUI();
		aState.setStateCode("BA");
		aState.setStateName("Bosnia and Herzegovina");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ExtensionStatesUI();
		aState.setStateCode("ME");
		aState.setStateName("Montenegro");
		aState.setSelected(false);
		eStates.add(aState);
		
		return eStates;
	}
	
	public static List<ValidationStatesUI> generateListOfValidationStates() {
		List<ValidationStatesUI> eStates = new ArrayList<ValidationStatesUI>();
		
		ValidationStatesUI aState = null;
		
		aState = new ValidationStatesUI();
		aState.setStateCode("MA");
		aState.setStateName("Morocco");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStatesUI();
		aState.setStateCode("MD");
		aState.setStateName("Republic of Moldova");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStatesUI();
		aState.setStateCode("TN");
		aState.setStateName("Tunisia");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStatesUI();
		aState.setStateCode("KH");
		aState.setStateName("Cambodia");
		aState.setSelected(false);
		eStates.add(aState);
		
		return eStates;
	}
	
}
