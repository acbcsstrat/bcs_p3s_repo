// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.NonWorkingDay;
import java.util.Date;

privileged aspect NonWorkingDay_Roo_JavaBean {
    
    public Date NonWorkingDay.getDate() {
        return this.date;
    }
    
    public void NonWorkingDay.setDate(Date date) {
        this.date = date;
    }
    
    public String NonWorkingDay.getLocality() {
        return this.locality;
    }
    
    public void NonWorkingDay.setLocality(String locality) {
        this.locality = locality;
    }
    
}