// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.NotificationMapping;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect NotificationMapping_Roo_Finder {
    
    public static Long NotificationMapping.countFindNotificationMappingsByPatent_id(Long patent_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM NotificationMapping AS o WHERE o.patent_id = :patent_id", Long.class);
        q.setParameter("patent_id", patent_id);
        return ((Long) q.getSingleResult());
    }
    
    public static Long NotificationMapping.countFindNotificationMappingsByPatent_idAndUser_id(Long patent_id, Long user_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", Long.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        return ((Long) q.getSingleResult());
    }
    
    public static Long NotificationMapping.countFindNotificationMappingsByPatent_idAndUser_idAndNotification_id(Long patent_id, Long user_id, Long notification_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        if (notification_id == null) throw new IllegalArgumentException("The notification_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id AND o.notification_id = :notification_id", Long.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        q.setParameter("notification_id", notification_id);
        return ((Long) q.getSingleResult());
    }
    
    public static Long NotificationMapping.countFindNotificationMappingsByUser_id(Long user_id) {
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM NotificationMapping AS o WHERE o.user_id = :user_id", Long.class);
        q.setParameter("user_id", user_id);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_id(Long patent_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery<NotificationMapping> q = em.createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_id(Long patent_id, String sortFieldName, String sortOrder) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<NotificationMapping> q = em.createQuery(queryBuilder.toString(), NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_idAndUser_id(Long patent_id, Long user_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery<NotificationMapping> q = em.createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_idAndUser_id(Long patent_id, Long user_id, String sortFieldName, String sortOrder) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<NotificationMapping> q = em.createQuery(queryBuilder.toString(), NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_idAndUser_idAndNotification_id(Long patent_id, Long user_id, Long notification_id) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        if (notification_id == null) throw new IllegalArgumentException("The notification_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery<NotificationMapping> q = em.createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id AND o.notification_id = :notification_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        q.setParameter("notification_id", notification_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByPatent_idAndUser_idAndNotification_id(Long patent_id, Long user_id, Long notification_id, String sortFieldName, String sortOrder) {
        if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        if (notification_id == null) throw new IllegalArgumentException("The notification_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id AND o.notification_id = :notification_id");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<NotificationMapping> q = em.createQuery(queryBuilder.toString(), NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        q.setParameter("notification_id", notification_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByUser_id(Long user_id) {
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        TypedQuery<NotificationMapping> q = em.createQuery("SELECT o FROM NotificationMapping AS o WHERE o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("user_id", user_id);
        return q;
    }
    
    public static TypedQuery<NotificationMapping> NotificationMapping.findNotificationMappingsByUser_id(Long user_id, String sortFieldName, String sortOrder) {
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        EntityManager em = NotificationMapping.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM NotificationMapping AS o WHERE o.user_id = :user_id");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<NotificationMapping> q = em.createQuery(queryBuilder.toString(), NotificationMapping.class);
        q.setParameter("user_id", user_id);
        return q;
    }
    
}
