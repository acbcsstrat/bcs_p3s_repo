package com.bcs.p3s.controller.web;
import com.bcs.p3s.model.Business;
import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/businesses")
@Controller
@RooWebScaffold(path = "businesses", formBackingObject = Business.class)
public class BusinessController {
}
