package com.bcs.p3s.model;

import java.sql.Blob;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class RenewalBlob {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;


    /**
     * EpoReceiptBlob
     */
    @Lob
    @NotNull
    protected Blob  epoReceiptBlob;

    
    /** 
     * The timestamp of the EpoReceiptBlob being created  
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date epoReceiptCreatedDate; 

	
}
