package com.bcs.p3s.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.enump3s.PaymentStatusEnum;
import com.bcs.p3s.enump3s.PaymentTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.validation.constraints.NotNull;
import javax.persistence.OneToOne;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;
import javax.validation.constraints.Future;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.ManyToMany;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Payment {

    /**
     */
    @NotNull
    private String P3S_TransRef;

    /**
     * For security do not send this to the front end
     */
    @NotNull
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
    @Future
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
     * If transaction fails store the reason. Else null. Suitable for display to customer.
     */
    private String statusDesc;

    /**
     */
    @NotNull
    @ManyToOne
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
    @ManyToMany(cascade = CascadeType.REFRESH)
    private List<Renewal> renewals = new ArrayList<Renewal>();



    // Setters pushed to support P3S 'Enums'

    public void setTransType(String transType) {
        this.transType = (new PaymentTypeEnum(transType)).toString();
    }
    
    public void setLatestTransStatus(String latestTransStatus) {
        this.latestTransStatus = (new PaymentStatusEnum(latestTransStatus)).toString();
    }
}
