---
layout: page
permalink: /repositories/
title: 저장소
description: 논문·프로젝트와 연결된 GitHub 저장소
nav: true
nav_order: 6
---

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
