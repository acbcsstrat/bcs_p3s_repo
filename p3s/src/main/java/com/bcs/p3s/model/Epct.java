package com.bcs.p3s.model;

import java.util.Date;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;



/**
 * This captures the details required for submitting an E-PCT to the EPO.
 * Some details are calculated from rules. Some are user-entered data.
 * 
 * Once created, the user can edit, delete or submit these details. 
 *
 * See also: Form1200Fee & Form1200
 */

// @RooJpaActiveRecord(finders = { "findEpctsByPatent" })  zapp

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findEpctsByPatent" })
public class Epct {

    /**
     */
    @NotNull
    @ManyToOne
    protected Patent patent;

    
    /**  
     * 1:1 Fee. Must be created prior to this object persisted
     */
    @NotNull
    @OneToOne
    protected Form1200Fee form1200Fee;

    
    /**
     * Holds the PDF, once created
     */
//    @OneToOne(optional = true) zapp
//    protected Form1200 form1200;  
    @OneToOne
    protected Form1200 form1200;

    
    
    /**
     * comma separated 2character codes (tolerate spaces)
     */
    @NotNull
    protected String  extensionStates;

    /**
     * comma separated 2character codes (tolerate spaces)
     */
    @NotNull
    protected String  validationStates;

    /**
     * >0
     */
    @NotNull
    protected Integer totalClaims;

    /**
     * >0
     */
    @NotNull
    protected Integer totalPages;

    /**
     * >0
     */
    @NotNull
    protected Integer descriptionStartPage;

    /**
     * >0
     */
    @NotNull
    protected Integer descriptionEndPage;

	/**
     * >0
	 */
	@NotNull
	protected Integer claimsStartPage;
	
	/**
     * >0
	 */
	@NotNull
	protected Integer claimsEndPage;
	
	/**
     * >0
	 */
	@NotNull
	protected Integer drawingsStartPage;
	
	/**
     * >0
	 */
	@NotNull
	protected Integer drawingsEndPage;
	
    /**
     */
    @NotNull
    protected Boolean isYear3RenewalDue;

    /**
     * only matters if isYear3RenewalDue is true
     */
    @NotNull
    protected Boolean isYear3RenewalPaying;

    /**
     * Null until customer commits to E-PCT
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    protected Date epctSubmittedDate;

    /**
     * Date after which is too late to apply for E-PCT
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    protected Date epctApplicationExpiryDate;

    /** 
     * Our P3S E-PCT status. 1 of the 11 values from 
     * T:\PatentPlace\pp-release-2.1\Specifications\Fees and Status Values\180807b Status Values - GRID.xlsx 
     * Values from Form1200StatusEnum
     * See also vmpi13
    */
    @NotNull
    protected String epctStatus;

    
    @NotNull
    @OneToOne
    protected P3SUser createdBy;

    
    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    protected Date createdDate;


    
    
}
