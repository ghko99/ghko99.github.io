---
layout: page
title: 프로젝트
permalink: /projects/
description: 논문과 프로젝트 13건. 카드를 누르면 개요와 단계별 문제 해결 과정(고민 → 해결)이 열립니다.
nav: true
nav_order: 3
display_categories: [프로젝트, 논문]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endfor %}
{% endif %}
</div>
