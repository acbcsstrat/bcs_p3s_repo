package com.bcs.p3s.model;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.Universal;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
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
    @Column(precision = 12, scale = 6)
    private BigDecimal currentMoneycorpRate;
    
    /**
     * actual P3S FX Rate EUR->USD
     * 
     * Note: RATE figures at BE (Back-End) and in dB & from MC are how-many-dollars-to-buy-one-Euro
     *  whereas Rate figures provided to the FE are WhatEurosDoes1DollarBuy (i.e. inverted)
     */
    @NotNull
    @Column(precision = 12, scale = 6)
    private BigDecimal current_P3S_rate;
    
    /**
     * Percentage by which currentP3sRate increase to currentMoneycorpRate
     */
    @NotNull
    private BigDecimal rateUpliftPercent;

    /**
     * When this currentRate became active (i.e. current / live)
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date currentRateActiveDate;

    /**
     * The key to accessing the FX SFTP site. = password reversed.
     */
    @NotNull
    private String moneycorpKey;

	/**
	 * Initially, intended only for use by the EPO Automation tasks (EPO Instruct & generate PDFs).
	 * Normally null, this flag is set upon processing start and cleared at end (inc ABEND).
	 * Purpose is to abort any subsequent invokation if this one is still running.
	 * Is date rather than boolean to support some alarm upon extended outage (DeRisk)
	 */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date currentRunStart;

    
    
    
    public static GlobalVariableSole findOnlyGlobalVariableSole() {
		List<GlobalVariableSole> allGVS = GlobalVariableSole.findAllGlobalVariableSoles();
		if (allGVS==null || allGVS.size()!=1) {
			Universal universal = new Universal();
			universal.logInternalError().fatal("findOnlyGlobalVariableSole(): No Sole GlobalVariableSole record");
		}
		GlobalVariableSole globalVariableSole = allGVS.get(0); 
        
        return globalVariableSole;
    }


}
