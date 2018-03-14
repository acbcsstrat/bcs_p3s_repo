package com.bcs.p3s.controller.web;
import com.bcs.p3s.model.Patent;
import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/patents")
@Controller
@RooWebScaffold(path = "patents", formBackingObject = Patent.class)
public class PatentController {
}
