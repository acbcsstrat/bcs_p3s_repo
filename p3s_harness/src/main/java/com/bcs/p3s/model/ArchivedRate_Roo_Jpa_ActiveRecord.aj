// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.ArchivedRate;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect ArchivedRate_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager ArchivedRate.entityManager;
    
    public static final List<String> ArchivedRate.fieldNames4OrderClauseFilter = java.util.Arrays.asList("fxRate_MC", "fxRate_P3s", "archivedDate");
    
    public static final EntityManager ArchivedRate.entityManager() {
        EntityManager em = new ArchivedRate().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long ArchivedRate.countArchivedRates() {
        return entityManager().createQuery("SELECT COUNT(o) FROM ArchivedRate o", Long.class).getSingleResult();
    }
    
    public static List<ArchivedRate> ArchivedRate.findAllArchivedRates() {
        return entityManager().createQuery("SELECT o FROM ArchivedRate o", ArchivedRate.class).getResultList();
    }
    
    public static List<ArchivedRate> ArchivedRate.findAllArchivedRates(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM ArchivedRate o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, ArchivedRate.class).getResultList();
    }
    
    public static ArchivedRate ArchivedRate.findArchivedRate(Long id) {
        if (id == null) return null;
        return entityManager().find(ArchivedRate.class, id);
    }
    
    public static List<ArchivedRate> ArchivedRate.findArchivedRateEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM ArchivedRate o", ArchivedRate.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<ArchivedRate> ArchivedRate.findArchivedRateEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM ArchivedRate o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, ArchivedRate.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void ArchivedRate.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void ArchivedRate.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            ArchivedRate attached = ArchivedRate.findArchivedRate(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void ArchivedRate.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void ArchivedRate.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public ArchivedRate ArchivedRate.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        ArchivedRate merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
