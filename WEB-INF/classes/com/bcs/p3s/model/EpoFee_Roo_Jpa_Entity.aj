// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.EpoFee;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect EpoFee_Roo_Jpa_Entity {
    
    declare @type: EpoFee: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long EpoFee.id;
    
    @Version
    @Column(name = "version")
    private Integer EpoFee.version;
    
    public Long EpoFee.getId() {
        return this.id;
    }
    
    public void EpoFee.setId(Long id) {
        this.id = id;
    }
    
    public Integer EpoFee.getVersion() {
        return this.version;
    }
    
    public void EpoFee.setVersion(Integer version) {
        this.version = version;
    }
    
}
