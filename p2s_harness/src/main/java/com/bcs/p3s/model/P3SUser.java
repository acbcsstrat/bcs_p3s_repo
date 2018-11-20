package com.bcs.p3s.model;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.validation.constraints.NotNull;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.ManyToMany;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findP3SUsersByEmailAddress", "findP3SUsersByBusiness" })
public class P3SUser {

    /**
     */
    @NotNull
    private String firstName;

    /**
     */
    @NotNull
    private String lastName;

    /**
     */
    @NotNull
    @Column(unique = true)
    private String emailAddress;

    /**
     */
    @NotNull
    private String status;

    /**
     */
    @NotNull
    private Boolean isEmailNotification;

    /**
     */
    @NotNull
    @ManyToOne
    private Business business;

    /**
     */
    @NotNull
    private String userrole;

    /**
     */
    @NotNull
    private String password;


    /** Optional User image */
    @Lob
    private Blob avatar_blob;

    /** Date this user record was created */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date createdDate;

    /**
     */
    @NotNull
    @ManyToMany(cascade = CascadeType.REMOVE , fetch = FetchType.EAGER)
    private List<LoginMessage> loginMessagesToInhibit = new ArrayList<LoginMessage>();
    
    
}
