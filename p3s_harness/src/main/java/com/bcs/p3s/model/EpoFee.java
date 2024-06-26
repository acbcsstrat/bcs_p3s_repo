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
public class EpoFee {

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
    
    public static EpoFee findEpoFeesByRenewalYear(EpoFee epoFee) {
    	//new EpoFee();
		EntityManager em = EpoFee.entityManager();
		TypedQuery<EpoFee> query = em.createQuery("SELECT o FROM EpoFee AS o WHERE o.renewalYear = :renewalYear", EpoFee.class);
		query.setParameter("renewalYear", epoFee.getRenewalYear());
        return query.getSingleResult();
    }
    
}
