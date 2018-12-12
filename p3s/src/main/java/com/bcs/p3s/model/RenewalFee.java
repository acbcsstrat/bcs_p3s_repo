package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.util.lang.P3SRuntimeException;

import java.math.BigDecimal;
import javax.validation.constraints.NotNull;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.EntityManager;
import javax.persistence.OneToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findFeesByRenewal"})
public class RenewalFee {

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
    /*@NotNull
    private BigDecimal latePayPenalty_USD;
*/
    /**
     */
    @NotNull
    @Column(precision = 12, scale = 6)
    private BigDecimal fxRate;

    /**
     * Total of all fees for this Renewal (both EUR & USD) expressed in USD
     */
    @NotNull
    private BigDecimal subTotal_USD;

	public RenewalFee(BigDecimal renewalFee_EUR, BigDecimal extensionFee_EUR, BigDecimal processingFee_USD,
			BigDecimal expressFee_USD, BigDecimal urgentFee_USD,BigDecimal fxRate,
			BigDecimal subTotal_USD) {
		super();
		
		this.renewalFee_EUR = renewalFee_EUR;
		this.extensionFee_EUR = extensionFee_EUR;
		this.processingFee_USD = processingFee_USD;
		this.expressFee_USD = expressFee_USD;
		this.urgentFee_USD = urgentFee_USD;
		//this.latePayPenalty_USD = latePayPenalty_USD;
		this.fxRate = fxRate;
		this.subTotal_USD = subTotal_USD;
		
	}
    
	 @Transactional
	 public RenewalFee persist() {  
	    RenewalFee fee = new RenewalFee();  
	    EntityManager em = this.entityManager();
	    em.persist(this);
	    fee = RenewalFee.findRenewalFee(this.getId());
	    return fee;
	  }
    
	    public BigDecimal  calcTotalOfEuroFees() {
	    	BigDecimal euroTotal = new BigDecimal("0.0");
	    	if (renewalFee_EUR==null) throw new P3SRuntimeException("Goin' to Hell in a Handcart ...       renewalFee_EUR==null");

	    	euroTotal = euroTotal.add(renewalFee_EUR);
	    	if (extensionFee_EUR!=null) euroTotal = euroTotal.add(extensionFee_EUR); // if it aint null, its zero or valid

	    	return euroTotal;
	    }

}
