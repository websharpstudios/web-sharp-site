---
title: "Web Sharp Studios"
layout: splash
permalink: /index.html
date: 2024-03-23T11:48:41-04:00
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/unsplash-image-1.jpg
  actions:
    - label: "Learn More"
      url: "/terms/"
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
excerpt: "Welcome to Web Sharp Studios, where we create cutting-edge web solutions tailored to your needs."
intro: 
  - excerpt: 'At Web Sharp Studios, we specialize in delivering high-quality web development services that drive success for your business. Our team is dedicated to providing innovative solutions that meet your unique requirements.'
feature_row:
  - image_path: assets/images/unsplash-gallery-image-1-th.jpg
    image_caption: "Image courtesy of [Unsplash](https://unsplash.com/)"
    alt: "Innovative Web Design"
    title: "Innovative Web Design"
    excerpt: "Our designs are not only visually appealing but also user-friendly and optimized for performance."
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "Custom Development"
    title: "Custom Development"
    excerpt: "We offer custom development services to build web applications that align perfectly with your business goals."
    url: "#custom-development"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/unsplash-gallery-image-3-th.jpg
    alt: "SEO Optimization"
    title: "SEO Optimization"
    excerpt: "Our SEO services ensure that your website ranks high on search engines, driving more traffic to your site."
feature_row2:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "E-commerce Solutions"
    title: "E-commerce Solutions"
    excerpt: 'We provide comprehensive e-commerce solutions that help you sell your products online with ease.'
    url: "#ecommerce-solutions"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row3:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "Mobile Responsive"
    title: "Mobile Responsive"
    excerpt: 'Our web designs are mobile responsive, ensuring a seamless experience across all devices.'
    url: "#mobile-responsive"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row4:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "Support & Maintenance"
    title: "Support & Maintenance"
    excerpt: 'We offer ongoing support and maintenance to keep your website running smoothly.'
    url: "#support-maintenance"
    btn_label: "Read More"
    btn_class: "btn--primary"
---

{% capture overlay_img_path %}{{ page.header.overlay_image | relative_url }}{% endcapture %}

{% if page.header.overlay_filter contains "gradient" %}
  {% capture overlay_filter %}{{ page.header.overlay_filter }}{% endcapture %}
{% elsif page.header.overlay_filter contains "rgba" %}
  {% capture overlay_filter %}{{ page.header.overlay_filter }}{% endcapture %}
  {% capture overlay_filter %}linear-gradient({{ overlay_filter }}, {{ overlay_filter }}){% endcapture %}
{% elsif page.header.overlay_filter %}
  {% capture overlay_filter %}rgba(0, 0, 0, {{ page.header.overlay_filter }}){% endcapture %}
  {% capture overlay_filter %}linear-gradient({{ overlay_filter }}, {{ overlay_filter }}){% endcapture %}
{% endif %}

{% if page.header.image_description %}
  {% assign image_description = page.header.image_description %}
{% else %}
  {% assign image_description = page.title %}
{% endif %}

{% assign image_description = image_description | markdownify | strip_html | strip_newlines | escape_once %}

<div class="page__hero{% if page.header.overlay_color or page.header.overlay_image %}--overlay{% endif %}"
  style="{% if page.header.overlay_color %}background-color: {{ page.header.overlay_color | default: 'transparent' }};{% endif %} {% if overlay_img_path %}background-image: {% if overlay_filter %}{{ overlay_filter }}, {% endif %}url('{{ overlay_img_path }}');{% endif %}"
>
  {% if page.header.overlay_color or page.header.overlay_image %}
    <div class="wrapper">
      <h1 id="page-title" class="page__title" itemprop="headline">
        {% if paginator and site.paginate_show_page_num %}
          {{ site.title }}{% unless paginator.page == 1 %} {{ site.data.ui-text[site.locale].page | default: "Page" }} {{ paginator.page }}{% endunless %}
        {% else %}
          {{ page.title | default: site.title | markdownify | remove: "<p>" | remove: "</p>" }}
        {% endif %}
      </h1>
      {% if page.tagline %}
        <p class="page__lead">{{ page.tagline | markdownify | remove: "<p>" | remove: "</p>" }}</p>
      {% elsif page.header.show_overlay_excerpt != false and page.excerpt %}
        <p class="page__lead">{{ page.excerpt | markdownify | remove: "<p>" | remove: "</p>" }}</p>
      {% endif %}
      {% include page__meta.html %}
      {% if page.header.actions %}
        <p>
        {% for action in page.header.actions %}
          <a href="{{ action.url | relative_url }}" class="btn btn--light-outline btn--large">{{ action.label | default: site.data.ui-text[site.locale].more_label | default: "Learn More" }}</a>
        {% endfor %}
        </p>
      {% endif %}
    </div>
  {% else %}
    <img src="{{ page.header.image | relative_url }}" alt="{{ image_description }}" class="page__hero-image">
  {% endif %}
  {% if page.header.caption %}
    <span class="page__hero-caption">{{ page.header.caption | markdownify | remove: "<p>" | remove: "</p>" }}</span>
  {% endif %}
</div>
