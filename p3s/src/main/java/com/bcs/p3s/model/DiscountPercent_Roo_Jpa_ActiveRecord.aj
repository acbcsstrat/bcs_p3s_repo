// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.DiscountPercent;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect DiscountPercent_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager DiscountPercent.entityManager;
    
    public static final List<String> DiscountPercent.fieldNames4OrderClauseFilter = java.util.Arrays.asList("business", "processingFee", "expressFee", "urgentFee", "latePayPenalty");
    
    public static final EntityManager DiscountPercent.entityManager() {
        EntityManager em = new DiscountPercent().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long DiscountPercent.countDiscountPercents() {
        return entityManager().createQuery("SELECT COUNT(o) FROM DiscountPercent o", Long.class).getSingleResult();
    }
    
    public static List<DiscountPercent> DiscountPercent.findAllDiscountPercents() {
        return entityManager().createQuery("SELECT o FROM DiscountPercent o", DiscountPercent.class).getResultList();
    }
    
    public static List<DiscountPercent> DiscountPercent.findAllDiscountPercents(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM DiscountPercent o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, DiscountPercent.class).getResultList();
    }
    
    public static DiscountPercent DiscountPercent.findDiscountPercent(Long id) {
        if (id == null) return null;
        return entityManager().find(DiscountPercent.class, id);
    }
    
    public static List<DiscountPercent> DiscountPercent.findDiscountPercentEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM DiscountPercent o", DiscountPercent.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<DiscountPercent> DiscountPercent.findDiscountPercentEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM DiscountPercent o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, DiscountPercent.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void DiscountPercent.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void DiscountPercent.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            DiscountPercent attached = DiscountPercent.findDiscountPercent(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void DiscountPercent.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void DiscountPercent.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public DiscountPercent DiscountPercent.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        DiscountPercent merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
