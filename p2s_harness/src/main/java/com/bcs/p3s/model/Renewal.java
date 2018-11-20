package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.persistence.CascadeType;
import javax.persistence.EntityManager;

import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PreRemove;
import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findRenewalsByPatent" , "findRenewalsByActivePaymentId" })

public class Renewal {

    /**
     */
    @NotNull
    @ManyToOne
    private Patent patent;

    /**
     */
    @NotNull
    @ManyToOne
    private Payment activePaymentId;

    /**
     */
    @NotNull
    @ManyToOne(cascade = CascadeType.REMOVE)
    private RenewalFee renewalFee;

    /**
     */
    @OneToOne(cascade = CascadeType.REMOVE)
    private Certificate certificate;

    /**
     * From 3 to 20
     */
    private Integer renewalYear;

    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date renewalDueDate;

    /**
     * The renewal colour.  Enum: RenewalColourEnum 
     */
    private String renewalPeriod;

    /**
     * Enum: RenewalStatusEnum :WARNING: This duplicates Patent:renewalStatus
     */
    private String renewalStatus;

    /**
     * Invariably 1. Thereafter is latePayPenalty & 48hours-ish for each retry
     */
    @NotNull
    private Integer renewalAttemptsMade;



    // Setters pushed to support P3S 'Enums'

    public void setRenewalPeriod(String renewalPeriod) {
        this.renewalPeriod = (new RenewalColourEnum(renewalPeriod)).toString();
    }
    public void setRenewalStatus(String renewalStatus) {
        this.renewalStatus = (new RenewalStatusEnum(renewalStatus)).toString();
    }
    
    @Transactional
    public Renewal persist() {  
    	Renewal renewal = new Renewal();  
    	EntityManager em = this.entityManager(); 
        em.persist(this);
        renewal = Renewal.findRenewal(this.getId());
        return renewal;
    }
    
//    @PreRemove
//    private void preRemove() {
//        Payment payment = this.getActivePaymentId();
//        Payment.
//    }
}
