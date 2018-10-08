package com.bcs.p3s.model;

import javax.validation.constraints.NotNull;

/**
 * Created for v2.1, for Form1200 applications
 */
public class ExtensionState {

	// Yes, ExtensionState & ValidationState are identical. Intentionally.
	
    /**
     */
    @NotNull
    private String stateName; 

    /**
     */
    @NotNull
    private String stateCode; 

    /**
     */
    @NotNull
    private Boolean isActive; 

}
