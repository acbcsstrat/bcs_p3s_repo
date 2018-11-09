package com.bcs.p3s.model;

import java.util.List;

import javax.persistence.Query;
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
@RooJpaActiveRecord(finders = { "findNotificationMappingsByPatent_idAndUser_id" , "findNotificationMappingsByPatent_id", "findNotificationMappingsByUser_id" })
public class NotificationMapping {
	
	private Long patent_id;
	private Long user_id;
	private Long notification_id;
	

	public NotificationMapping(Long patentId, Long userId, Long notificationId) {
		patent_id = patentId;
		user_id = userId;
		notification_id = notificationId;
	}
	
	
	
	
	
	
	/**
	 * 'All' means filtered for this patent and this user
	 * 'On' is a reminder that NotificationMappings only hold 'ON' notifications
	 * 'Notifications' actually means NotificationMappings
	 * @param patent_id
	 * @param user_id
	 * @return all On notifications for this patent and this user, regardless of Notification.productType (see NotificationProductTypeEnum)
	 */
	public static synchronized List<NotificationMapping> findAllOnNotifications(Long patent_id, Long user_id) {

		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
		if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");

        TypedQuery<NotificationMapping> q = entityManager().createQuery(
        		"SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        List<NotificationMapping> q_list = q.getResultList();
        
		return q_list;
	}

	// zaph - hellofaCleanup required here - once notification calls proven
	// blat this once -- ..  zaph 
	//	/**
//	 * 'All' means filtered for this patent, this user and this notification.productType
//	 * 'On' is a reminder that NotificationMappings only hold 'ON' notifications
//	 * 'Notifications' actually means NotificationMappings
//	 * @param patent_id
//	 * @param user_id
//	 * @param productType
//	 * @return all On notifications for this patent, this user and this notification.productType
//	 */
//	public List<NotificationMapping> getAllOnNotifications(Long patent_id, Long user_id, NotificationProductTypeEnum productType) {
//
//		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
//		if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
//		if (productType == null) throw new IllegalArgumentException("The productType argument is required");
//
//		List<NotificationMapping> result = new ArrayList<Notification>();
//
//        TypedQuery<NotificationMapping> q = entityManager().createQuery(
//        		"SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
//        q.setParameter("patent_id", patent_id);
//        q.setParameter("user_id", user_id);
//        List<NotificationMapping> q_list = q.getResultList();
//        
//    	Notification notification = null;
//        for(NotificationMapping nm : q_list){
//        	notification = Notification.findNotification(nm.notification_id);
//        	if (productType==null) {
//        		resultNotifications.add(notification);
//        	}
//        	else if (notification.getProductType().equals(productType.toString()) {
//        		resultNotifications.add(notification);
//        	}
//        }
//		return resultNotifications;
//	}

	
	
	
	// Below 3 method made obsolete by v2.1 - as multiple TYPEs of notification. Revised methods in NotificationUtil
	
	// z called from: PatentUI line 321
//	public List<Notification> getAllPatentNotificationsForUser(Long patent_id,Long user_id){
//		
//		List<Notification> myNotifications = new ArrayList<Notification>();
//		
//		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
//        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
//        //EntityManager em = this.entityManager();
//        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
//        q.setParameter("patent_id", patent_id);
//        q.setParameter("user_id", user_id);
//		
//
//        List<NotificationMapping> q_list = q.getResultList();
//        
//        for(NotificationMapping n : q_list){
//        	myNotifications.add(Notification.findNotification(n.notification_id));
//        }
//		return myNotifications;
//	}
	
	
	// zaph called from: PatentServiceImpl line 416
	// SURELY - THIS IS A DUPLICATE OF THE ABOVE !!
//	public List<NotificationMapping> getAllNotificationMappingsForUser(Long patent_id,Long user_id){
//		
//		
//		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
//        if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");
//        //EntityManager em = this.entityManager();
//        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
//        q.setParameter("patent_id", patent_id);
//        q.setParameter("user_id", user_id);
//		
//        List<NotificationMapping> q_list = q.getResultList();
//        
//        
//		return q_list;
//	}
	

	// WAS getAllNotificationsForPatentForANYusers - used when Delete patent - so instead v2.1 create below 
	// zaph called from: PatentServiceImpl line 416
		// SURELY - THIS IS A DUPLICATE OF THE ABOVE !!
	//		//	public List<NotificationMapping> getAllNotificationsForPatentForANYusers(Long patent_id) {
//		
//		
//		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
//        //EntityManager em = this.entityManager();
//        TypedQuery<NotificationMapping> q = entityManager().createQuery("SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id ", NotificationMapping.class);
//        q.setParameter("patent_id", patent_id);
//        List<NotificationMapping> q_list = q.getResultList();
//        
//		return q_list;
//	}

	/**
	 * Deletes all mappings for the patent - regardless of user or product type
	 * @param patent_id
	 */
	public static synchronized void deleteMappingsForPatent(Long patentId) {
		if (patentId == null) throw new IllegalArgumentException("The patent_id argument is required");
		
		Query delete = entityManager().createQuery("DELETE FROM NotificationMapping AS nm WHERE nm.patent_id = :patent_id");
		delete.setParameter("patent_id", patentId);
		int numDeleted = delete.executeUpdate(); 
	}


	public static void deleteMappings(List<NotificationMapping>  mappingsToDelete) {
		if (mappingsToDelete == null) throw new IllegalArgumentException("The mappingsToDelete argument is required");
		for (NotificationMapping nm : mappingsToDelete) {
			nm.remove();
		}
	}
	public static void addMappings(List<NotificationMapping>  mappingsToAdd) {
		if (mappingsToAdd == null) throw new IllegalArgumentException("The mappingsToAdd argument is required");
		for (NotificationMapping nm : mappingsToAdd) {
			nm.persist();
		}
	}

	
}
