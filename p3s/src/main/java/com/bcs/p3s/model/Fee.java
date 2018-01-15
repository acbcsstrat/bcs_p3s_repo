package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import javax.validation.constraints.NotNull;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.EntityManager;
import javax.persistence.OneToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findFeesByRenewal"})
public class Fee {

    /**
     */
    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Renewal renewal;

    /**
     */
    @NotNull
    private BigDecimal renewalFee_EUR;

    /**
     */
    @NotNull
    private BigDecimal extensionFee_EUR;

    /**
     */
    @NotNull
    private BigDecimal processingFee_USD;

    /**
     */
    @NotNull
    private BigDecimal expressFee_USD;

    /**
     */
    @NotNull
    private BigDecimal urgentFee_USD;

    /**
     */
    @NotNull
    private BigDecimal latePayPenalty_USD;

    /**
     */
    @NotNull
    @Column(precision = 12, scale = 6)
    private BigDecimal fxRate;

    /**
     */
    @NotNull
    private BigDecimal subTotal_USD;

	public Fee(BigDecimal renewalFee_EUR, BigDecimal extensionFee_EUR, BigDecimal processingFee_USD,
			BigDecimal expressFee_USD, BigDecimal urgentFee_USD, BigDecimal latePayPenalty_USD, BigDecimal fxRate,
			BigDecimal subTotal_USD) {
		super();
		
		this.renewalFee_EUR = renewalFee_EUR;
		this.extensionFee_EUR = extensionFee_EUR;
		this.processingFee_USD = processingFee_USD;
		this.expressFee_USD = expressFee_USD;
		this.urgentFee_USD = urgentFee_USD;
		this.latePayPenalty_USD = latePayPenalty_USD;
		this.fxRate = fxRate;
		this.subTotal_USD = subTotal_USD;
		
	}
    
	 @Transactional
	 public Fee persist() {  
	    Fee fee = new Fee();  
	    EntityManager em = this.entityManager();
	    em.persist(this);
	    fee = Fee.findFee(this.getId());
	    return fee;
	  }
    
}
