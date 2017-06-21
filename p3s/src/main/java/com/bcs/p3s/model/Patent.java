// Andy initial Git test - remove this soon
package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.util.lang.Universal;

import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.ManyToMany;



@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findPatentsByBusiness" })
public class Patent extends Universal {

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
    @Size(min = 8, max = 16)
    private String clientRef;

    /**
     */
    @NotNull
    @Size(max = 20)
    private String shortTitle;

    /**
     */
    @NotNull
    private String epoPatentStatus;

    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date lastRenewedDateExEpo;

    /**
     */
    @NotNull
    private Integer renewalYear;

    /**
     */
    @NotNull
    private String renewalStatus;

    /**
     */
    @NotNull
    private String patentPublicationNumber;

    /**
     */
    @NotNull
    @ManyToMany(cascade = CascadeType.ALL)
    private List<Notification> notifications = new ArrayList<Notification>();


    
    
    

    // Setters pushed to support P3S 'Enums'

    public void setRenewalStatus(String renewalStatus) {
    	this.renewalStatus = (new RenewalStatusEnum(renewalStatus)).toString();
    }

}
