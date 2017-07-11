package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.validation.constraints.NotNull;
import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.ManyToOne;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Invoice {

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

    /**
     */
    @NotNull
    @ManyToOne
    private Payment payment;
}
