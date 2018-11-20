package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
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
    @Column(precision = 12, scale = 6)
    private BigDecimal fxRate_MC;
    
    @NotNull
    @Column(precision = 12, scale = 6)
    private BigDecimal fxRate_P3s;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date archivedDate;

    
    public static ArchivedRate findLatestArchivedRate() {
    	// Would like to use "SELECT o FROM ArchivedRate o order by o.activeFromDate desc limit 1";
        String jpaQuery = "SELECT o FROM ArchivedRate o order by o.archivedDate desc";

        TypedQuery<ArchivedRate> query  = entityManager().createQuery(jpaQuery, ArchivedRate.class);
        query.setMaxResults(1);
        List<ArchivedRate> mostRecent = (List<ArchivedRate>) query.getResultList();
        System.out.println("   size of latest ONE ArchivedRate is "+mostRecent.size());
        ArchivedRate theMostRecent = mostRecent.get(0);
 
        return theMostRecent;
    }

    public static ArchivedRate findArchivedRateForDate(Date activeFromDate) {
    	// Would like to use "SELECT o FROM ArchivedRate o order by o.activeFromDate desc limit 1";
        String jpaQuery = "SELECT o FROM ArchivedRate o where o.activeFromDate  = :activeFromDate" ;

        TypedQuery<ArchivedRate> query  = entityManager().createQuery(jpaQuery, ArchivedRate.class); 
        query.setParameter("activeFromDate", activeFromDate);

        return query.getSingleResult();
    }
    
    //METHOD TO GET LAST 6 DAYS RATE
    
    public static List<ArchivedRate> findListArchivedRate() {
        /*String jpaQuery = "SELECT o FROM ArchivedRate o order by o.activeFromDate desc";

        TypedQuery<ArchivedRate> query  = entityManager().createQuery(jpaQuery, ArchivedRate.class);*/
    	
    	List<ArchivedRate> query  = ArchivedRate.findAllArchivedRates();
        //query.setMaxResults(6);
    	int size = query.size();
       // query.subList(size, size-5);
        List<ArchivedRate> mostRecent = (List<ArchivedRate>) query.subList(size-5, size);
        System.out.println("   size of latest ONE ArchivedRate is "+mostRecent.size());
        
        return mostRecent;
    }

    public static List<ArchivedRate> findAllArchivedRates() {
        return entityManager().createQuery("SELECT o FROM ArchivedRate o", ArchivedRate.class).getResultList();
    }
}
