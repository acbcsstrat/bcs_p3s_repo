package com.bcs.p3s.display.form1200;

import com.bcs.p3s.form1200.AbstractState;
import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Holds an Extension State (i.e. Countries)
 * Note: ExtensionStateUI & ValidationStateUI mostly intentionally duplicate each other
 *
 * Duplication / overlap warning: see CountryStatesUtil
 */
public class ExtensionStateUI extends AbstractState {

	public ExtensionStateUI(String code) {
		if ("BA".equals(code)) { setStateCode(code); setStateName("Bosnia and Herzegovina"); setSelected(true); }
		else if ("ME".equals(code)) { setStateCode(code); setStateName("Montenegro"); setSelected(true); }
		else throw new P3SRuntimeException("ExtensionStatesUI passed bad code : "+code);	
	}
	public ExtensionStateUI() { ; }  // retained for CountryStatesUtil

	
}
