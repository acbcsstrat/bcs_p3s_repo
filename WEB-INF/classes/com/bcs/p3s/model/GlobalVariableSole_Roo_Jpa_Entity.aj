// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.GlobalVariableSole;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect GlobalVariableSole_Roo_Jpa_Entity {
    
    declare @type: GlobalVariableSole: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long GlobalVariableSole.id;
    
    @Version
    @Column(name = "version")
    private Integer GlobalVariableSole.version;
    
    public Long GlobalVariableSole.getId() {
        return this.id;
    }
    
    public void GlobalVariableSole.setId(Long id) {
        this.id = id;
    }
    
    public Integer GlobalVariableSole.getVersion() {
        return this.version;
    }
    
    public void GlobalVariableSole.setVersion(Integer version) {
        this.version = version;
    }
    
}
