// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Certificate;
import com.bcs.p3s.model.CertificateDataOnDemand;
import com.bcs.p3s.model.RenewalDataOnDemand;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

privileged aspect CertificateDataOnDemand_Roo_DataOnDemand {
    
    declare @type: CertificateDataOnDemand: @Component;
    
    private Random CertificateDataOnDemand.rnd = new SecureRandom();
    
    private List<Certificate> CertificateDataOnDemand.data;
    
    @Autowired
    RenewalDataOnDemand CertificateDataOnDemand.renewalDataOnDemand;
    
    public Certificate CertificateDataOnDemand.getNewTransientCertificate(int index) {
        Certificate obj = new Certificate();
        setCertificateTemplateId(obj, index);
        setDocPath(obj, index);
        setFilename(obj, index);
        setIssueDate(obj, index);
        setRenewedOnDateExEpo(obj, index);
        return obj;
    }
    
    public void CertificateDataOnDemand.setCertificateTemplateId(Certificate obj, int index) {
        String certificateTemplateId = "certificateTemplateId_" + index;
        obj.setCertificateTemplateId(certificateTemplateId);
    }
    
    public void CertificateDataOnDemand.setDocPath(Certificate obj, int index) {
        String docPath = "docPath_" + index;
        obj.setDocPath(docPath);
    }
    
    public void CertificateDataOnDemand.setFilename(Certificate obj, int index) {
        String filename = "filename_" + index;
        obj.setFilename(filename);
    }
    
    public void CertificateDataOnDemand.setIssueDate(Certificate obj, int index) {
        Date issueDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setIssueDate(issueDate);
    }
    
    public void CertificateDataOnDemand.setRenewedOnDateExEpo(Certificate obj, int index) {
        Date renewedOnDateExEpo = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setRenewedOnDateExEpo(renewedOnDateExEpo);
    }
    
    public Certificate CertificateDataOnDemand.getSpecificCertificate(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Certificate obj = data.get(index);
        Long id = obj.getId();
        return Certificate.findCertificate(id);
    }
    
    public Certificate CertificateDataOnDemand.getRandomCertificate() {
        init();
        Certificate obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return Certificate.findCertificate(id);
    }
    
    public boolean CertificateDataOnDemand.modifyCertificate(Certificate obj) {
        return false;
    }
    
    public void CertificateDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = Certificate.findCertificateEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Certificate' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Certificate>();
        for (int i = 0; i < 10; i++) {
            Certificate obj = getNewTransientCertificate(i);
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