package com.bcs.p3s.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.ManyToMany;
import javax.persistence.TypedQuery;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

/**
 * manually created mapping class for patent notifications per user
 * @author MerinP
 *
 */
@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findNotificationMappingsByPatent_idAndUser_id" })
public class NotificationMapping {
	
	private Long patent_id;
	private Long user_id;
	private Long notification_id;
	
	
	public List<Notification> getAllPatentNotificationsForUser(Long patent_id,Long user_id){
		
		List<Notification> myNotifications = new ArrayList<Notification>();
		
		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        //EntityManager em = this.entityManager();
        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
		

        List<NotificationMapping> q_list = q.getResultList();
        
        for(NotificationMapping n : q_list){
        	myNotifications.add(Notification.findNotification(n.notification_id));
        }
		return myNotifications;
	}
	
	
	public List<NotificationMapping> getAllNotificationMappingsForUser(Long patent_id,Long user_id){
		
		
		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
        //EntityManager em = this.entityManager();
        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
		
        List<NotificationMapping> q_list = q.getResultList();
        
        
		return q_list;
	}
	
	public List<NotificationMapping> getAllNotificationForPatent(Long patent_id){
		
		
		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
        //EntityManager em = this.entityManager();
        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id ", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        List<NotificationMapping> q_list = q.getResultList();
        
		return q_list;
	}

}
