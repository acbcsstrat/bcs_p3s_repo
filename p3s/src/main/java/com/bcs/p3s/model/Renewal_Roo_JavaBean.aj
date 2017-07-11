// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Certificate;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import java.util.Date;

privileged aspect Renewal_Roo_JavaBean {
    
    public Patent Renewal.getPatent() {
        return this.patent;
    }
    
    public void Renewal.setPatent(Patent patent) {
        this.patent = patent;
    }
    
    public Payment Renewal.getActivePaymentId() {
        return this.activePaymentId;
    }
    
    public void Renewal.setActivePaymentId(Payment activePaymentId) {
        this.activePaymentId = activePaymentId;
    }
    
    public Fee Renewal.getFee() {
        return this.fee;
    }
    
    public void Renewal.setFee(Fee fee) {
        this.fee = fee;
    }
    
    public Certificate Renewal.getCertificate() {
        return this.certificate;
    }
    
    public void Renewal.setCertificate(Certificate certificate) {
        this.certificate = certificate;
    }
    
    public Integer Renewal.getRenewalYear() {
        return this.renewalYear;
    }
    
    public void Renewal.setRenewalYear(Integer renewalYear) {
        this.renewalYear = renewalYear;
    }
    
    public Date Renewal.getRenewalDueDate() {
        return this.renewalDueDate;
    }
    
    public void Renewal.setRenewalDueDate(Date renewalDueDate) {
        this.renewalDueDate = renewalDueDate;
    }
    
    public String Renewal.getRenewalPeriod() {
        return this.renewalPeriod;
    }
    
    public void Renewal.setRenewalPeriod(String renewalPeriod) {
        this.renewalPeriod = renewalPeriod;
    }
    
    public String Renewal.getRenewalStatus() {
        return this.renewalStatus;
    }
    
    public void Renewal.setRenewalStatus(String renewalStatus) {
        this.renewalStatus = renewalStatus;
    }
    
    public Integer Renewal.getRenewalAttemptsMade() {
        return this.renewalAttemptsMade;
    }
    
    public void Renewal.setRenewalAttemptsMade(Integer renewalAttemptsMade) {
        this.renewalAttemptsMade = renewalAttemptsMade;
    }
    
}
