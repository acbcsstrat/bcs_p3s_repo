package com.bcs.p3s.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.validation.constraints.NotNull;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;
import javax.persistence.EntityManager;



@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findPatentsByBusiness" })
@OnDelete(action = OnDeleteAction.CASCADE)
public class Patent {

	//  mpiNN codes refer to the definitions in '180730e form1200 Scrape specification.docx', created for Phase 2.1 / E-PCT
	
    /** mpi04
     */
    @NotNull
    private String EP_ApplicationNumber;

    /** mpi10
     */
    @NotNull
    private String title; 

    /** mpi05
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date internationalFilingDate; 

    /**
     */
    @NotNull
    @ManyToOne
    private Business business;

    /**
     */
    @NotNull
    private String primaryApplicantName;

    /**
     */
    // May be Null
    @Size(max = 30)
    private String clientRef;

    /**
     */
    // May be Null
    @Size(max = 25)
    private String shortTitle;

    /** 
     * updated on overnight EPO scrape
     * vmpi12: 1 of the 17 values. 
     * For E-PCT must be #17 = 'The international publication has been made' 
     * This value also determines vmpi13 - i.e. Stage = Filing, Prosecution , ..
    */
    @NotNull
    private String epoPatentStatus;

    /**
     * updated on overnight scrape
     * The date, reported from the EPO, when this patent was last renewed
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date lastRenewedDateExEpo;

    /**
     * updated on overnight scrape
     */
    @NotNull
    private Integer lastRenewedYearEpo; 
    
    /**
     * calculated via overnight processing engine
     * renewalYear will be updated when green starts and will remain the same until the next year's green starts
     */
    @NotNull
    private Integer renewalYear;

    /**
     * Enum: RenewalStatusEnum :
     * NOTE: This mimics Renewal:renewalStatus
     * which is calculated via overnight processing engine
     */
    @NotNull
    private String renewalStatus;

    /**
     */
    @NotNull
    private String EP_PublicationNumber;
    
    /** mpi03: Comma-Space separated
     */
    private String ipcCodes; 
    
    /**
     */
    private String representative;
    
    /**
     */
    @NotNull
    private String checkDigit;


    // Start of: Fields added for phase 2.1 : E-PCT : Form1200  //
    
    // These fields could be NOT NULL for offering E-PCT to Americans. But for later phases, this doesn't hold.
    // So db allows Nulls. Coding must ensure they are populated as required. 

    

    /** mpi01: Typ: 'en'
    */
    private String internationalFilingLang;
    
    /** mpi06: Typ: WO2013US51650
    */
    private String PCT_applicationNumber;
    
    /** mpi02: Typ: WO2013US51650
    */
    private String PCT_publicationNumber;
    
    /** mpi11: search-type then office. For E-PCT, must be 'isr/EP'
    */
    private String internationalSearchAuthority;
    
    /** mpi09: comma-separated 2character states. Typically about 30. Tolerate spaces.
    */
    private String designated_states;
    
    /** 
     * Our P3S E-PCT status. 1 of the 11 values from 
     * T:\PatentPlace\pp-release-2.1\Specifications\Fees and Status Values\180807b Status Values - GRID.xlsx 
     * Values from Form1200StatusEnum
     * Will follow the field of same name in the latest Epct record (if any)
     * See also vmpi13
    */
    private String epctStatus;
    
    /** Will only be populated if epctStatus is EPCT_AVAILABLE or EPCT_REJECTED
     * 
     * The possible codes are specified in the (FE/BE) API 
     * See EPCTnotAvailableReasonEnum
     * 
     * if epctStatus is EPCT_AVAILABLE, the reason explains why an E-PCT application cannot be started  
     * if epctStatus is EPCT_REJECTED,  the reason explains why the E-PCT application started earlier, failed. 
    */
    private String epctNotAvailableReason;

    
    // End of: Fields added for phase 2.1 : E-PCT : Form1200  //

    
    
    
    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date priorityDate;		

    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date PCT_publishedDate;

    
    
    
    
    
    
    
    /*
    // Formerly CascadeType.ALL, which rejects auto-delete child notifications
    @NotNull
    @ManyToMany(cascade = CascadeType.REFRESH)
    private List<Notification> notifications = new ArrayList<Notification>();
     */


    public int countDesignatedstates() {
    	if (designated_states==null || designated_states.trim().length()==0) return 0;
    	List<String> eachDesignatedState = Arrays.asList(designated_states.split(","));
    	return eachDesignatedState.size();
    }
    

    // Setters pushed to support P3S 'Enums'

    public void setRenewalStatus(String renewalStatus) {
    	this.renewalStatus = (new RenewalStatusEnum(renewalStatus)).toString();
    }

    
    @Transactional
    public Patent persist() {  
    	Patent patent = new Patent();  
    	EntityManager em = this.entityManager();
        em.persist(this);
        patent = Patent.findPatent(this.getId());
        return patent;
    }
    
}
