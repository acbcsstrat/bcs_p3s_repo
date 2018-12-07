package com.bcs.p3s.model;

import java.sql.Blob;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Form1200 {

	
    /**
     */
    @Lob
    @NotNull
    protected Blob  pdfBlob;


    /**
     */
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    protected Date createdDate;

    
    
    // Create this variant which returns the newly persisted item (with id)
    @Transactional
    public Form1200 persist() {  
    	EntityManager em = this.entityManager();
        em.persist(this);
        Form1200 form1200 = Form1200.findForm1200(this.getId());
        return form1200;
    }
	//    @Transactional
	//    public void persist() {
	//        if (this.entityManager == null) this.entityManager = entityManager();
	//        this.entityManager.persist(this);
	//    }


}
