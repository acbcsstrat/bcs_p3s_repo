// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.NonWorkingDay;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect NonWorkingDay_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager NonWorkingDay.entityManager;
    
    public static final List<String> NonWorkingDay.fieldNames4OrderClauseFilter = java.util.Arrays.asList("date", "locality");
    
    public static final EntityManager NonWorkingDay.entityManager() {
        EntityManager em = new NonWorkingDay().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long NonWorkingDay.countNonWorkingDays() {
        return entityManager().createQuery("SELECT COUNT(o) FROM NonWorkingDay o", Long.class).getSingleResult();
    }
    
    public static List<NonWorkingDay> NonWorkingDay.findAllNonWorkingDays() {
        return entityManager().createQuery("SELECT o FROM NonWorkingDay o", NonWorkingDay.class).getResultList();
    }
    
    public static List<NonWorkingDay> NonWorkingDay.findAllNonWorkingDays(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM NonWorkingDay o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, NonWorkingDay.class).getResultList();
    }
    
    public static NonWorkingDay NonWorkingDay.findNonWorkingDay(Long id) {
        if (id == null) return null;
        return entityManager().find(NonWorkingDay.class, id);
    }
    
    public static List<NonWorkingDay> NonWorkingDay.findNonWorkingDayEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM NonWorkingDay o", NonWorkingDay.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<NonWorkingDay> NonWorkingDay.findNonWorkingDayEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM NonWorkingDay o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, NonWorkingDay.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void NonWorkingDay.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void NonWorkingDay.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            NonWorkingDay attached = NonWorkingDay.findNonWorkingDay(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void NonWorkingDay.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void NonWorkingDay.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public NonWorkingDay NonWorkingDay.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        NonWorkingDay merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
