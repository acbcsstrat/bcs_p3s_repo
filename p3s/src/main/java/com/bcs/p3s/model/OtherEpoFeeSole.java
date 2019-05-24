package com.bcs.p3s.model;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.Universal;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class OtherEpoFeeSole {


    /**
     */
    @NotNull
    private BigDecimal filingFee_EUR;


    /**
     * mpi11: if SA matches isr/EP, this fee is not charged
     */
    @NotNull
    private BigDecimal supplementarySearchFee_EUR;


    /**
     * Chargeable once for ALL designated states.
     * Note: we do not offer a reduction is <7 states
     */
    @NotNull
    private BigDecimal designationStatesFee_EUR;


    /**
     */
    @NotNull
    private BigDecimal extensionFee_BA_EUR;


    /**
     */
    @NotNull
    private BigDecimal extensionFee_ME_EUR;


    /**
     */
    @NotNull
    private BigDecimal validationFee_MA_EUR;


    /**
     */
    @NotNull
    private BigDecimal validationFee_MD_EUR;


    /**
     */
    @NotNull
    private BigDecimal validationFee_TN_EUR;


    /**
     */
    @NotNull
    private BigDecimal validationFee_KH_EUR;


    /**
     */
    @NotNull
    private BigDecimal examinationFee_EUR;


    /**
     * Charge this (lower) exam fee if the search fee is being charged
     */
    @NotNull
    private BigDecimal examinationReducedFee_EUR;


    /**
     * Fee payable for each Claim #15 - #50, inclusive
     */
    @NotNull
    private BigDecimal claimsFee1_EUR;


    /**
     * Fee payable for each Claim #51 and thereafter
     */
    @NotNull
    private BigDecimal claimsFee2_EUR;


    /**
     * Additional filing fee for each page in excess of 35 pages
     */
    @NotNull
    private BigDecimal excessPagesFee_EUR;

    

    public static OtherEpoFeeSole findOnlyOtherEpoFeeSole() {
		List<OtherEpoFeeSole> allf1200Fees = OtherEpoFeeSole.findAllOtherEpoFeeSoles();
		if (allf1200Fees==null || allf1200Fees.size()!=1) {
			Universal universal = new Universal();
			universal.logInternalError().fatal("findOnlyOtherEpoFeeSole(): No Sole OtherEpoFeeSole record");
		}
		OtherEpoFeeSole sole = allf1200Fees.get(0); 
        return sole;
    }
    
}
