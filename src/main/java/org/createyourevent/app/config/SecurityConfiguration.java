package org.createyourevent.app.config;

import java.util.*;
import org.createyourevent.app.security.*;
import org.createyourevent.app.security.SecurityUtils;
import org.createyourevent.app.security.oauth2.AudienceValidator;
import org.createyourevent.app.security.oauth2.CustomClaimConverter;
import org.createyourevent.app.security.oauth2.JwtGrantedAuthorityConverter;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Scope;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.preauth.x509.X509AuthenticationFilter;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.frameoptions.StaticAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;
import tech.jhipster.config.JHipsterProperties;

@Configuration
@EnableWebSecurity
@KeycloakConfiguration
// @EnableConfigurationProperties(KeycloakSpringBootProperties.class)
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
@ComponentScan(basePackageClasses = KeycloakSecurityComponents.class)
public class SecurityConfiguration extends KeycloakWebSecurityConfigurerAdapter {

    private final JHipsterProperties jHipsterProperties;

    private final CorsFilter corsFilter;

    private final KeycloakClientRequestFactory keycloakClientRequestFactory;

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    private final SecurityProblemSupport problemSupport;

    public SecurityConfiguration(
        CorsFilter corsFilter,
        JHipsterProperties jHipsterProperties,
        SecurityProblemSupport problemSupport,
        KeycloakClientRequestFactory keycloakClientRequestFactory
    ) {
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
        this.jHipsterProperties = jHipsterProperties;
        this.keycloakClientRequestFactory = keycloakClientRequestFactory;

        //to use principal and authentication together with @async
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    @Override
    public void configure(WebSecurity web) {
        web
            .ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/swagger-ui/**")
            .antMatchers("/config/createyourevent/prod/main")
            .antMatchers("/config/**")
            .antMatchers("/test/**");

        web.debug(true);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        super.configure(http);

        http
            .csrf()
            .disable().exceptionHandling() //inserted
            // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .and()
            .addFilterBefore(corsFilter, CsrfFilter.class)
            .exceptionHandling()
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport)
        .and()
            .headers()
            .contentSecurityPolicy("default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/pdfjs-dist@2.11.338/legacy/build/pdf.worker.js https://pay.datatrans.com https://pay.sandbox.datatrans.com https://fundingchoicesmessages.google.com https://matomo.createyourevent.org https://www.paypal.com https://createyourevent.matomo.cloud https://createyourevent.matomo.cloudpiwik.js https://cdn.matomo.cloud https://adservice.google.com https://tpc.googlesyndication.com https://adservice.google.ch https://www.googletagservices.com https://partner.googleadservices.com https://pagead2.googlesyndication.com https://js.stripe.com https://cdnjs.cloudflare.com https://rawcdn.githack.com https://ajax.googleapis.com https://media.payrexx.com https://www.youtube.com https://tamaro.raisenow.com https://tamaro.raisenow.com/reall-ed89/latest/widget.js https://tamaro.raisenow.com/reall-ed89/latest/preloader.b27a1b60.js https://connect.facebook.net https://maps.googleapis.com https://s.ytimg.com https://www.youtube.com/iframe_api https://www.google-analytics.com https://www.googletagmanager.com 'unsafe-eval' data: gap: content:; style-src 'self' 'unsafe-inline' https://tamaro.raisenow.com https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com https://unpkg.com; font-src 'self' 'unsafe-inline' https://fonts.gstatic.com 'unsafe-eval'; object-src 'none'; base-uri 'self'; connect-src 'self' https://dev.createyourevent.org:9000 https://fundingchoicesmessages.google.com https://adservice.google.com https://chat.createyourevent.org:3000 *.createyourevent.org/socket.io  https://*.createyourevent.org https://createyourevent.matomo.cloud https://stats.g.doubleclick.net https://csi.gstatic.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://www.createyourevent.org:3100 ws://chat.createyourevent.org wss://chat.createyourevent.org https://www.sandbox.paypal.com https://www.google-analytics.com https://www.createyourevent.org:3000 ws://www.createyourevent.org:3000 wss://www.createyourevent.org:3000 https://maps.googleapis.com; frame-ancestors 'self' https://pay.datatrans.com https://pay.sandbox.datatrans.com;  frame-src 'self' https://pay.datatrans.com https://pay.sandbox.datatrans.com https://www.google.com https://www.sandbox.paypal.com https://lucid.app https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://docs.google.com https://js.stripe.com https://player.vimeo.com https://createyourevent.payrexx.com https://www.mindmeister.com https://web.facebook.com https://www.facebook.com https://s.ytimg.com https://www.youtube.com data: ; img-src 'self' 'unsafe-inline'  http://pagead2.googlesyndication.com https://www.google.com https://www.google.ch https://pagead2.googlesyndication.com https://raw.githubusercontent.com https://docs.google.com https://maps.google.com https://www.paypal.com https://www.paypalobjects.com https://www.google-analytics.com https://maps.gstatic.com https://maps.googleapis.com data: blob:; manifest-src 'self'; media-src 'self' https://raw.githubusercontent.com; worker-src blob:; child-src  data: blob: gap: https://www.youtube.com/ https://s.ytimg.com;")
            // .contentSecurityPolicy(jHipsterProperties.getSecurity().getContentSecurityPolicy())
        .and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
        .and()
            .featurePolicy("geolocation 'self'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'self'; fullscreen 'self'; payment 'self' https://www.stripe.com https://www.paypal.com")
        .and()
            .frameOptions()
            .disable()
        .and()
            .authorizeRequests()
            .antMatchers("/login/**").permitAll()
            .antMatchers("/error/**").permitAll()
            .antMatchers("/config/**").permitAll()
            .antMatchers("/config/createyourevent/prod/main").permitAll()
            .antMatchers("/config/**").permitAll()
            .antMatchers("/eureka/**").permitAll()
            .antMatchers("/api/music/**").permitAll()
            .antMatchers("/api/coupons/**").permitAll()
            .antMatchers("/api/slot-list-clocks/**").permitAll()
            .antMatchers("/api/slot-list-oranges/**").permitAll()
            .antMatchers("/api/slot-list-cherries/**").permitAll()
            .antMatchers("/api/slot-list-plums/**").permitAll()
            .antMatchers("/api/reservations/**").permitAll()
            .antMatchers("/api/datatrans/**").permitAll()
            .antMatchers("/api/public/**").permitAll()
            .antMatchers("/api/bonds/**").permitAll()
            .antMatchers("/api/organizations/**").permitAll()
            .antMatchers("/api/clubs/**").permitAll()
            .antMatchers("/api/hotels/**").permitAll()
            .antMatchers("/api/restaurants/**").permitAll()
            .antMatchers("/api/organization-reservations/**").permitAll()
            .antMatchers("/api/mp-3-s/**").permitAll()
            .antMatchers("/api/music_del/**").permitAll()
            .antMatchers("/api/upload/**").permitAll()
            .antMatchers("/api/users_createyourevent/**").permitAll()
            .antMatchers("/api/delivery-types/**").permitAll()
            .antMatchers("/api/chips/**").permitAll()
            .antMatchers("/api/chips-collections/**").permitAll()
            .antMatchers("/api/chips-collection-chips/**").permitAll()
            .antMatchers("/api/chips-admins/**").permitAll()
            .antMatchers("/api/event-star-ratings/**").permitAll()
            .antMatchers("/api/partners/**").permitAll()
            .antMatchers("/api/service-star-ratings/**").permitAll()
            .antMatchers("/api/shop-star-ratings/**").permitAll()
            .antMatchers("/api/product-star-ratings/**").permitAll()
            .antMatchers("/api/events/**").permitAll()
            .antMatchers("/api/tags/**").permitAll()
            .antMatchers("/api/points/**").permitAll()
            .antMatchers("/api/gift-shopping-carts/**").permitAll()
            .antMatchers("/api/properties/**").permitAll()
            .antMatchers("/api/gifts/**").permitAll()
            .antMatchers("/api/contacts/**").permitAll()
            .antMatchers("/api/reservations/**").permitAll()
            .antMatchers("/api/shops/**").permitAll()
            .antMatchers("/api/shop-like-dislikes/**").permitAll()
            .antMatchers("/api/shop-comments/**").permitAll()
            .antMatchers("/api/event-like-dislikes/**").permitAll()
            .antMatchers("/api/event-comments/**").permitAll()
            .antMatchers("/api/product-comments/**").permitAll()
            .antMatchers("/api/product-like-dislikes/**").permitAll()
            .antMatchers("/api/event-service-map-orders/**").permitAll()
            .antMatchers("/api/images/**").permitAll()
            .antMatchers("/api/event-product-ratings/**").permitAll()
            .antMatchers("/api/create-your-event-services/**").permitAll()
            .antMatchers("/api/service-maps/**").permitAll()
            .antMatchers("/api/service-like-dislikes/**").permitAll()
            .antMatchers("/api/service-comments/**").permitAll()
            .antMatchers("/api/service-offers/**").permitAll()
            .antMatchers("/api/worksheets/**").permitAll()
            .antMatchers("/api/products/**").permitAll()
            .antMatchers("/api/event-product-orders/**").permitAll()
            .antMatchers("/api/events/public/active").permitAll()
            .antMatchers("/api/users/**").permitAll()
            .antMatchers("/api/eventratings/**").permitAll()
            .antMatchers("/api/locations/**").permitAll()
            .antMatchers("/api/addresses/**").permitAll()
            .antMatchers("/api/auth-info").permitAll()
            .antMatchers("/api/account").permitAll()
            .antMatchers("/api/admin/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/**").authenticated()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/health/**").permitAll()
            .antMatchers("/management/info").permitAll()
            .antMatchers("/management/prometheus").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .oauth2Login()
        .and()
            .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(authenticationConverter())
                .and()
            .and()
                .oauth2Client();
        // @formatter:on
    }

    Converter<Jwt, AbstractAuthenticationToken> authenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new JwtGrantedAuthorityConverter());
        return jwtAuthenticationConverter;
    }

    /**
     * Map authorities from "groups" or "roles" claim in ID Token.
     *
     * @return a {@link GrantedAuthoritiesMapper} that maps groups from
     * the IdP to Spring Security Authorities.
     */
    @Bean
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return authorities -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

            authorities.forEach(authority -> {
                // Check for OidcUserAuthority because Spring Security 5.2 returns
                // each scope as a GrantedAuthority, which we don't care about.
                if (authority instanceof OidcUserAuthority) {
                    OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                    mappedAuthorities.addAll(SecurityUtils.extractAuthorityFromClaims(oidcUserAuthority.getUserInfo().getClaims()));
                }
            });
            return mappedAuthorities;
        };
    }

    @Bean
    JwtDecoder jwtDecoder(ClientRegistrationRepository clientRegistrationRepository, RestTemplateBuilder restTemplateBuilder) {
        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(jHipsterProperties.getSecurity().getOauth2().getAudience());
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);
        jwtDecoder.setClaimSetConverter(
            new CustomClaimConverter(clientRegistrationRepository.findByRegistrationId("oidc"), restTemplateBuilder.build())
        );

        return jwtDecoder;
    }

    @Bean
    @Scope("prototype")
    public KeycloakRestTemplate keycloakRestTemplate() {
        return new KeycloakRestTemplate(keycloakClientRequestFactory);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(keycloakAuthenticationProvider());
    }

    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }
}
