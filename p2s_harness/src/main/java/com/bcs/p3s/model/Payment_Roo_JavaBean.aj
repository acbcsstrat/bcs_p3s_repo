// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

privileged aspect Payment_Roo_JavaBean {
    
    public String Payment.getP3S_TransRef() {
        return this.P3S_TransRef;
    }
    
    public void Payment.setP3S_TransRef(String P3S_TransRef) {
        this.P3S_TransRef = P3S_TransRef;
    }
    
    public String Payment.getMC_TransRef() {
        return this.MC_TransRef;
    }
    
    public void Payment.setMC_TransRef(String MC_TransRef) {
        this.MC_TransRef = MC_TransRef;
    }
    
    public String Payment.getTransType() {
        return this.transType;
    }
    
    public P3SUser Payment.getInitiatedByUserId() {
        return this.initiatedByUserId;
    }
    
    public void Payment.setInitiatedByUserId(P3SUser initiatedByUserId) {
        this.initiatedByUserId = initiatedByUserId;
    }
    
    public Date Payment.getTransStartDate() {
        return this.transStartDate;
    }
    
    public void Payment.setTransStartDate(Date transStartDate) {
        this.transStartDate = transStartDate;
    }
    
    public Date Payment.getTransTargetEndDate() {
        return this.transTargetEndDate;
    }
    
    public void Payment.setTransTargetEndDate(Date transTargetEndDate) {
        this.transTargetEndDate = transTargetEndDate;
    }
    
    public Date Payment.getFxTarget() {
        return this.fxTarget;
    }
    
    public void Payment.setFxTarget(Date fxTarget) {
        this.fxTarget = fxTarget;
    }
    
    public Date Payment.getLastUpdatedDate() {
        return this.lastUpdatedDate;
    }
    
    public void Payment.setLastUpdatedDate(Date lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }
    
    public String Payment.getLatestTransStatus() {
        return this.latestTransStatus;
    }
    
    public Date Payment.getSentToMc() {
        return this.sentToMc;
    }
    
    public void Payment.setSentToMc(Date sentToMc) {
        this.sentToMc = sentToMc;
    }
    
    public Boolean Payment.getHasFailed() {
        return this.hasFailed;
    }
    
    public void Payment.setHasFailed(Boolean hasFailed) {
        this.hasFailed = hasFailed;
    }
    
    public String Payment.getFailureReason() {
        return this.failureReason;
    }
    
    public void Payment.setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public Invoice Payment.getLatestInvoice() {
        return this.latestInvoice;
    }
    
    public void Payment.setLatestInvoice(Invoice latestInvoice) {
        this.latestInvoice = latestInvoice;
    }
    
    public BigDecimal Payment.getTransAmount_USD() {
        return this.transAmount_USD;
    }
    
    public void Payment.setTransAmount_USD(BigDecimal transAmount_USD) {
        this.transAmount_USD = transAmount_USD;
    }
    
    public Boolean Payment.getIsBillingAddressSame() {
        return this.isBillingAddressSame;
    }
    
    public void Payment.setIsBillingAddressSame(Boolean isBillingAddressSame) {
        this.isBillingAddressSame = isBillingAddressSame;
    }
    
    public String Payment.getBillingAddressStreet() {
        return this.billingAddressStreet;
    }
    
    public void Payment.setBillingAddressStreet(String billingAddressStreet) {
        this.billingAddressStreet = billingAddressStreet;
    }
    
    public String Payment.getBillingAddressCity() {
        return this.billingAddressCity;
    }
    
    public void Payment.setBillingAddressCity(String billingAddressCity) {
        this.billingAddressCity = billingAddressCity;
    }
    
    public String Payment.getBillingAddressState() {
        return this.billingAddressState;
    }
    
    public void Payment.setBillingAddressState(String billingAddressState) {
        this.billingAddressState = billingAddressState;
    }
    
    public String Payment.getBillingAddressZip() {
        return this.billingAddressZip;
    }
    
    public void Payment.setBillingAddressZip(String billingAddressZip) {
        this.billingAddressZip = billingAddressZip;
    }
    
    public List<Renewal> Payment.getRenewals() {
        return this.renewals;
    }
    
    public void Payment.setRenewals(List<Renewal> renewals) {
        this.renewals = renewals;
    }
    
    public List<Epct> Payment.getEpcts() {
        return this.epcts;
    }
    
    public void Payment.setEpcts(List<Epct> epcts) {
        this.epcts = epcts;
    }
    
}