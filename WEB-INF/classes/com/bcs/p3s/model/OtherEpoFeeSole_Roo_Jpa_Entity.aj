// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.OtherEpoFeeSole;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect OtherEpoFeeSole_Roo_Jpa_Entity {
    
    declare @type: OtherEpoFeeSole: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long OtherEpoFeeSole.id;
    
    @Version
    @Column(name = "version")
    private Integer OtherEpoFeeSole.version;
    
    public Long OtherEpoFeeSole.getId() {
        return this.id;
    }
    
    public void OtherEpoFeeSole.setId(Long id) {
        this.id = id;
    }
    
    public Integer OtherEpoFeeSole.getVersion() {
        return this.version;
    }
    
    public void OtherEpoFeeSole.setVersion(Integer version) {
        this.version = version;
    }
    
}
