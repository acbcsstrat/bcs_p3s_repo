package com.bcs.p3s.model;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import javax.validation.constraints.NotNull;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
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
}
