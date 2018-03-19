// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.InvoiceDataOnDemand;
import com.bcs.p3s.model.InvoiceIntegrationTest;
import java.util.Iterator;
import java.util.List;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

privileged aspect InvoiceIntegrationTest_Roo_IntegrationTest {
    
    declare @type: InvoiceIntegrationTest: @RunWith(SpringJUnit4ClassRunner.class);
    
    declare @type: InvoiceIntegrationTest: @ContextConfiguration(locations = "classpath*:/META-INF/spring/applicationContext*.xml");
    
    declare @type: InvoiceIntegrationTest: @Transactional;
    
    @Autowired
    InvoiceDataOnDemand InvoiceIntegrationTest.dod;
    
    @Test
    public void InvoiceIntegrationTest.testCountInvoices() {
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", dod.getRandomInvoice());
        long count = Invoice.countInvoices();
        Assert.assertTrue("Counter for 'Invoice' incorrectly reported there were no entries", count > 0);
    }
    
    @Test
    public void InvoiceIntegrationTest.testFindInvoice() {
        Invoice obj = dod.getRandomInvoice();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to provide an identifier", id);
        obj = Invoice.findInvoice(id);
        Assert.assertNotNull("Find method for 'Invoice' illegally returned null for id '" + id + "'", obj);
        Assert.assertEquals("Find method for 'Invoice' returned the incorrect identifier", id, obj.getId());
    }
    
    @Test
    public void InvoiceIntegrationTest.testFindAllInvoices() {
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", dod.getRandomInvoice());
        long count = Invoice.countInvoices();
        Assert.assertTrue("Too expensive to perform a find all test for 'Invoice', as there are " + count + " entries; set the findAllMaximum to exceed this value or set findAll=false on the integration test annotation to disable the test", count < 250);
        List<Invoice> result = Invoice.findAllInvoices();
        Assert.assertNotNull("Find all method for 'Invoice' illegally returned null", result);
        Assert.assertTrue("Find all method for 'Invoice' failed to return any data", result.size() > 0);
    }
    
    @Test
    public void InvoiceIntegrationTest.testFindInvoiceEntries() {
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", dod.getRandomInvoice());
        long count = Invoice.countInvoices();
        if (count > 20) count = 20;
        int firstResult = 0;
        int maxResults = (int) count;
        List<Invoice> result = Invoice.findInvoiceEntries(firstResult, maxResults);
        Assert.assertNotNull("Find entries method for 'Invoice' illegally returned null", result);
        Assert.assertEquals("Find entries method for 'Invoice' returned an incorrect number of entries", count, result.size());
    }
    
    @Test
    public void InvoiceIntegrationTest.testFlush() {
        Invoice obj = dod.getRandomInvoice();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to provide an identifier", id);
        obj = Invoice.findInvoice(id);
        Assert.assertNotNull("Find method for 'Invoice' illegally returned null for id '" + id + "'", obj);
        boolean modified =  dod.modifyInvoice(obj);
        Integer currentVersion = obj.getVersion();
        obj.flush();
        Assert.assertTrue("Version for 'Invoice' failed to increment on flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void InvoiceIntegrationTest.testMergeUpdate() {
        Invoice obj = dod.getRandomInvoice();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to provide an identifier", id);
        obj = Invoice.findInvoice(id);
        boolean modified =  dod.modifyInvoice(obj);
        Integer currentVersion = obj.getVersion();
        Invoice merged = obj.merge();
        obj.flush();
        Assert.assertEquals("Identifier of merged object not the same as identifier of original object", merged.getId(), id);
        Assert.assertTrue("Version for 'Invoice' failed to increment on merge and flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void InvoiceIntegrationTest.testPersist() {
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", dod.getRandomInvoice());
        Invoice obj = dod.getNewTransientInvoice(Integer.MAX_VALUE);
        Assert.assertNotNull("Data on demand for 'Invoice' failed to provide a new transient entity", obj);
        Assert.assertNull("Expected 'Invoice' identifier to be null", obj.getId());
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
        Assert.assertNotNull("Expected 'Invoice' identifier to no longer be null", obj.getId());
    }
    
    @Test
    public void InvoiceIntegrationTest.testRemove() {
        Invoice obj = dod.getRandomInvoice();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Invoice' failed to provide an identifier", id);
        obj = Invoice.findInvoice(id);
        obj.remove();
        obj.flush();
        Assert.assertNull("Failed to remove 'Invoice' with identifier '" + id + "'", Invoice.findInvoice(id));
    }
    
}
