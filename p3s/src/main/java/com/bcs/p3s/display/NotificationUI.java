package com.bcs.p3s.display;

import javax.validation.constraints.NotNull;

import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;

/**
 * All *.UI classes should start with this line. See package-info.java for an explanation of these *UI classes 
 * 
 * ITEMS HEREIN NEEDING EXTERNAL SETTING:
 * 	 isOn
 * 
 * Further notes specific to this class:
 * 
 *   None 
 * 
 * @author andyc
 *
 */
public class NotificationUI extends Notification  implements Comparable<NotificationUI> {

    private Boolean isOn;


	// Constructor - converting a Patent to a PatentUI
	public NotificationUI(Notification notification) {

		this.setId(notification.getId());
		this.setVersion(notification.getVersion());

		this.setTitle(notification.getTitle());
		this.setDefaultOn(notification.getDefaultOn());
		this.setDisplayOrder(notification.getDisplayOrder());
		this.setEmailTemplateId(notification.getEmailTemplateId());

		this.setIsOn(false);

	}
		
		
	// Ordinary getters/setters
	public Boolean getIsOn() {
		return isOn;
	}

	public void setIsOn(Boolean  isOn) {
		this.isOn = isOn;
	}

	

	// Note: 
	// compareTo() operates on NotificationUI.displayOrder
	// equals()    operates on NotificationUI.id.
	public int compareTo(NotificationUI compareNotificationUI) {
		int compareDisplayOrder = ((NotificationUI) compareNotificationUI).getDisplayOrder();
		return this.getDisplayOrder() - compareDisplayOrder;  //ascending order
	}
	@Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof NotificationUI)) return false;

        NotificationUI offeredNotificationUI = (NotificationUI) o;
        return this.getId() == offeredNotificationUI.getId();
    }
}
