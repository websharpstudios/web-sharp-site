---
layout: page
title: Web(#) Sharp - Services  
subtitle: We are a team of passionate web developers and designers.
permalink: /our-services
---

<section class="services py-5"> 
  <div class="container">
    <h2 class="section-title text-center mb-5">Our Expertise</h2>
    <div class="row"> 
      {% for service in site.data.services %}
      <div class="col-md-6 col-lg-4 mb-4"> 
        <div class="card h-100"> 
          <a href="{{ service.url }}">
            <img src="{{ service.image }}" class="card-img-top" alt="{{ service.title }}"> 
            <div class="card-body">
              <h5 class="card-title">{{ service.title }}</h5>
              <p class="card-text">{{ service.description }}</p>
            </div>
          </a>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>