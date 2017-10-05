package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import javax.validation.constraints.NotNull;
import javax.persistence.OneToOne;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import org.springframework.format.annotation.DateTimeFormat;
import javax.validation.constraints.Future;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.EntityManager;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.beans.factory.annotation.Value;

// Note! : Payment was formerly called Transaction  (But Roo wouldn't allow that term)
// Hence you'll find numerous references to 'the transaction' throughout the code.
// Not least as Transaction is a better description of the role of the object. Payment implies just the money. 

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Payment {

    /**
     */
    //@NotNull
    private String P3S_TransRef;
 
    /**
     * For security do not send this to the front end
     */
   // @NotNull - This will be null during the initial insert
    private String MC_TransRef;

    /**
     * Enum: PaymentTypeEnum
     */
    @NotNull
    private String transType;

    /**
     */
    @NotNull
    @OneToOne
    private P3SUser initiatedByUserId;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date transStartDate;

    /**
     */
    @NotNull
    //@Future
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date transTargetEndDate;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date lastUpdatedDate;

    /**
     * Enum: PaymentStatusEnum
     */
    @NotNull
    private String latestTransStatus;

    /**
     */
    @NotNull
    //@Value("false")  Don't use. It resets data AFTER read from db
    private Boolean hasFailed;

    /**
     * If transaction fails store the reason. Else null. Suitable for display to customer.
     */
    private String failureReason;

    /**
     */
    @NotNull
    @ManyToOne(cascade = CascadeType.REMOVE)
    private Invoice latestInvoice;

    /**
     */
    @NotNull
    private BigDecimal transAmount_USD;

    /**
     */
    @NotNull
    private Boolean isBillingAddressSame;

    /**
     */
    @NotNull
    private String billingAddressStreet;

    /**
     */
    @NotNull
    private String billingAddressCity;

    /**
     */
    @NotNull
    private String billingAddressState;

    /**
     */
    @NotNull
    private Long billingAddressZip;

    /**
     */
    @NotNull
    @ManyToMany(cascade = CascadeType.REMOVE , fetch = FetchType.EAGER)
    private List<Renewal> renewals = new ArrayList<Renewal>();

    // DIY finder
    // Approach: All renewals in a transaction must be from the same business
    public static List<Payment> findPaymentsByBusiness(Business business) {
        if (business == null) return null;
        List<Payment> result = new ArrayList<Payment>();
        List<Payment> everyonesPayments = Payment.findAllPayments();
        for (Payment someonesPayment : everyonesPayments) {
            Renewal rrr = null;
            Patent ppp = null;
            Business bbb = null;
            List<Renewal> someonesRenewals = someonesPayment.getRenewals();
            if (someonesRenewals.size() > 0) rrr = someonesRenewals.get(0);
            if (rrr != null) ppp = rrr.getPatent();
            if (ppp != null) {
                bbb = ppp.getBusiness();
                if (bbb != null && (bbb.getId() == business.getId())) {
                    result.add(someonesPayment);
                }
            }
        }
        return result;
    }
    
    // Setters pushed to support P3S 'Enums'
    public void setTransType(String transType) {
        this.transType = (new PaymentTypeEnum(transType)).toString();
    }

    public void setLatestTransStatus(String latestTransStatus) {
        this.latestTransStatus = (new PaymentStatusEnum(latestTransStatus)).toString();
    }
    
    
    @Transactional
    public Payment persist() {  
    	Payment payment = new Payment();  
    	EntityManager em = this.entityManager();
        em.persist(this); 
        payment = Payment.findPayment(this.getId());
        return payment;
    }

}
