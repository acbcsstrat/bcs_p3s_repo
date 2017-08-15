// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Patent;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect Patent_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager Patent.entityManager;
    
    public static final List<String> Patent.fieldNames4OrderClauseFilter = java.util.Arrays.asList("patentApplicationNumber", "title", "filingDate", "business", "primaryApplicantName", "clientRef", "shortTitle", "epoPatentStatus", "lastRenewedDateExEpo", "lastRenewedYearEpo", "renewalYear", "renewalStatus", "patentPublicationNumber", "notifications");
    
    public static final EntityManager Patent.entityManager() {
        EntityManager em = new Patent().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long Patent.countPatents() {
        return entityManager().createQuery("SELECT COUNT(o) FROM Patent o", Long.class).getSingleResult();
    }
    
    public static List<Patent> Patent.findAllPatents() {
        return entityManager().createQuery("SELECT o FROM Patent o", Patent.class).getResultList();
    }
    
    public static List<Patent> Patent.findAllPatents(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Patent o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Patent.class).getResultList();
    }
    
    public static Patent Patent.findPatent(Long id) {
        if (id == null) return null;
        return entityManager().find(Patent.class, id);
    }
    
    public static List<Patent> Patent.findPatentEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM Patent o", Patent.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<Patent> Patent.findPatentEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Patent o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Patent.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void Patent.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void Patent.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            Patent attached = Patent.findPatent(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void Patent.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void Patent.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public Patent Patent.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        Patent merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
