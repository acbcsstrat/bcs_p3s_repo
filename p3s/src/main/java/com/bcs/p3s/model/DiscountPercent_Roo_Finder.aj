// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.DiscountPercent;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect DiscountPercent_Roo_Finder {
    
    public static Long DiscountPercent.countFindDiscountPercentsByBusiness(Business business) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = DiscountPercent.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM DiscountPercent AS o WHERE o.business = :business", Long.class);
        q.setParameter("business", business);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<DiscountPercent> DiscountPercent.findDiscountPercentsByBusiness(Business business) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = DiscountPercent.entityManager();
        TypedQuery<DiscountPercent> q = em.createQuery("SELECT o FROM DiscountPercent AS o WHERE o.business = :business", DiscountPercent.class);
        q.setParameter("business", business);
        return q;
    }
    
    public static TypedQuery<DiscountPercent> DiscountPercent.findDiscountPercentsByBusiness(Business business, String sortFieldName, String sortOrder) {
        if (business == null) throw new IllegalArgumentException("The business argument is required");
        EntityManager em = DiscountPercent.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM DiscountPercent AS o WHERE o.business = :business");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<DiscountPercent> q = em.createQuery(queryBuilder.toString(), DiscountPercent.class);
        q.setParameter("business", business);
        return q;
    }
    
}