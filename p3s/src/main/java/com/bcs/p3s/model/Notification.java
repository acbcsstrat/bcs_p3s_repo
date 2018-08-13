package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findNotificationsByNotificationName"})
public class Notification {

    /**
     */
    @NotNull
    private String title;

    /**
     */
    @NotNull
    private Boolean defaultOn;

    /**
     */
    @NotNull
    private Integer displayOrder;

    /**
     */
    @NotNull
    private String emailTemplateId;
    
    /**
     */
    @NotNull
    private String costbandcolor;
    
    /**
     */
    @NotNull
    private String notificationName;
    
    /**
     */
    @NotNull
    private String productType;


    public static TypedQuery<Notification> findNotifications() {
        EntityManager em = Notification.entityManager();
        TypedQuery<Notification> q = em.createQuery("SELECT o FROM Notification AS o ", Notification.class);
        return q;
    }
    
    public static List<Notification> findAllNotifications() {
    	return findNotifications().getResultList();
    }


}
