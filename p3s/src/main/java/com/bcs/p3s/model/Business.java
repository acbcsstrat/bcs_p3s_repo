package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findBusinessesByBusinessNumber"})
public class Business {

    /**
     */
    @NotNull
    @Column(unique = true)
    private String businessNumber;

    /**
     */
    @NotNull
    @Min(100L)
    @Max(9999L)
    private Integer businessPin;
    
    /**
     */
    @NotNull
    private String businessName;

    /**
     */
    @NotNull
    private Long phoneNumber;

    /**
     */
    @NotNull
    private String timezone;

    /**
     */
    @NotNull
    private String street;

    /**
     */
    @NotNull
    private String city;

    /**
     */
    @NotNull
    private String USstate;

    /**
     */
    @NotNull
    private Long zip;

    /**
     */
    @NotNull
    private Boolean isBillingAddressSame;

    /**
     */
    @NotNull
    private String billingStreet;

    /**
     */
    @NotNull
    private String billingCity;

    /**
     */
    @NotNull
    private String billingState;

    /**
     */
    @NotNull
    private Long billingZip;

    
}
