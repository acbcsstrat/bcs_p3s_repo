package com.bcs.p3s.cron.engine;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.TypedQuery;

import org.apache.commons.beanutils.BeanToPropertyValueTransformer;
import org.apache.commons.collections.CollectionUtils;

import com.bcs.p3s.cron.notification.provider.NotificationFinder;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.engine.RenewalDatesEngine;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.NotificationEmailParams;

public class NotificationEngine extends Universal{
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	
	
	public List<NotificationEmailParams> findNotification() {
		String msg = "findNotification()";
		String notificationName = "";
		log().debug(msg + " invoked");
		
		//NotificationEngine reminder = new NotificationEngine();
		CalendarColour colourDates = new CalendarColour();
		List<Long> patent_ids = new ArrayList<Long>();
		List<NotificationEmailParams> paramsToSend = new ArrayList<NotificationEmailParams>();
		List<NotificationMapping> allMappings = new ArrayList<NotificationMapping>();
		
		List<Patent> patents = Patent.findAllPatents();
		log().debug("Retrieving patents with SHOW_PRICE/TOO_LATE status from database");
		for(Patent patent : patents){
			
			if(RenewalStatusEnum.SHOW_PRICE.equals(patent.getRenewalStatus()) || RenewalStatusEnum.TOO_LATE.equals(patent.getRenewalStatus())){
				patent_ids.add(patent.getId());
				log().debug("Added patent id[" + patent.getId() +"] to the list");
			}
		}
		
		if(patent_ids.isEmpty()){
			log().debug("No patents with status SHOW PRICE/TOO LATE in the database");
			//return null;
			return null;
		}
		
		for(Long id : patent_ids){
			TypedQuery<NotificationMapping> q_mapping = NotificationMapping.findNotificationMappingsByPatent_id(id);
			List<NotificationMapping> temp = q_mapping.getResultList();
			allMappings.addAll(temp);
			log().debug("Patent id "+ id +" has " + temp.size() + " entries in NotificationMapping Table");
		}
		
		if(allMappings.isEmpty()){
			log().debug("NotificationMapping table has no entries. No notification to send this time");
			//return null;
			return null;
		}
		
		//CALL TO A METHOD THAT GROUPS REST PATENTS BASED ON FILING MONTH
		HashMap<String,List<NotificationMapping>> groupByMonth = groupByMonthFiling(allMappings);
		
		if(groupByMonth.isEmpty()){
			log().error("Error occured during group by month. So no notifications being send this time");
			//return null;
			return null;
		}
		//ITERATE THROUGH THAT RESULTING MAP
		List<String> months = new ArrayList<String>(groupByMonth.keySet());
		
		if(months.isEmpty()){
			log().debug("Grouped by filing month HahMap having set of " + months.size() + " items. So no notifications being sedn this time");
			return null;
		}
			
		log().debug("Grouped by filing month HashMap having set of " + months.size() + " items ::: " + months.toString());
		
		for(String month : months){
			log().debug("**** CHECK FOR " + month + " BEGINS ****");
			log().debug("Begin to check any notifications to be send for all patents in "+ month);
			List<NotificationMapping> obValue = groupByMonth.get(month);
			if(obValue.isEmpty()){
				log().info("NotificationMapping for month " + month + " found empty. Aborting further calculations");
				continue;
			}
			
			//PATENTS IN THAT LIST#
			//Collection<String> list_ids = CollectionUtils.collect(obValue, TransformerUtils.invokerTransformer("NotificationMapping_Roo_JavaBean.getPatent_id()"));
			List<Long> list_ids = (List<Long>) CollectionUtils.collect(obValue, 
                    new BeanToPropertyValueTransformer("patent_id"));
			Set<Long> ids_set = new HashSet<Long>();
			ids_set.addAll(list_ids);
			//find renewal date for any patent in the list. Note al patents in the list will be having the same renewal due date
			colourDates = findAllColourDates(obValue);
			
			notificationName = checkAnyNotificationToSend(colourDates);
			
			if(notificationName.isEmpty()){
				log().info("No notifications to be send for filing month " + month);
				continue;
			}
			
			log().info("Notification ** " + notificationName +" ** should be send for patents::: "+ ids_set);
			//else further calculations to send emails
			log().debug("Begin to check Notification Table for the Notification Name ** "+ notificationName +"**");
			Notification notification = new Notification();
			try{
				TypedQuery<Notification> n_query = Notification.findNotificationsByNotificationName(notificationName);
				notification = n_query.getSingleResult();
			}
			catch(Exception e){
				log().error("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.");
				log().warn("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.");
				log().warn("Aborting further processing for " + month);
				logErrorAndContinue("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.No email send for patents ");
				continue;
			}
				
			if(notification == null){
				log().error("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.");
				log().warn("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.");
				log().warn("Aborting further processing for " + month);
				logErrorAndContinue("Notification Name ** "+ notificationName +"** found no entry in Notification tbl.No email send for patents ");
				continue;
			}
			
			for(NotificationMapping nMapping : obValue){
				P3SUser user = P3SUser.findP3SUser(nMapping.getUser_id());
				if(nMapping.getNotification_id() == notification.getId()){
					log().info("Found notification [" + notificationName +"] mapped");
					log().info("User[" + user.getEmailAddress() +"] enabled Notification[" + notificationName+ "] for patent[" + nMapping.getPatent_id() +"]");
					if(user.getIsEmailNotification()){
						log().info("User[" + user.getEmailAddress() +"] enabled Email Notification");
						log().info("*** Notification :: "+ notificationName + "[" + notification.getId() + "] SHOUDL BE SEND to User[" + user.getEmailAddress() + "] "
								+ " for patent "+ nMapping.getPatent_id() +"***") ;
						//calling NotificationEmailParams constructor to populate data 
						NotificationEmailParams params = new NotificationEmailParams(nMapping,notification,user,colourDates);
						paramsToSend.add(params);
					}
					else{
						log().info("User[" + user.getEmailAddress() +"] disabled Email Notification");
						log().info("*** Notification :: "+ notificationName + "[" + notification.getId()  + "] SHOULD NOT BE SEND to User[" + user.getEmailAddress() + "] "
								+ " for patent "+ nMapping.getPatent_id() +"***") ;
					}
					
				}
			}
			
			if(paramsToSend.isEmpty())
				log().info(notificationName + " need not be send to any user{either No mapping found or mapped user has disabled email notification}");
			else
				log().info(notificationName + " should be send to " + paramsToSend.size() + " user(s)");
			
		}
		
		log().debug(msg +" returning " + paramsToSend.size() +" email(s) to send");
		
		return paramsToSend;
		
	}
	
	protected CalendarColour findAllColourDates(List<NotificationMapping> currentList){
		
		RenewalDates rDates = new RenewalDates();
		CalendarColour colourDates = new CalendarColour(); 
		String msg ="findAllColourDates()";
		log().debug(msg + " invoked to find any Notification to be send for current filing month");
		
		//Set<String> months =  groupByMonth.keySet();
		
		log().debug("Current renewal due date will be same for all patents in the list NotificationMapping.");
		log().debug("Begin to find Renewal window dates for first patent in the list NotificationMapping");
		Patent patent = Patent.findPatent(currentList.get(0).getPatent_id());
		rDates =  new RenewalDatesEngine().getRenewalDates(patent);
			
		if(rDates == null){
			log().error("Renewal Dates calculation failed for patent[" + patent.getId() +"] with finling dates as " + patent.getInternationalFilingDate());
			return colourDates;
		}
			
		TypedQuery<CalendarColour> q = CalendarColour.findCalendarColoursByRenewalDueDate(rDates.getCurrentRenewalDueDate());
		colourDates = q.getSingleResult();
			
		if(colourDates == null){
			log().error("No CalendarColour entry found for renewal due date as " + rDates.getCurrentRenewalDueDate());
			return colourDates;
		}
		
		
		log().debug("Boundary dates retrieved successfully");
		log().debug("Begin to check what notification to be send now");
		return colourDates;
	}
	/**
	 * 
	 * @param mappingsFiltered
	 * @return List<NotificationMapping> grouped by Filing Month
	 */
	public HashMap<String,List<NotificationMapping>> groupByMonthFiling(List<NotificationMapping> mappingsFiltered){
		
		String msg = "groupByMonthFiling(mappingsFiltered)";
		log().debug(msg + " invoked for grouping List<NotificationMapping> based on month");
		
		
		HashMap<String,List<NotificationMapping>> groupByMonth = new HashMap<String,List<NotificationMapping>>();
		List<NotificationMapping> janList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> febList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> marchList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> aprilList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> mayList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> juneList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> julyList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> augList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> septList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> octList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> novList = new ArrayList<NotificationMapping>();
		List<NotificationMapping> decList = new ArrayList<NotificationMapping>();
		
		for(NotificationMapping eachMapping : mappingsFiltered){
			
			Calendar calendar = Calendar.getInstance();
			Long patent_id = eachMapping.getPatent_id();
			Patent patent = Patent.findPatent(patent_id);
			calendar.setTime(patent.getInternationalFilingDate());
			int month = calendar.get(Calendar.MONTH);
			if(month == 0)
				janList.add(eachMapping);
			else if(month == 1)
				febList.add(eachMapping);
			else if(month == 2)
				marchList.add(eachMapping);
			else if(month == 3)
				aprilList.add(eachMapping);
			else if(month == 4)
				mayList.add(eachMapping);
			else if(month == 5)
				juneList.add(eachMapping);
			else if(month == 6)
				julyList.add(eachMapping);
			else if(month == 7)
				augList.add(eachMapping);
			else if(month == 8)
				septList.add(eachMapping);
			else if(month == 9)
				octList.add(eachMapping);
			else if(month == 10)
				novList.add(eachMapping);
			else if(month == 11)
				decList.add(eachMapping);
			else
				log().error("[Patent-"+ patent_id +"] Error calculating filing month for filing Date " + patent.getInternationalFilingDate() +".Obtained month as " + month);
			
		}
		
		if(!janList.isEmpty())
			groupByMonth.put("January", janList);
		if(!febList.isEmpty())
			groupByMonth.put("February", febList);
		if(!marchList.isEmpty())
			groupByMonth.put("March", marchList);
		if(!aprilList.isEmpty())
			groupByMonth.put("April", aprilList);
		if(!mayList.isEmpty())
			groupByMonth.put("May", mayList);
		if(!juneList.isEmpty())
			groupByMonth.put("June", juneList);
		if(!julyList.isEmpty())
			groupByMonth.put("July", julyList);
		if(!augList.isEmpty())
			groupByMonth.put("August", augList);
		if(!septList.isEmpty())
			groupByMonth.put("September", septList);
		if(!octList.isEmpty())
			groupByMonth.put("October", octList);
		if(!novList.isEmpty())
			groupByMonth.put("November", novList);
		if(!decList.isEmpty())
			groupByMonth.put("December", decList);
		
		if(groupByMonth.isEmpty()){
			log().error(msg +" finished with empty Map for grouping based on month");
			return null;
		}
		
		return groupByMonth;
		
				
	}
	
	/**
	 * 
	 * @param groupByMonth - List should contain NotificationMapping with same filing month 
	 * @return NotificationEmailParams setting template and obTimeSatmpOfNextColourChange if any notification to send else null
	 */
	public String checkAnyNotificationToSend(CalendarColour colourDates){
		
		String msg = "checkAnyNotificationToSend()";
		
		String name = "";
		if(colourDates == null){
			log().debug(msg +" invoked with null parameter. Aborting further processing.");
			return "";
		}
		
		log().debug(msg + " to find any Notification to be send for current filing month invoked");
		NotificationFinder finderObj = new NotificationFinder();
		
		Method[] methods = finderObj.getClass().getDeclaredMethods();
		    
		try
		{
		    for(int i=0;i<methods.length;i++)
		    {
		    	name = (String) methods[i].invoke(finderObj,colourDates);
		       if(!(name.equals("")))
		    	   break;
		    }
		}
		    
		catch(Exception ex)
		{
		   System.out.println(ex.getMessage());
		}
		
		log().debug(msg + " returning Notification Name as **" +  name);
		return name;
		
	}
	
}
	


