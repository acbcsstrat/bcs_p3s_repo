// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.P3SUser;
import java.util.List;

privileged aspect P3SUser_Roo_JavaBean {
    
    public String P3SUser.getFirstName() {
        return this.firstName;
    }
    
    public void P3SUser.setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String P3SUser.getLastName() {
        return this.lastName;
    }
    
    public void P3SUser.setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String P3SUser.getEmailAddress() {
        return this.emailAddress;
    }
    
    public void P3SUser.setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }
    
    public String P3SUser.getStatus() {
        return this.status;
    }
    
    public void P3SUser.setStatus(String status) {
        this.status = status;
    }
    
    public Boolean P3SUser.getIsEmailNotification() {
        return this.isEmailNotification;
    }
    
    public void P3SUser.setIsEmailNotification(Boolean isEmailNotification) {
        this.isEmailNotification = isEmailNotification;
    }
    
    public Business P3SUser.getBusiness() {
        return this.business;
    }
    
    public void P3SUser.setBusiness(Business business) {
        this.business = business;
    }
    
    public String P3SUser.getUserrole() {
        return this.userrole;
    }
    
    public void P3SUser.setUserrole(String userrole) {
        this.userrole = userrole;
    }
    
    public String P3SUser.getPassword() {
        return this.password;
    }
    
    public void P3SUser.setPassword(String password) {
        this.password = password;
    }
    
    public List<LoginMessage> P3SUser.getLoginMessagesToInhibit() {
        return this.loginMessagesToInhibit;
    }
    
    public void P3SUser.setLoginMessagesToInhibit(List<LoginMessage> loginMessagesToInhibit) {
        this.loginMessagesToInhibit = loginMessagesToInhibit;
    }
    
}
