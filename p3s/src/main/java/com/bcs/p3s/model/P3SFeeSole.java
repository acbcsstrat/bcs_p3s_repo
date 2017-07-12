package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import java.math.BigDecimal;
import javax.validation.constraints.NotNull;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class P3SFeeSole {

    /**
     * SOLE indicates that there is ALWAYS just one record in this table
     */
    @NotNull
    private BigDecimal processingFee_USD;

    /**
     */
    @NotNull
    private BigDecimal expressFee_Percent;

    /**
     */
    @NotNull
    private BigDecimal urgentFee_Percent;

    /**
     */
    @NotNull
    private BigDecimal latePayPenalty_USD;
}
