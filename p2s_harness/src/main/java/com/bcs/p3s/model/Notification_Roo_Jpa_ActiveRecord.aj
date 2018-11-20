// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Notification;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect Notification_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager Notification.entityManager;
    
    public static final List<String> Notification.fieldNames4OrderClauseFilter = java.util.Arrays.asList("title", "defaultOn", "displayOrder", "emailTemplateId", "costbandcolor", "notificationName", "productType");
    
    public static final EntityManager Notification.entityManager() {
        EntityManager em = new Notification().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long Notification.countNotifications() {
        return entityManager().createQuery("SELECT COUNT(o) FROM Notification o", Long.class).getSingleResult();
    }
    
    public static List<Notification> Notification.findAllNotifications(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Notification o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Notification.class).getResultList();
    }
    
    public static Notification Notification.findNotification(Long id) {
        if (id == null) return null;
        return entityManager().find(Notification.class, id);
    }
    
    public static List<Notification> Notification.findNotificationEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM Notification o", Notification.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<Notification> Notification.findNotificationEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Notification o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Notification.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void Notification.persist() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.persist(this);
    }
    
    @Transactional
    public void Notification.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            Notification attached = Notification.findNotification(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void Notification.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void Notification.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public Notification Notification.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        Notification merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}