package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.CascadeType;
import javax.persistence.OneToOne;


/**
 * Holds certificate details
 * As of End 2017 (MVP functionality) the ONLY field having a role here is issueDate
 * @author andyc
 *
 */

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Certificate {

    /**
     */
	//MP05022018 Making the field Nullable to allow cascade delete of Certificate row when respective Renewal got deleted
    //@NotNull 
    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Renewal renewal;

    //AC19dec2017 - remove redundant field
    //@NotNull
    //private String certificateName;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date issueDate;

    /**
     * TBD_acTidy abs or rel. Use forwardslashes. Ideally end with forwardslash but not mandated
     */
    //@NotNull - AC18dec2017 - remove NotNulls as PDFs don't yet exist. (Indeed - may never?)
    private String docPath;

    /**
     * Include the file extension
     */
    //@NotNull - AC18dec2017 - remove NotNulls as PDFs don't yet exist. (Indeed - may never?)
    private String filename;

    /**
     */
    //@NotNull - AC18dec2017 - remove NotNulls as PDFs don't yet exist. (Indeed - may never?)
    private String certificateTemplateId;


    /**
     * New field added for holding renewed_on date
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date renewedOnDateExEpo;

    
    // Special methods
    public String getUrl() {
    	String path = docPath;
    	String SEPARATOR = "/";
    	if (docPath==null || docPath.trim().length()==0) {
    		path = "";
		} else {
			if ( ! docPath.endsWith(SEPARATOR))
				path += SEPARATOR;
		}
		return path+filename;
    }

}
