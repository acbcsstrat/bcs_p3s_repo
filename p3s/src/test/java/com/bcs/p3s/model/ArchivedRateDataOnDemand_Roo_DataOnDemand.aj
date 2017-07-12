// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.ArchivedRateDataOnDemand;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.stereotype.Component;

privileged aspect ArchivedRateDataOnDemand_Roo_DataOnDemand {
    
    declare @type: ArchivedRateDataOnDemand: @Component;
    
    private Random ArchivedRateDataOnDemand.rnd = new SecureRandom();
    
    private List<ArchivedRate> ArchivedRateDataOnDemand.data;
    
    public ArchivedRate ArchivedRateDataOnDemand.getNewTransientArchivedRate(int index) {
        ArchivedRate obj = new ArchivedRate();
        setActiveFromDate(obj, index);
        setFxRate(obj, index);
        return obj;
    }
    
    public void ArchivedRateDataOnDemand.setActiveFromDate(ArchivedRate obj, int index) {
        Date activeFromDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setActiveFromDate(activeFromDate);
    }
    
    public void ArchivedRateDataOnDemand.setFxRate(ArchivedRate obj, int index) {
        BigDecimal fxRate = BigDecimal.valueOf(index);
        obj.setFxRate(fxRate);
    }
    
    public ArchivedRate ArchivedRateDataOnDemand.getSpecificArchivedRate(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        ArchivedRate obj = data.get(index);
        Long id = obj.getId();
        return ArchivedRate.findArchivedRate(id);
    }
    
    public ArchivedRate ArchivedRateDataOnDemand.getRandomArchivedRate() {
        init();
        ArchivedRate obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return ArchivedRate.findArchivedRate(id);
    }
    
    public boolean ArchivedRateDataOnDemand.modifyArchivedRate(ArchivedRate obj) {
        return false;
    }
    
    public void ArchivedRateDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = ArchivedRate.findArchivedRateEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'ArchivedRate' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<ArchivedRate>();
        for (int i = 0; i < 10; i++) {
            ArchivedRate obj = getNewTransientArchivedRate(i);
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
