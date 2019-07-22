package com.bcs.p3s.display.form1200;

import com.bcs.p3s.form1200.AbstractState;
import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Holds a Validation State (i.e. Countries)
 * Note: ExtensionStatesUI & ValidationStatesUI intentionally duplicate each other
 *
 * Duplication / overlap warning: see CountryStatesUtil
 */
public class ValidationStateUI extends AbstractState {

	public ValidationStateUI(String code) {
		if ("MA".equals(code)) { setStateCode(code); setStateName("Morocco"); setSelected(true); }
		else if ("MD".equals(code)) { setStateCode(code); setStateName("The Republic of Moldova"); setSelected(true); }
		else if ("TN".equals(code)) { setStateCode(code); setStateName("Tunisia"); setSelected(true); }
		else if ("KH".equals(code)) { setStateCode(code); setStateName("Cambodia"); setSelected(true); }
		else throw new P3SRuntimeException("ExtensionStatesUI passed bad code : "+code);	
	}
	public ValidationStateUI() { ; }  // retained for CountryStatesUtil
	
}
