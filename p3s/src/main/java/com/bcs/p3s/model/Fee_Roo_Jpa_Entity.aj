// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Fee;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect Fee_Roo_Jpa_Entity {
    
    declare @type: Fee: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long Fee.id;
    
    @Version
    @Column(name = "version")
    private Integer Fee.version;
    
    public Fee.new() {
        super();
    }

    public Long Fee.getId() {
        return this.id;
    }
    
    public void Fee.setId(Long id) {
        this.id = id;
    }
    
    public Integer Fee.getVersion() {
        return this.version;
    }
    
    public void Fee.setVersion(Integer version) {
        this.version = version;
    }
    
}
