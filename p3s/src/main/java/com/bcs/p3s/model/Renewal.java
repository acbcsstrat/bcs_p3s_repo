package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
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
    @ManyToOne
    private Fee fee;

    /**
     */
    @ManyToOne
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
     * i.e. the renewal colour
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

    public void setRenewalStatus(String renewalStatus) {
        this.renewalStatus = (new RenewalStatusEnum(renewalStatus)).toString();
    }
}
