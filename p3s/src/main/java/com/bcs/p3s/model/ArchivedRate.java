package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import java.math.BigDecimal;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class ArchivedRate {

    /**
     */
    @NotNull
    private BigDecimal fxRate;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date activeFromDate;

    
    public static ArchivedRate findLatestArchivedRate() {
    	// Would like to use "SELECT o FROM ArchivedRate o order by o.activeFromDate desc limit 1";
        String jpaQuery = "SELECT o FROM ArchivedRate o order by o.activeFromDate desc";

        TypedQuery<ArchivedRate> query  = entityManager().createQuery(jpaQuery, ArchivedRate.class);
        query.setMaxResults(1);
        List<ArchivedRate> mostRecent = (List<ArchivedRate>) query.getResultList();
        System.out.println("   size of latest ONE ArchivedRate is "+mostRecent.size());
        ArchivedRate theMostRecent = mostRecent.get(0);

        return theMostRecent;
    }

    public static BigDecimal findArchivedRateForDate(Date activeFromDate) {
    	// Would like to use "SELECT o FROM ArchivedRate o order by o.activeFromDate desc limit 1";
        String jpaQuery = "SELECT o FROM ArchivedRate o where o.activeFromDate  = :activeFromDate" ;

        TypedQuery<ArchivedRate> query  = entityManager().createQuery(jpaQuery, ArchivedRate.class);
        query.setParameter("activeFromDate", activeFromDate);

        return query.getSingleResult().getFxRate();
    }

}
