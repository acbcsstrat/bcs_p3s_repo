// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Patent;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect Patent_Roo_Jpa_Entity {
    
    declare @type: Patent: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long Patent.id;
    
    @Version
    @Column(name = "version")
    private Integer Patent.version;
    
    public Long Patent.getId() {
        return this.id;
    }
    
    public void Patent.setId(Long id) {
        this.id = id;
    }
    
    public Integer Patent.getVersion() {
        return this.version;
    }
    
    public void Patent.setVersion(Integer version) {
        this.version = version;
    }
    
}
