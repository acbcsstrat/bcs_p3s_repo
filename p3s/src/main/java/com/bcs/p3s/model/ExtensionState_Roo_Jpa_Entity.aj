// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.ExtensionState;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect ExtensionState_Roo_Jpa_Entity {
    
    declare @type: ExtensionState: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long ExtensionState.id;
    
    @Version
    @Column(name = "version")
    private Integer ExtensionState.version;
    
    public Long ExtensionState.getId() {
        return this.id;
    }
    
    public void ExtensionState.setId(Long id) {
        this.id = id;
    }
    
    public Integer ExtensionState.getVersion() {
        return this.version;
    }
    
    public void ExtensionState.setVersion(Integer version) {
        this.version = version;
    }
    
}