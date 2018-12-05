package com.bcs.p3s.model;

import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.P3SRuntimeException;


/**
 * manually created mapping class for patent notifications per user
 * @author MerinP
 *
 */
@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findNotificationMappingsByPatent_id", "findNotificationMappingsByUser_id"
		, "findNotificationMappingsByPatent_idAndUser_id"
		, "findNotificationMappingsByPatent_idAndUser_idAndNotification_id"})

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
	public static synchronized List<NotificationMapping> findAllOnNotificationMappings(Long patent_id, Long user_id) {

		if (patent_id == null) throw new IllegalArgumentException("The patent_id argument is required");
		if (user_id == null) throw new IllegalArgumentException("The user_id argument is required");

        TypedQuery<NotificationMapping> q = entityManager().createQuery(
        		"SELECT o FROM NotificationMapping AS o WHERE o.patent_id = :patent_id AND o.user_id = :user_id", NotificationMapping.class);
        q.setParameter("patent_id", patent_id);
        q.setParameter("user_id", user_id);
        List<NotificationMapping> q_list = q.getResultList();
        
		return q_list;
	}


	// z a p h - hellofaCleanup required here - once notification calls proven
	// blat this once -- ..   
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
	
	
	// acTidy - called from: PatentServiceImpl line 416
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
	// acTidy called from: PatentServiceImpl line 416
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
	public static synchronized void deleteAllMappingsForPatent(Long patentId) {
		if (patentId == null) throw new IllegalArgumentException("The patent_id argument is required");

		// love to solve this - acTodo
		//Query delete = entityManager().createQuery("DELETE FROM NotificationMapping nm WHERE nm.patent_id = :patent_id");
		//delete.setParameter("patent_id", patentId);
		//int numDeleted = delete.executeUpdate(); 

		List<NotificationMapping> mappings = findNotificationMappingsByPatent_id(patentId).getResultList();
		for (NotificationMapping notificationMapping : mappings) {
			notificationMapping.remove();
		}
	}


	
	public static void deleteNotificationMappingsByNotification(List<Long> notificationIds, long patentId, long userId) {
		if (notificationIds == null) throw new IllegalArgumentException("The notificationIds argument is required");
		if (patentId == 0) throw new IllegalArgumentException("The patentId argument is required");
		if (userId == 0) throw new IllegalArgumentException("The userId argument is required");
		for (Long notificationId : notificationIds) {
			NotificationMapping byebye = 
					findNotificationMappingByPatentidAndUseridAndNotificationid(patentId, userId, notificationId);
			byebye.remove();
		}
	}
	public static NotificationMapping findNotificationMappingByPatentidAndUseridAndNotificationid(Long patent_id, Long user_id, Long notification_id) {
		List<NotificationMapping> listOfOne = 
				findNotificationMappingsByPatent_idAndUser_idAndNotification_id(patent_id, user_id, notification_id).getResultList();
		if (listOfOne==null || listOfOne.size()!=1) 
			throw new P3SRuntimeException("Cannot delete non-existant NotificationMapping("+patent_id+", "+user_id+", "+notification_id);
		return listOfOne.get(0);
	}
	
//	public static void deleteNotificationMappings(List<Long>  mappingsToDelete) {
//		if (mappingsToDelete == null) throw new IllegalArgumentException("The mappingsToDelete argument is required");
//		for (Long nm : mappingsToDelete) {
//			NotificationMapping byebye = NotificationMapping.findNotificationMapping(nm);
//			byebye.remove();
//		}
//	}
	// May be wanted someday, again
	//public static void deleteMappings(List<NotificationMapping>  mappingsToDelete) {
	//	if (mappingsToDelete == null) throw new IllegalArgumentException("The mappingsToDelete argument is required");
	//	for (NotificationMapping nm : mappingsToDelete) {
	//		nm.remove();
	//	}
	//}
	public static void addMappings(List<NotificationMapping>  mappingsToAdd) {
		if (mappingsToAdd == null) throw new IllegalArgumentException("The mappingsToAdd argument is required");
		for (NotificationMapping nm : mappingsToAdd) {
			nm.persist();
		}
	}

	
}
