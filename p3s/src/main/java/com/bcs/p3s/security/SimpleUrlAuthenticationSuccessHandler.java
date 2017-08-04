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

import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.session.PostLoginSessionBean;


public class SimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler  {

	
	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	private PostLoginDataEngine moreData = new PostLoginDataEngine();
	public HttpSession session;
	protected String PREFIX = this.getClass().getName() + " : "; 
	public PostLoginSessionBean postSession;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, 
		      HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		
		
		String targetUrl = determineTargetUrl(authentication);
			
		if (response.isCommitted()) {
	            
	           return;
	    }
		
		setPostSession(populateAuthenticationAttributes(request));
		if(session != null){
			
			/**
			 * CALL TO POPULATE EXTENDED PATENT FIELDS
			 */
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			pLoginSession = moreData.getExtendedPatentData(pLoginSession);
			session.setAttribute("postSession",pLoginSession);
			
			redirectStrategy.sendRedirect(request, response, targetUrl);
		}
		else
			throw new ServletException();
		
		
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

/**
 * 
 * 
 * New method added for handling session
 * @param authentication
 * @return
 */
	protected PostLoginSessionBean populateAuthenticationAttributes(HttpServletRequest request) {
		
		session = request.getSession(true);
        PostLoginSessionBean postSession = new PostLoginSessionBean();
        
        P3SUser myUser = SecurityUtil.getMyUser();
        postSession.setUser(myUser);
    	Business myBusiness = SecurityUtil.getMyBusiness();
    	postSession.setBusiness(myBusiness);
        session.setAttribute("postSession",postSession);
        
        return postSession;
        
	}
	
/** Code changes for populating session variabled end **/	
	
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


	public PostLoginSessionBean getPostSession() {
		return postSession;
	}


	public void setPostSession(PostLoginSessionBean postSession) {
		this.postSession = postSession;
	}
	

	
}
