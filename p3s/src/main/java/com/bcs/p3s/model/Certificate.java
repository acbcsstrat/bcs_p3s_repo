package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.OneToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Certificate {

    /**
     */
    @NotNull
    @OneToOne
    private Renewal renewal;

    /**
     */
    @NotNull
    private String certificateName;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date issueDate;

    /**
     * TBD_acTidy abs or rel. Use forwardslashes. Ideally end with forwardslash but not mandated
     */
    @NotNull
    private String docPath;

    /**
     * Include the file extension
     */
    @NotNull
    private String filename;

    /**
     */
    @NotNull
    private String certificateTemplateId;



    
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
