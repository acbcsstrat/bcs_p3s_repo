// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Payment;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

privileged aspect Payment_Roo_Jpa_ActiveRecord {
    
    @PersistenceContext
    transient EntityManager Payment.entityManager;
    
    public static final List<String> Payment.fieldNames4OrderClauseFilter = java.util.Arrays.asList("P3S_TransRef", "MC_TransRef", "transType", "initiatedByUserId", "transStartDate", "transTargetEndDate", "fxTarget", "lastUpdatedDate", "latestTransStatus", "sentToMc", "hasFailed", "failureReason", "latestInvoice", "transAmount_USD", "isBillingAddressSame", "billingAddressStreet", "billingAddressCity", "billingAddressState", "billingAddressZip", "renewals");
    
    public static final EntityManager Payment.entityManager() {
        EntityManager em = new Payment().entityManager;
        if (em == null) throw new IllegalStateException("Entity manager has not been injected (is the Spring Aspects JAR configured as an AJC/AJDT aspects library?)");
        return em;
    }
    
    public static long Payment.countPayments() {
        return entityManager().createQuery("SELECT COUNT(o) FROM Payment o", Long.class).getSingleResult();
    }
    
    public static List<Payment> Payment.findAllPayments() {
        return entityManager().createQuery("SELECT o FROM Payment o", Payment.class).getResultList();
    }
    
    public static List<Payment> Payment.findAllPayments(String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Payment o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Payment.class).getResultList();
    }
    
    public static Payment Payment.findPayment(Long id) {
        if (id == null) return null;
        return entityManager().find(Payment.class, id);
    }
    
    public static List<Payment> Payment.findPaymentEntries(int firstResult, int maxResults) {
        return entityManager().createQuery("SELECT o FROM Payment o", Payment.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    public static List<Payment> Payment.findPaymentEntries(int firstResult, int maxResults, String sortFieldName, String sortOrder) {
        String jpaQuery = "SELECT o FROM Payment o";
        if (fieldNames4OrderClauseFilter.contains(sortFieldName)) {
            jpaQuery = jpaQuery + " ORDER BY " + sortFieldName;
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                jpaQuery = jpaQuery + " " + sortOrder;
            }
        }
        return entityManager().createQuery(jpaQuery, Payment.class).setFirstResult(firstResult).setMaxResults(maxResults).getResultList();
    }
    
    @Transactional
    public void Payment.remove() {
        if (this.entityManager == null) this.entityManager = entityManager();
        if (this.entityManager.contains(this)) {
            this.entityManager.remove(this);
        } else {
            Payment attached = Payment.findPayment(this.id);
            this.entityManager.remove(attached);
        }
    }
    
    @Transactional
    public void Payment.flush() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.flush();
    }
    
    @Transactional
    public void Payment.clear() {
        if (this.entityManager == null) this.entityManager = entityManager();
        this.entityManager.clear();
    }
    
    @Transactional
    public Payment Payment.merge() {
        if (this.entityManager == null) this.entityManager = entityManager();
        Payment merged = this.entityManager.merge(this);
        this.entityManager.flush();
        return merged;
    }
    
}
