// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.model.RenewalFee;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect RenewalFee_Roo_Finder {
    
    public static Long RenewalFee.countFindRenewalFeesByRenewal(Renewal renewal) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = RenewalFee.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM RenewalFee AS o WHERE o.renewal = :renewal", Long.class);
        q.setParameter("renewal", renewal);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<RenewalFee> RenewalFee.findRenewalFeesByRenewal(Renewal renewal) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = RenewalFee.entityManager();
        TypedQuery<RenewalFee> q = em.createQuery("SELECT o FROM RenewalFee AS o WHERE o.renewal = :renewal", RenewalFee.class);
        q.setParameter("renewal", renewal);
        return q;
    }
    
    public static TypedQuery<RenewalFee> RenewalFee.findRenewalFeesByRenewal(Renewal renewal, String sortFieldName, String sortOrder) {
        if (renewal == null) throw new IllegalArgumentException("The renewal argument is required");
        EntityManager em = RenewalFee.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM RenewalFee AS o WHERE o.renewal = :renewal");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<RenewalFee> q = em.createQuery(queryBuilder.toString(), RenewalFee.class);
        q.setParameter("renewal", renewal);
        return q;
    }
    
}
