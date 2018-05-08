// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Patent;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect Patent_Roo_Finder {
    
    public static Long Patent.countFindPatentsByBusiness(Business business) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = Patent.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM Patent AS o WHERE o.business = :business", Long.class);
        q.setParameter("business", business);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<Patent> Patent.findPatentsByBusiness(Business business) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = Patent.entityManager();
        TypedQuery<Patent> q = em.createQuery("SELECT o FROM Patent AS o WHERE o.business = :business", Patent.class);
        q.setParameter("business", business);
        return q;
    }
    
    public static TypedQuery<Patent> Patent.findPatentsByBusiness(Business business, String sortFieldName, String sortOrder) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = Patent.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM Patent AS o WHERE o.business = :business");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<Patent> q = em.createQuery(queryBuilder.toString(), Patent.class);
        q.setParameter("business", business);
        return q;
    }
    
}