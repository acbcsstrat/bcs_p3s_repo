// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.CalendarColour;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect CalendarColour_Roo_Jpa_Entity {
    
    declare @type: CalendarColour: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long CalendarColour.id;
    
    @Version
    @Column(name = "version")
    private Integer CalendarColour.version;
    
    public Long CalendarColour.getId() {
        return this.id;
    }
    
    public void CalendarColour.setId(Long id) {
        this.id = id;
    }
    
    public Integer CalendarColour.getVersion() {
        return this.version;
    }
    
    public void CalendarColour.setVersion(Integer version) {
        this.version = version;
    }
    
}