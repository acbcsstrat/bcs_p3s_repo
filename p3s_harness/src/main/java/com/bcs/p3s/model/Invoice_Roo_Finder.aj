// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Invoice;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

privileged aspect Invoice_Roo_Finder {
    
    public static Long Invoice.countFindInvoicesByInvoiceNumber(String invoiceNumber) {
        if (invoiceNumber == null || invoiceNumber.length() == 0) throw new IllegalArgumentException("The invoiceNumber argument is required");
        EntityManager em = Invoice.entityManager();
        TypedQuery q = em.createQuery("SELECT COUNT(o) FROM Invoice AS o WHERE o.invoiceNumber = :invoiceNumber", Long.class);
        q.setParameter("invoiceNumber", invoiceNumber);
        return ((Long) q.getSingleResult());
    }
    
    public static TypedQuery<Invoice> Invoice.findInvoicesByInvoiceNumber(String invoiceNumber) {
        if (invoiceNumber == null || invoiceNumber.length() == 0) throw new IllegalArgumentException("The invoiceNumber argument is required");
        EntityManager em = Invoice.entityManager();
        TypedQuery<Invoice> q = em.createQuery("SELECT o FROM Invoice AS o WHERE o.invoiceNumber = :invoiceNumber", Invoice.class);
        q.setParameter("invoiceNumber", invoiceNumber);
        return q;
    }
    
    public static TypedQuery<Invoice> Invoice.findInvoicesByInvoiceNumber(String invoiceNumber, String sortFieldName, String sortOrder) {
        if (invoiceNumber == null || invoiceNumber.length() == 0) throw new IllegalArgumentException("The invoiceNumber argument is required");
        EntityManager em = Invoice.entityManager();
        StringBuilder queryBuilder = new StringBuilder("SELECT o FROM Invoice AS o WHERE o.invoiceNumber = :invoiceNumber");
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            queryBuilder.append(" ORDER BY ").append(sortFieldName);
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                queryBuilder.append(" ").append(sortOrder);
            }
        }
        TypedQuery<Invoice> q = em.createQuery(queryBuilder.toString(), Invoice.class);
        q.setParameter("invoiceNumber", invoiceNumber);
        return q;
    }
    
}