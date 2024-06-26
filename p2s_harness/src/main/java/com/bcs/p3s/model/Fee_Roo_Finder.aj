// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.Renewal;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect Fee_Roo_Finder {
    
    public static Long Fee.countFindFeesByRenewal(Renewal renewal) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = Fee.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM Fee AS o WHERE o.renewal = :renewal", Long.class);
        q.setParameter("renewal", renewal);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<Fee> Fee.findFeesByRenewal(Renewal renewal) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = Fee.entityManager();
        TypedQuery<Fee> q = em.createQuery("SELECT o FROM Fee AS o WHERE o.renewal = :renewal", Fee.class);
        q.setParameter("renewal", renewal);
        return q;
    }
    
    public static TypedQuery<Fee> Fee.findFeesByRenewal(Renewal renewal, String sortFieldName, String sortOrder) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = Fee.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM Fee AS o WHERE o.renewal = :renewal");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<Fee> q = em.createQuery(queryBuilder.toString(), Fee.class);
        q.setParameter("renewal", renewal);
        return q;
    }
    
}
