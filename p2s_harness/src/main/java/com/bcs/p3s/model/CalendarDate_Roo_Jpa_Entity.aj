// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.CalendarDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect CalendarDate_Roo_Jpa_Entity {
    
    declare @type: CalendarDate: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long CalendarDate.id;
    
    @Version
    @Column(name = "version")
    private Integer CalendarDate.version;
    
    public Long CalendarDate.getId() {
        return this.id;
    }
    
    public void CalendarDate.setId(Long id) {
        this.id = id;
    }
    
    public Integer CalendarDate.getVersion() {
        return this.version;
    }
    
    public void CalendarDate.setVersion(Integer version) {
        this.version = version;
    }
    
}
