/**
 * 
 */
/**
 * @author merinp
 *
 *handler class for dealing with redirection to index.htm after successful login
 */


package com.bcs.p3s.security;

import java.io.IOException;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;


public class SimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler  {

	
	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, 
		      HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		
		
		String targetUrl = determineTargetUrl(authentication);
			
		if (response.isCommitted()) {
	            
	           return;
	    }
		redirectStrategy.sendRedirect(request, response, targetUrl);
		
		
	}
	
	
	protected String determineTargetUrl(Authentication authentication) {
        boolean isUser = false;
        boolean isAdmin = false;
        Collection<? extends GrantedAuthority> authorities
         = authentication.getAuthorities();
        for (GrantedAuthority grantedAuthority : authorities) {
            if (grantedAuthority.getAuthority().equals("user")) {    //Role names user and admin from userrole DB
                isUser = true;
                break;
            } else if (grantedAuthority.getAuthority().equals("admin")) {
                isAdmin = true;
                break;
            }
        }
 
        if (isUser) {
            return "/index.htm";
        } 
        /*else if (isAdmin) {
            return "/console.html";
        } */
        else 
        {
            throw new IllegalStateException();
        }
    }

	
	protected void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

	public RedirectStrategy getRedirectStrategy() {
		return redirectStrategy;
	}


	public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
		this.redirectStrategy = redirectStrategy;
	}
	

}
