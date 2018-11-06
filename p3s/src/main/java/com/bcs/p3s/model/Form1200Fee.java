package com.bcs.p3s.model;

import java.math.BigDecimal;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.OneToOne;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

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
    protected BigDecimal totalClaimsFee1_EUR;

    /**
     * Fee payable for each Claim #51 and thereafter
     * May be Zero
     */
    @NotNull
    protected BigDecimal totalClaimsFee2_EUR;

    /**
     * Additional filing fee for each page in excess of 35 pages
     * May be Zero
     */
    @NotNull
    protected BigDecimal totalExcessPageFee_EUR;

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
     * Note: Setting this >0 signals calcTotalFee() to recalculate this - +below : 181023 AC suspect this redundant. calcTotalFee not exist. Can find no mention. Keep Watch. acTodo
     */
    @NotNull
    protected BigDecimal expressFee_USD;

    /**
     * May be Zero
     * Note: Setting this >0 signals calcTotalFee() to recalculate this
     */
    @NotNull
    protected BigDecimal urgentFee_USD;

    /**
     * >0
     * How many USD does P3S charge to buy a EUR
     */
    @NotNull
    @Column(precision = 12, scale = 6)
    protected BigDecimal fxRate;

    /**
     * Total of all fees for this E-PCT (both EUR & USD) expressed in USD
     * 
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
    
    
    public BigDecimal  calcTotalOfEuroFees() {
    	BigDecimal euroTotal = new BigDecimal("0.0");

    	euroTotal = nvlAdd(euroTotal, filingFee_EUR);
    	euroTotal = nvlAdd(euroTotal, supplementarySearchFee_EUR);
    	euroTotal = nvlAdd(euroTotal, designationStatesFee_EUR);
    	euroTotal = nvlAdd(euroTotal, totalExtensionStatesFee_EUR);
    	euroTotal = nvlAdd(euroTotal, totalValidationStatesFee_EUR);
    	euroTotal = nvlAdd(euroTotal, examinationFee_EUR);
 		euroTotal = nvlAdd(euroTotal, totalClaimsFee1_EUR);
 		euroTotal = nvlAdd(euroTotal, totalClaimsFee2_EUR);
 		euroTotal = nvlAdd(euroTotal, totalExcessPageFee_EUR);
 		euroTotal = nvlAdd(euroTotal, renewalFee_EUR);

 		return euroTotal;
    }
    protected BigDecimal nvlAdd(BigDecimal total, BigDecimal item) {
    	if (item == null) return total;
    	else return total.add(item);
    }


    /**
     * Prior to persisting, certain fields may be null.
     * But upon persisting (& in the FE contract), most fields cannot be null. If not set, they'll be Zero
     * 
     * Note: this Only changes null. It does NOT perform totals. a rate of zero may cause issues !
     */
    public void ensureNoNulls() {
    	BigDecimal zero = BigDecimal.ZERO;
    	if (filingFee_EUR==null) filingFee_EUR = zero; 
    	if (supplementarySearchFee_EUR==null) supplementarySearchFee_EUR = zero; 
    	if (designationStatesFee_EUR ==null) designationStatesFee_EUR  = zero; 
    	if (totalExtensionStatesFee_EUR ==null) totalExtensionStatesFee_EUR  = zero; 
    	if (totalValidationStatesFee_EUR==null) totalValidationStatesFee_EUR = zero; 
    	if (examinationFee_EUR==null) examinationFee_EUR = zero; 
    	if (totalClaimsFee1_EUR==null) totalClaimsFee1_EUR = zero; 
    	if (totalClaimsFee2_EUR==null) totalClaimsFee2_EUR = zero; 
    	if (totalExcessPageFee_EUR==null) totalExcessPageFee_EUR = zero; 
    	if (renewalFee_EUR==null) renewalFee_EUR = zero; 
    	if (processingFee_USD==null) processingFee_USD = zero; 
    	if (expressFee_USD==null) expressFee_USD = zero; 
    	if (urgentFee_USD==null) urgentFee_USD = zero; 
    	if (subTotal_USD==null) subTotal_USD = zero; 
    	if (fxRate==null) fxRate = zero; 
    }

    
    
    // Create this variant which returns the newly persisted item (with id)
    @Transactional
    public Form1200Fee persist() {  
    	Form1200Fee form1200Fee = new Form1200Fee();  
    	EntityManager em = this.entityManager();
        em.persist(this);
        form1200Fee = Form1200Fee.findForm1200Fee(this.getId());
        return form1200Fee;
    }
	//    replaces the aj generated ...
    //    @Transactional
	//    public void Form1200Fee.persist() {
	//        if (this.entityManager == null) this.entityManager = entityManager();
	//        this.entityManager.persist(this);
	//    }
}
