package com.bcs.p3s.model;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.Universal;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class GlobalVariableSole {

    /**
     * TBD_acTidy How many Euros does One USD buy
     */
    @NotNull
    private BigDecimal currentRate;

    /**
     * When this currentRate became active (i.e. current / live)
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date currentRateActiveDate;

    
    public static GlobalVariableSole findOnlyGlobalVariableSole() {
		List<GlobalVariableSole> allGVS = GlobalVariableSole.findAllGlobalVariableSoles();
		if (allGVS==null || allGVS.size()!=1) {
			Universal universal = new Universal();
			universal.logInternalError().fatal("GlobalVariableSole: No Sole GlobalVariableSole record");
		}
		GlobalVariableSole globalVariableSole = allGVS.get(0); 
        
        return globalVariableSole;
    }

}
