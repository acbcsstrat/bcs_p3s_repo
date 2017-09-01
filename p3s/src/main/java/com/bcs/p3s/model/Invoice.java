package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.enump3s.InvoiceStatusEnum;
import com.bcs.p3s.enump3s.InvoiceTypeEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;

import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.EntityManager;
import javax.persistence.ManyToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Invoice {

    /**
     */
    @ManyToOne
    private Payment payment;

    /**
     */
    @NotNull
    private String invoiceNumber;

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date issueDate;

    /**
     * Enum: InvoiceStatusEnum
     */
    @NotNull
    private String invoiceStatus;

    /**
     * Always null unless previous failed payment
     */
    @ManyToOne
    private Invoice preceedingInvoiceId;

    /**
     * Enum: InvoiceTypeEnum
     */
    @NotNull
    private String invoiceType;

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
    private String invoiceTemplateId;

    



    
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

    
    // Setters pushed to support P3S 'Enums'

    public void setInvoiceStatus(String invoiceStatus) {
    	this.invoiceStatus = (new InvoiceStatusEnum(invoiceStatus)).toString();
    }
    public void setInvoiceType(String invoiceType) {
    	this.invoiceType = (new InvoiceTypeEnum(invoiceType)).toString();
    }
    
    
    public Invoice persist() {  
    	Invoice invoice = new Invoice();
    	EntityManager em = EpoFee.entityManager();
        //if (em == null) this.entityManager = entityManager();
        em.persist(this);
        invoice = Invoice.findInvoice(this.getId());
        return invoice;
    }
}
