// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.Payment;
import java.util.Date;

privileged aspect Invoice_Roo_JavaBean {
    
    public String Invoice.getInvoiceNumber() {
        return this.invoiceNumber;
    }
    
    public void Invoice.setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public Date Invoice.getIssueDate() {
        return this.issueDate;
    }
    
    public void Invoice.setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }
    
    public String Invoice.getInvoiceStatus() {
        return this.invoiceStatus;
    }
    
    public void Invoice.setInvoiceStatus(String invoiceStatus) {
        this.invoiceStatus = invoiceStatus;
    }
    
    public Invoice Invoice.getPreceedingInvoiceId() {
        return this.preceedingInvoiceId;
    }
    
    public void Invoice.setPreceedingInvoiceId(Invoice preceedingInvoiceId) {
        this.preceedingInvoiceId = preceedingInvoiceId;
    }
    
    public String Invoice.getInvoiceType() {
        return this.invoiceType;
    }
    
    public void Invoice.setInvoiceType(String invoiceType) {
        this.invoiceType = invoiceType;
    }
    
    public String Invoice.getDocPath() {
        return this.docPath;
    }
    
    public void Invoice.setDocPath(String docPath) {
        this.docPath = docPath;
    }
    
    public String Invoice.getFilename() {
        return this.filename;
    }
    
    public void Invoice.setFilename(String filename) {
        this.filename = filename;
    }
    
    public String Invoice.getInvoiceTemplateId() {
        return this.invoiceTemplateId;
    }
    
    public void Invoice.setInvoiceTemplateId(String invoiceTemplateId) {
        this.invoiceTemplateId = invoiceTemplateId;
    }
    
    public Payment Invoice.getPayment() {
        return this.payment;
    }
    
    public void Invoice.setPayment(Payment payment) {
        this.payment = payment;
    }
    
}
