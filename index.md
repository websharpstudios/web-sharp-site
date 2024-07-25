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
excerpt: "Bacon ipsum dolor sit amet salami ham hock ham, hamburger corned beef short ribs kielbasa biltong t-bone drumstick tri-tip tail sirloin pork chop."
intro: 
  - excerpt: 'Nullam suscipit et nam, tellus velit pellentesque at malesuada, enim eaque. Quis nulla, netus tempor in diam gravida tincidunt, *proin faucibus* voluptate felis id sollicitudin. Centered with `type="center"`'
feature_row:
  - image_path: assets/images/unsplash-gallery-image-1-th.jpg
    image_caption: "Image courtesy of [Unsplash](https://unsplash.com/)"
    alt: "placeholder image 1"
    title: "Placeholder 1"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder 2"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/unsplash-gallery-image-3-th.jpg
    title: "Placeholder 3"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
feature_row2:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Left Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Left aligned with `type="left"`'
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row3:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Right Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Right aligned with `type="right"`'
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row4:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Center Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Centered with `type="center"`'
    url: "#test-link"
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
