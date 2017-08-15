// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import java.util.Date;
import java.util.List;

privileged aspect Patent_Roo_JavaBean {
    
    public String Patent.getPatentApplicationNumber() {
        return this.patentApplicationNumber;
    }
    
    public void Patent.setPatentApplicationNumber(String patentApplicationNumber) {
        this.patentApplicationNumber = patentApplicationNumber;
    }
    
    public String Patent.getTitle() {
        return this.title;
    }
    
    public void Patent.setTitle(String title) {
        this.title = title;
    }
    
    public Date Patent.getFilingDate() {
        return this.filingDate;
    }
    
    public void Patent.setFilingDate(Date filingDate) {
        this.filingDate = filingDate;
    }
    
    public Business Patent.getBusiness() {
        return this.business;
    }
    
    public void Patent.setBusiness(Business business) {
        this.business = business;
    }
    
    public String Patent.getPrimaryApplicantName() {
        return this.primaryApplicantName;
    }
    
    public void Patent.setPrimaryApplicantName(String primaryApplicantName) {
        this.primaryApplicantName = primaryApplicantName;
    }
    
    public String Patent.getClientRef() {
        return this.clientRef;
    }
    
    public void Patent.setClientRef(String clientRef) {
        this.clientRef = clientRef;
    }
    
    public String Patent.getShortTitle() {
        return this.shortTitle;
    }
    
    public void Patent.setShortTitle(String shortTitle) {
        this.shortTitle = shortTitle;
    }
    
    public String Patent.getEpoPatentStatus() {
        return this.epoPatentStatus;
    }
    
    public void Patent.setEpoPatentStatus(String epoPatentStatus) {
        this.epoPatentStatus = epoPatentStatus;
    }
    
    public Date Patent.getLastRenewedDateExEpo() {
        return this.lastRenewedDateExEpo;
    }
    
    public void Patent.setLastRenewedDateExEpo(Date lastRenewedDateExEpo) {
        this.lastRenewedDateExEpo = lastRenewedDateExEpo;
    }
    
    public Integer Patent.getLastRenewedYearEpo() {
        return this.lastRenewedYearEpo;
    }
    
    public void Patent.setLastRenewedYearEpo(Integer lastRenewedYearEpo) {
        this.lastRenewedYearEpo = lastRenewedYearEpo;
    }
    
    public Integer Patent.getRenewalYear() {
        return this.renewalYear;
    }
    
    public void Patent.setRenewalYear(Integer renewalYear) {
        this.renewalYear = renewalYear;
    }
    
    public String Patent.getRenewalStatus() {
        return this.renewalStatus;
    }
    
    public String Patent.getPatentPublicationNumber() {
        return this.patentPublicationNumber;
    }
    
    public void Patent.setPatentPublicationNumber(String patentPublicationNumber) {
        this.patentPublicationNumber = patentPublicationNumber;
    }
    
    public List<Notification> Patent.getNotifications() {
        return this.notifications;
    }
    
    public void Patent.setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
    
}
