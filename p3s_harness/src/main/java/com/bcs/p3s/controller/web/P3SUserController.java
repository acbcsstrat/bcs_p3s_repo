package com.bcs.p3s.controller.web;
import com.bcs.p3s.model.P3SUser;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.security.crypto.bcrypt.BCrypt;


@RequestMapping("/p3susers")
@Controller
@RooWebScaffold(path = "p3susers", formBackingObject = P3SUser.class)
public class P3SUserController {

    @RequestMapping(method = RequestMethod.POST, produces = "text/html")
    public String create(@Valid P3SUser p3SUser, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, p3SUser);
            return "p3susers/create";
        }

        System.out.println(" ****   Creating a P3SUser with an Bcrypteded password **************");
    	String password = p3SUser.getPassword();
        String salt =  BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(password,salt); 
        p3SUser.setPassword(hashedPassword);
        System.out.println(" ****   DONE  **************");

        uiModel.asMap().clear();
        p3SUser.persist();
        return "redirect:/p3susers/" + encodeUrlPathSegment(p3SUser.getId().toString(), httpServletRequest);
    }
    

    
    @RequestMapping(method = RequestMethod.PUT, produces = "text/html")
    public String update(@Valid P3SUser p3SUser, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, p3SUser);
            return "p3susers/update";
        }

        System.out.println(" ****   Updating a P3SUser with an Bcrypteded password **************");
    	String password = p3SUser.getPassword();
        String salt =  BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(password,salt); 
        p3SUser.setPassword(hashedPassword);
        System.out.println(" ****   Done **************");

        uiModel.asMap().clear();
        p3SUser.merge();
        return "redirect:/p3susers/" + encodeUrlPathSegment(p3SUser.getId().toString(), httpServletRequest);
    }
    




}
