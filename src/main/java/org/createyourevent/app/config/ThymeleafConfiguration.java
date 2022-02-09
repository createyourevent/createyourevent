package org.createyourevent.app.config;

import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Configuration
public class ThymeleafConfiguration {


  @Bean
  public ClassLoaderTemplateResolver emailTemplateResolver(){
    ClassLoaderTemplateResolver emailTemplateResolver=new ClassLoaderTemplateResolver();
    emailTemplateResolver.setPrefix("templates/");
    emailTemplateResolver.setTemplateMode("HTML5");
    emailTemplateResolver.setSuffix(".html");
    emailTemplateResolver.setTemplateMode("XHTML");
    emailTemplateResolver.setCharacterEncoding("UTF-8");
    emailTemplateResolver.setOrder(1);
    return emailTemplateResolver;
  }

  @Bean
  public SpringTemplateEngine springTemplateEngine() {
      SpringTemplateEngine templateEngine = new SpringTemplateEngine();
      templateEngine.addTemplateResolver(htmlTemplateResolver());
      return templateEngine;
  }
  @Bean
  public SpringResourceTemplateResolver htmlTemplateResolver(){
      SpringResourceTemplateResolver emailTemplateResolver = new SpringResourceTemplateResolver();
      emailTemplateResolver.setPrefix("classpath:templates/");
      emailTemplateResolver.setSuffix(".html");
      emailTemplateResolver.setTemplateMode(TemplateMode.HTML);
      emailTemplateResolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
      return emailTemplateResolver;
  }
}
