package com.bcs.p3s.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.OneToOne;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

/**
 * [For Release 2.1 : E-PCT ] This entity is 1:1 with EPCT.
 * This entity holds the pricing for the E-PCT application, as last calculated, 
 * so keeps EPCT somewhat tidier.
 */
@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findForm1200FeesByEpct" })
public class Form1200Fee {

	// All entities are NotNull. But many BigDecimal fields may contain a Zero value. Comments advise. 
	
    /**
     */
    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    protected Epct epct;

    /**
     * >0
     */
    @NotNull
    protected BigDecimal filingFee_EUR;

    
    /**
     * mpi11: if SA matches isr/EP, this fee is not charged
     * May be Zero
     */
    @NotNull
    protected BigDecimal supplementarySearchFee_EUR;

    /**
     * Chargeable once for ALL designated states.
     * Note: we do not offer a reduction is <7 states
     * >0
     */
    @NotNull
    protected BigDecimal designationStatesFee_EUR; 

    /**
     * Totals the fees due for the Extension sates selected by the user (if any)
     * May be Zero
     */
    @NotNull
    protected BigDecimal totalExtensionStatesFee_EUR; 

    /**
     * Totals the fees due for the Validation sates selected by the user (if any)
     * May be Zero
     */
    @NotNull
    protected BigDecimal totalValidationStatesFee_EUR;

    /**
     * >0
     */
    @NotNull
    protected BigDecimal examinationFee_EUR;

    /**
     * Fee payable for each Claim #15 - #50, inclusive
     * May be Zero
     */
    @NotNull
    protected BigDecimal claimsFee1_EUR;

    /**
     * Fee payable for each Claim #51 and thereafter
     * May be Zero
     */
    @NotNull
    protected BigDecimal claimsFee2_EUR;

    /**
     * Additional filing fee for each page in excess of 35 pages
     * May be Zero
     */
    @NotNull
    protected BigDecimal excessPageFee_EUR;

    /**
     * The Year3 renewal fee (are rules determining if this must/can be paid)
     * May be Zero
     */
    @NotNull
    protected BigDecimal renewalFee_EUR;

    /**
     * May be Zero .. Though is unlikely so to be
     */
    @NotNull
    protected BigDecimal processingFee_USD;

    /**
     * May be Zero
     */
    @NotNull
    protected BigDecimal expressFee_USD;

    /**
     * May be Zero
     */
    @NotNull
    protected BigDecimal urgentFee_USD;

    /**
     * >0
     * How many USD does P3S charge to buy a EUR
     */
    @NotNull
    protected BigDecimal fxRate;

    /**
     * >0
     */
    @NotNull
    protected BigDecimal subTotal_USD;



    
    
    /* 
     * Each EPCT will have exactly one Form1200Fee
     * This method finds it.
     */
    public static Form1200Fee findOnlyForm1200FeeByEpct(Epct epct) {
    	if (epct==null) return null;

    	Form1200Fee form1200Fee = null;
    	try {
	    	TypedQuery<Form1200Fee> feesTQ = Form1200Fee.findForm1200FeesByEpct(epct);
	    	form1200Fee = feesTQ.getSingleResult();
		} catch (NoResultException | NonUniqueResultException  notOne ) {
			String err = "Form1200Fee: No Sole Form1200Fee for EPCT id "+epct.getId();
			Universal universal = new Universal();
			universal.logErrorAndContinue(err, notOne);
			throw new P3SRuntimeException(err, notOne);
		}
    	return form1200Fee;
    }
    
}
