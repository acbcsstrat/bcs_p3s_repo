// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.BusinessDataOnDemand;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.P3SUserDataOnDemand;
import java.security.SecureRandom;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

privileged aspect P3SUserDataOnDemand_Roo_DataOnDemand {
    
    declare @type: P3SUserDataOnDemand: @Component;
    
    private Random P3SUserDataOnDemand.rnd = new SecureRandom();
    
    private List<P3SUser> P3SUserDataOnDemand.data;
    
    @Autowired
    BusinessDataOnDemand P3SUserDataOnDemand.businessDataOnDemand;
    
    public P3SUser P3SUserDataOnDemand.getNewTransientP3SUser(int index) {
        P3SUser obj = new P3SUser();
        setAvatar_blob(obj, index);
        setBusiness(obj, index);
        setCreatedDate(obj, index);
        setEmailAddress(obj, index);
        setFirstName(obj, index);
        setIsEmailNotification(obj, index);
        setLastName(obj, index);
        setPassword(obj, index);
        setStatus(obj, index);
        setUserrole(obj, index);
        return obj;
    }
    
    public void P3SUserDataOnDemand.setAvatar_blob(P3SUser obj, int index) {
        Blob avatar_blob = null;
        obj.setAvatar_blob(avatar_blob);
    }
    
    public void P3SUserDataOnDemand.setBusiness(P3SUser obj, int index) {
        Business business = businessDataOnDemand.getRandomBusiness();
        obj.setBusiness(business);
    }
    
    public void P3SUserDataOnDemand.setCreatedDate(P3SUser obj, int index) {
        Date createdDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setCreatedDate(createdDate);
    }
    
    public void P3SUserDataOnDemand.setEmailAddress(P3SUser obj, int index) {
        String emailAddress = "foo" + index + "@bar.com";
        obj.setEmailAddress(emailAddress);
    }
    
    public void P3SUserDataOnDemand.setFirstName(P3SUser obj, int index) {
        String firstName = "firstName_" + index;
        obj.setFirstName(firstName);
    }
    
    public void P3SUserDataOnDemand.setIsEmailNotification(P3SUser obj, int index) {
        Boolean isEmailNotification = Boolean.TRUE;
        obj.setIsEmailNotification(isEmailNotification);
    }
    
    public void P3SUserDataOnDemand.setLastName(P3SUser obj, int index) {
        String lastName = "lastName_" + index;
        obj.setLastName(lastName);
    }
    
    public void P3SUserDataOnDemand.setPassword(P3SUser obj, int index) {
        String password = "password_" + index;
        obj.setPassword(password);
    }
    
    public void P3SUserDataOnDemand.setStatus(P3SUser obj, int index) {
        String status = "status_" + index;
        obj.setStatus(status);
    }
    
    public void P3SUserDataOnDemand.setUserrole(P3SUser obj, int index) {
        String userrole = "userrole_" + index;
        obj.setUserrole(userrole);
    }
    
    public P3SUser P3SUserDataOnDemand.getSpecificP3SUser(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        P3SUser obj = data.get(index);
        Long id = obj.getId();
        return P3SUser.findP3SUser(id);
    }
    
    public P3SUser P3SUserDataOnDemand.getRandomP3SUser() {
        init();
        P3SUser obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return P3SUser.findP3SUser(id);
    }
    
    public boolean P3SUserDataOnDemand.modifyP3SUser(P3SUser obj) {
        return false;
    }
    
    public void P3SUserDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = P3SUser.findP3SUserEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'P3SUser' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<P3SUser>();
        for (int i = 0; i < 10; i++) {
            P3SUser obj = getNewTransientP3SUser(i);
            try {
                obj.persist();
            } catch (final ConstraintViolationException e) {
                final StringBuilder msg = new StringBuilder();
                for (Iterator<ConstraintViolation<?>> iter = e.getConstraintViolations().iterator(); iter.hasNext();) {
                    final ConstraintViolation<?> cv = iter.next();
                    msg.append("[").append(cv.getRootBean().getClass().getName()).append(".").append(cv.getPropertyPath()).append(": ").append(cv.getMessage()).append(" (invalid value = ").append(cv.getInvalidValue()).append(")").append("]");
                }
                throw new IllegalStateException(msg.toString(), e);
            }
            obj.flush();
            data.add(obj);
        }
    }
    
}
