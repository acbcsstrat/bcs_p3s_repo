package com.bcs.p3s.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.EntityManager;
import javax.persistence.ManyToMany;



@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findPatentsByBusiness" })
@OnDelete(action = OnDeleteAction.CASCADE)
public class Patent {

    /**
     */
    @NotNull
    private String patentApplicationNumber;

    /**
     */
    @NotNull
    private String title;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date filingDate;

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
     * updated on overnight scrape
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
     * Enum: RenewalStatusEnum :WARNING: This duplicates Renewal:renewalStatus
     * calculated via overnight processing engine
     */
    @NotNull
    private String renewalStatus;

    /**
     */
    @NotNull
    private String patentPublicationNumber;
    
    private String ipcCodes;
    
    private String representative;

    /**
     *//*
    // Formerly CascadeType.ALL, which rejects auto-delete child notifications
    @NotNull
    @ManyToMany(cascade = CascadeType.REFRESH)
    private List<Notification> notifications = new ArrayList<Notification>();
*/


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
