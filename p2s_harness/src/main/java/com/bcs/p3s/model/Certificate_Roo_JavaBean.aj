// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Certificate;
import com.bcs.p3s.model.Renewal;
import java.util.Date;

privileged aspect Certificate_Roo_JavaBean {
    
    public Renewal Certificate.getRenewal() {
        return this.renewal;
    }
    
    public void Certificate.setRenewal(Renewal renewal) {
        this.renewal = renewal;
    }
    
    public Date Certificate.getIssueDate() {
        return this.issueDate;
    }
    
    public void Certificate.setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }
    
    public String Certificate.getDocPath() {
        return this.docPath;
    }
    
    public void Certificate.setDocPath(String docPath) {
        this.docPath = docPath;
    }
    
    public String Certificate.getFilename() {
        return this.filename;
    }
    
    public void Certificate.setFilename(String filename) {
        this.filename = filename;
    }
    
    public String Certificate.getCertificateTemplateId() {
        return this.certificateTemplateId;
    }
    
    public void Certificate.setCertificateTemplateId(String certificateTemplateId) {
        this.certificateTemplateId = certificateTemplateId;
    }
    
    public Date Certificate.getRenewedOnDateExEpo() {
        return this.renewedOnDateExEpo;
    }
    
    public void Certificate.setRenewedOnDateExEpo(Date renewedOnDateExEpo) {
        this.renewedOnDateExEpo = renewedOnDateExEpo;
    }
    
}