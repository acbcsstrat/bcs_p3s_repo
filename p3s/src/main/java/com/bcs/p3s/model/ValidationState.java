package com.bcs.p3s.model;

import javax.validation.constraints.NotNull;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

/**
 * Created for v2.1, for Form1200 applications
 */
@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class ValidationState {

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
