package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class DiscountPercent {

    /**
     */
    @NotNull
    @OneToOne
    private Business business;

    /**
     */
    private BigDecimal processingFee;

    /**
     */
    private BigDecimal expressFee;

    /**
     */
    private BigDecimal urgentFee;

    /**
     */
    private BigDecimal latePayPenalty;
}
