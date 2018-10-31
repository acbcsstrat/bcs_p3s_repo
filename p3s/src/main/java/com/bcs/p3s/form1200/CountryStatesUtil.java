package com.bcs.p3s.form1200;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.ValidationStateUI;

public class CountryStatesUtil {

	/**
	 * Creates hardcoded list of states, matching the EPO specification 
	 * uses: https://my.epoline.org/portal/classic/epoline.Scheduleoffees
	 */
	public static List<ExtensionStateUI> generateListOfExtensionStates() {
		List<ExtensionStateUI> eStates = new ArrayList<ExtensionStateUI>();
		
		ExtensionStateUI aState = null;
		
		aState = new ExtensionStateUI();
		aState.setStateCode("BA");
		aState.setStateName("Bosnia and Herzegovina");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ExtensionStateUI();
		aState.setStateCode("ME");
		aState.setStateName("Montenegro");
		aState.setSelected(false);
		eStates.add(aState);
		
		return eStates;
	}
	
	/**
	 * Creates hardcoded list of states, matching the EPO specification 
	 * uses: https://my.epoline.org/portal/classic/epoline.Scheduleoffees
	 */
	public static List<ValidationStateUI> generateListOfValidationStates() {
		List<ValidationStateUI> eStates = new ArrayList<ValidationStateUI>();
		
		ValidationStateUI aState = null;
		
		aState = new ValidationStateUI();
		aState.setStateCode("MA");
		aState.setStateName("Morocco");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStateUI();
		aState.setStateCode("MD");
		aState.setStateName("Republic of Moldova");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStateUI();
		aState.setStateCode("TN");
		aState.setStateName("Tunisia");
		aState.setSelected(false);
		eStates.add(aState);
		
		aState = new ValidationStateUI();
		aState.setStateCode("KH");
		aState.setStateName("Cambodia");
		aState.setSelected(false);
		eStates.add(aState);
		
		return eStates;
	}


	
	
	
	public String listSelectedAbstractStates2commaSeparatedString(List<AbstractState> list) {
		if (list==null) return null;
		// filter
		List<AbstractState> selected = new ArrayList<AbstractState>();
		for (AbstractState state : list) {
			if (state.isSelected) selected.add(state);
		}
		// create comma separated list
		if (selected.size()==0) return "";
		if (selected.size()==1) return selected.get(0).getStateCode();
		String csv = selected.get(0).getStateCode();
		for (int ii = 1; ii<selected.size(); ii++) {
			csv += (","+selected.get(ii).getStateCode());
		}
		return csv;
	}

	
	// Surely, this should not be necessary ? List<supertype> not compatible with List<type>
	public String listSelectedExtensionStatesUI2commaSeparatedString(List<ExtensionStateUI> list) {
		List<AbstractState> abs = new ArrayList<AbstractState>();
		for (AbstractState state : list) abs.add(state);
		return listSelectedAbstractStates2commaSeparatedString(abs);
	}
	public String listSelectedValidationStatesUI2commaSeparatedString(List<ValidationStateUI> list) {
		List<AbstractState> abs = new ArrayList<AbstractState>();
		for (AbstractState state : list) abs.add(state);
		return listSelectedAbstractStates2commaSeparatedString(abs);
	}


	
	// Never used ?
	//public String list2commaSeparatedString(List<String> list) {
	//	if (list==null) return null;
	//	if (list.size()==0) return "";
	//	if (list.size()==1) return list.get(0);
	//	String csv = list.get(0);
	//	for (int ii = 1; ii<list.size(); ii++) {
	//		csv += (","+list.get(ii));
	//	}
	//	return csv;
	//}
}
