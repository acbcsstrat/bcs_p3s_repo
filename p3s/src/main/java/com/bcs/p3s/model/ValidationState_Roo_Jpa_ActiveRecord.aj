// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.ValidationState;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect ValidationState_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager ValidationState.entityManager;
    
    public static final List<String> ValidationState.fieldNames4OrderClauseFilter = java.util.Arrays.asList("stateName", "stateCode", "isActive");
    
    public static final EntityManager ValidationState.entityManager() {
        EntityManager em = new ValidationState().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long ValidationState.countValidationStates() {
        return entityManager().createQuery("SELECT COUNT(o) FROM ValidationState o", Long.class).getSingleResult();
    }
    
    public static List<ValidationState> ValidationState.findAllValidationStates() {
        return entityManager().createQuery("SELECT o FROM ValidationState o", ValidationState.class).getResultList();
    }
    
    public static List<ValidationState> ValidationState.findAllValidationStates(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM ValidationState o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, ValidationState.class).getResultList();
    }
    
    public static ValidationState ValidationState.findValidationState(Long id) {
        if (id == null) return null;
        return entityManager().find(ValidationState.class, id);
    }
    
    public static List<ValidationState> ValidationState.findValidationStateEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM ValidationState o", ValidationState.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<ValidationState> ValidationState.findValidationStateEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM ValidationState o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, ValidationState.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void ValidationState.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void ValidationState.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            ValidationState attached = ValidationState.findValidationState(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void ValidationState.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void ValidationState.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public ValidationState ValidationState.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        ValidationState merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}