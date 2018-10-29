package com.bcs.p3s.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.util.lang.P3SRuntimeException;



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
	
    /** AC181015 this may be redundant, as we'd always calculate? acTidy
     * i.e renewal is Not mandated - but IS optional
     */
    @NotNull
    protected Boolean isYear3RenewalDue;

    /**
     * only matters if isYear3RenewalDue is true
     * i.e. the fee IS Optional, and the customer chose to pay it
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
     * OBS Date after which is too late to apply for E-PCT - AC - amend this to ..
     * Date from which is too late to apply for E-PCT
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


    
    
    /**
     * @return either null or the One Epct associated with this patent
     */
    public static Epct findEpctByPatent(Patent patent) {
    	if (patent==null) throw new P3SRuntimeException("Epct:findEpctByPatent() passed null");
    	
    	// avoid the Hibernate message : save the transient instance before flushing
    	if (patent.getId()==null) return null; // Patent not persisted, so there cannot be any persisted Epct's

	    Patent existingPatent = Patent.findPatent(patent.getId());
	    if (existingPatent==null) return null;

	    List<Epct> epcts = (findEpctsByPatent(existingPatent, "createdDate", "ASC")).getResultList(); // "id" is not available so use "createdDate"
    	
    	if (epcts==null || epcts.size()==0) return null;
    	else return epcts.get(epcts.size()-1);
    }
    
    public List<String> extensionStatesAsList() {
    	if (extensionStates==null || extensionStates.trim().length()==0) return new ArrayList<String>();
    	return Arrays.asList(extensionStates.split(","));
    }
    public int countExtensionStates() {
    	return extensionStatesAsList().size();
    }
    public List<String> validationStatesAsList() {
    	if (validationStates==null || validationStates.trim().length()==0) return new ArrayList<String>();
    	return  Arrays.asList(extensionStates.split(","));
    }
    public int countValidationStates() {
    	return validationStatesAsList().size();
    }

    // Create this variant which returns the newly persisted item (with id)
    @Transactional
    public Epct persist() {  
    	Epct epct = new Epct();  
    	EntityManager em = this.entityManager();
        em.persist(this);
        epct = Epct.findEpct(this.getId());
        return epct;
    }
	//    replaces the aj generated ...
	//    @Transactional
	//    public void Epct.persist() {
	//        if (this.entityManager == null) this.entityManager = entityManager();
	//        this.entityManager.persist(this);
	//    }
}
