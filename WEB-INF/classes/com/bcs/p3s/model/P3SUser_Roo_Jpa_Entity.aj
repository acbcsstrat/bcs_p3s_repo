// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.P3SUser;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect P3SUser_Roo_Jpa_Entity {
    
    declare @type: P3SUser: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long P3SUser.id;
    
    @Version
    @Column(name = "version")
    private Integer P3SUser.version;
    
    public Long P3SUser.getId() {
        return this.id;
    }
    
    public void P3SUser.setId(Long id) {
        this.id = id;
    }
    
    public Integer P3SUser.getVersion() {
        return this.version;
    }
    
    public void P3SUser.setVersion(Integer version) {
        this.version = version;
    }
    
}
