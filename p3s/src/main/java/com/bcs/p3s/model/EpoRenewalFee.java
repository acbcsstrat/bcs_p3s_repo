package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class EpoRenewalFee {

    /**
     * From 3 to 20
     */
    @NotNull
    private Integer renewalYear;

    /**
     */
    @NotNull
    private BigDecimal renewalFee_EUR;

    /**
     */
    @NotNull
    private BigDecimal extensionFee_EUR;
    
    public static EpoRenewalFee findEpoRenewalFeesByRenewalYear(Integer epoRenewalYear) {
    	//new EpoFee();
		EntityManager em = EpoRenewalFee.entityManager();
		TypedQuery<EpoRenewalFee> query = em.createQuery("SELECT o FROM EpoRenewalFee AS o WHERE o.renewalYear = :renewalYear", EpoRenewalFee.class);
		query.setParameter("renewalYear", epoRenewalYear);
        return query.getSingleResult();
    }
    
}
