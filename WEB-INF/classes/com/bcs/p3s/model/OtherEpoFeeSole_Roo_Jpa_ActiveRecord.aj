// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.OtherEpoFeeSole;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect OtherEpoFeeSole_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager OtherEpoFeeSole.entityManager;
    
    public static final List<String> OtherEpoFeeSole.fieldNames4OrderClauseFilter = java.util.Arrays.asList("filingFee_EUR", "supplementarySearchFee_EUR", "designationStatesFee_EUR", "extensionFee_BA_EUR", "extensionFee_ME_EUR", "validationFee_MA_EUR", "validationFee_MD_EUR", "validationFee_TN_EUR", "validationFee_KH_EUR", "examinationFee_EUR", "claimsFee1_EUR", "claimsFee2_EUR", "excessPagesFee_EUR");
    
    public static final EntityManager OtherEpoFeeSole.entityManager() {
        EntityManager em = new OtherEpoFeeSole().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long OtherEpoFeeSole.countOtherEpoFeeSoles() {
        return entityManager().createQuery("SELECT COUNT(o) FROM OtherEpoFeeSole o", Long.class).getSingleResult();
    }
    
    public static List<OtherEpoFeeSole> OtherEpoFeeSole.findAllOtherEpoFeeSoles() {
        return entityManager().createQuery("SELECT o FROM OtherEpoFeeSole o", OtherEpoFeeSole.class).getResultList();
    }
    
    public static List<OtherEpoFeeSole> OtherEpoFeeSole.findAllOtherEpoFeeSoles(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM OtherEpoFeeSole o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, OtherEpoFeeSole.class).getResultList();
    }
    
    public static OtherEpoFeeSole OtherEpoFeeSole.findOtherEpoFeeSole(Long id) {
        if (id == null) return null;
        return entityManager().find(OtherEpoFeeSole.class, id);
    }
    
    public static List<OtherEpoFeeSole> OtherEpoFeeSole.findOtherEpoFeeSoleEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM OtherEpoFeeSole o", OtherEpoFeeSole.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<OtherEpoFeeSole> OtherEpoFeeSole.findOtherEpoFeeSoleEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM OtherEpoFeeSole o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, OtherEpoFeeSole.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void OtherEpoFeeSole.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void OtherEpoFeeSole.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            OtherEpoFeeSole attached = OtherEpoFeeSole.findOtherEpoFeeSole(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void OtherEpoFeeSole.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void OtherEpoFeeSole.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public OtherEpoFeeSole OtherEpoFeeSole.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        OtherEpoFeeSole merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
