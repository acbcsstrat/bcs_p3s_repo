package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import java.math.BigDecimal;
import javax.validation.constraints.NotNull;
import javax.persistence.OneToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Fee {

    /**
     */
    @NotNull
    @OneToOne
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
    @NotNull
    private BigDecimal latePayPenalty_USD;

    /**
     */
    @NotNull
    private BigDecimal fxRate;

    /**
     */
    @NotNull
    private BigDecimal subTotal_USD;
}
