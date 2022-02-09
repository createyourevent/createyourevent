package org.createyourevent.app.session;

import java.util.List;

import org.createyourevent.app.domain.User;
import org.createyourevent.app.repository.UserRepository;
import org.createyourevent.app.web.rest.KeycloakController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

@Component
public class LogoutListener implements ApplicationListener<SessionDestroyedEvent> {



    private final Logger log = LoggerFactory.getLogger(LogoutListener.class);

    private final UserRepository userRepository;

    private final KeycloakController keycloakController;

    public LogoutListener(UserRepository userRepository, KeycloakController keycloakController) {
        this.userRepository = userRepository;
        this.keycloakController = keycloakController;
    }

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event)
    {
        List<SecurityContext> lstSecurityContext = event.getSecurityContexts();
        DefaultOidcUser ud;
        for (SecurityContext securityContext : lstSecurityContext)
        {
            ud = (DefaultOidcUser)   securityContext.getAuthentication().getPrincipal();
            User user = userRepository.findById(ud.getName()).get();
            user.getPoints();
            keycloakController.updatePoints(user.getId(), user.getPoints().toString());
        }
    }

}
