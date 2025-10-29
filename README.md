# halotukozak.github.io

My portfolio and blog built with Astro and MultiTerm integration.

## 🚀 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/     # Astro components
│   ├── content/        # Content collections (blog posts)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes and pages
│   └── styles/         # Global styles
├── .github/
│   └── workflows/      # GitHub Actions for deployment
└── astro.config.mjs    # Astro configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📝 Adding Blog Posts

To add a new blog post:

1. Create a new `.md` or `.mdx` file in `src/content/blog/`
2. Add frontmatter with title, description, pubDate, and optional heroImage
3. Write your content in Markdown

Example:

```markdown
---
title: 'My New Post'
description: 'This is my new post'
pubDate: 2024-01-30
heroImage: '/blog-placeholder-1.jpg'
---

Your content here...
```

## 🚀 Deployment

This site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

The deployment is handled by GitHub Actions (see `.github/workflows/deploy.yml`).

## 🎨 MultiTerm Integration

This blog is designed to showcase MultiTerm integration and best practices. Check out the blog posts for more information on working with MultiTerm.

## 📄 License

This project is open source and available under the MIT License.

