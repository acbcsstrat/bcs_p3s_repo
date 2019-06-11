package com.bcs.p3s.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.enump3s.McFailCodeEnum;
import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.PaymentTypeEnum;
import javax.validation.constraints.NotNull;
import javax.persistence.OneToOne;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.EntityManager;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;


// Note! : Payment was formerly called Transaction  (But Roo wouldn't allow that term)
// Hence you'll find numerous references to 'the transaction' throughout the code.
// Not least as Transaction is a better description of the role of the object. Payment implies just the money.

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findPaymentsByP3S_TransRef" })
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
    //@Future
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date fxTarget;

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
     * Whether & when this has been sent to Moneycorp in an Order file
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date sentToMc;

    /**
     */
    @NotNull
    //@Value("false")  Don't use. It resets data AFTER read from db
    private Boolean hasFailed;

    /**
     * If transaction fails, holds 1 of the 3 codes agreed with Moneycorp :
     * see Cron:MoneycorpPaymentStatusEnum (Zaph - does p3sweb have an enum for this ?)
     */
    private String MC_failCode;

    /**
     * If transaction fails store the reason. Else null. Suitable for display to customer.
     * May also be null unless MC_failCode is 'other'
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
    private String billingAddressZip;

    /**
     */
    //@NotNull Post v1, this NotNull needed be removed
    //Previously was FetchType.EAGER :: Changed to LAZY as it returns children multiple times
    @ManyToMany(cascade = CascadeType.REMOVE , fetch = FetchType.LAZY)
    private List<Renewal> renewals = new ArrayList<Renewal>();

    /**
     * Added for v2.1 :  E-PCT / Form1200
     */
    @ManyToMany(cascade = CascadeType.REMOVE , fetch = FetchType.LAZY)
    private List<Epct> epcts = new ArrayList<Epct>();

    /**
     * Null, until we receive from Moneycorp, the signal: PaymentStatusEnum:EPO_RECEIVED
     * whereupon this timestamp is set, then never changed
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date epoRxDate;









    // superceded by below
	//// DIY finder
	//// Approach: All renewals in a transaction must be from the same business
	//public static List<Payment> findPaymentsByBusiness(Business business) {
	//    if (business == null) return null;
	//    List<Payment> result = new ArrayList<Payment>();
	//    List<Payment> everyonesPayments = Payment.findAllPayments();
	//    for (Payment someonesPayment : everyonesPayments) {
	//        Renewal rrr = null;
	//        Patent ppp = null;
	//        Business bbb = null;
	//        List<Renewal> someonesRenewals = someonesPayment.getRenewals();
	//        if (someonesRenewals.size() > 0) rrr = someonesRenewals.get(0);
	//        if (rrr != null) ppp = rrr.getPatent();
	//        if (ppp != null) {
	//            bbb = ppp.getBusiness();
	//            if (bbb != null && (bbb.getId() == business.getId())) {
	//                result.add(someonesPayment);
	//            }
	//        }
	//    }
	//    return result;
	//}

    // DIY finder
    // Approach: For ALL payments, Use Payment:initiatedByUser, locate users business, compare
    public static List<Payment> findPaymentsByBusiness(Business business) {
        if (business == null) return null;
        List<Payment> result = new ArrayList<Payment>();
        List<Payment> everyonesPayments = Payment.findAllPayments();
        for (Payment someonesPayment : everyonesPayments) {
        	P3SUser aUser = someonesPayment.initiatedByUserId;
        	long thisPaymentsBusinessId = aUser.getBusiness().getId();

            if (thisPaymentsBusinessId == business.getId()) {
                result.add(someonesPayment);
            }
        }
        return result;
    }

    public static List<Payment> findPaymentsNotYetNotifiedToMoneycorp() {
        EntityManager em = Payment.entityManager();
        TypedQuery q = em.createQuery("SELECT o FROM Payment AS o WHERE o.sentToMc IS NULL", Payment.class);
        return (List<Payment>) q.getResultList();
    }

    public static List<Payment> findPaymentsAtStatus(String status) {
        EntityManager em = Payment.entityManager();
        TypedQuery q = em.createQuery("SELECT o FROM Payment AS o WHERE o.latestTransStatus = '"+status+"'", Payment.class);
        return (List<Payment>) q.getResultList();
    }


    // Setters pushed to support P3S 'Enums'
    public void setTransType(String transType) {
        this.transType = (new PaymentTypeEnum(transType)).toString();
    }

    public void setLatestTransStatus(String latestTransStatus) {
        this.latestTransStatus = (new PaymentStatusEnum(latestTransStatus)).toString();
    }

    public void setMC_failCode(String MC_failCode) {
    	if (MC_failCode==null) this.MC_failCode = null;
    	else
    		this.MC_failCode = (new McFailCodeEnum(MC_failCode)).toString();
    }


    @Transactional
    public Payment persist() {
    	Payment payment = new Payment();
    	EntityManager em = this.entityManager();
        em.persist(this);
        payment = Payment.findPayment(this.getId());
        return payment;
    }

    public String getMC_failCode() {  // Here because Roo wont generate this!
    	return this.MC_failCode;
    }


}
