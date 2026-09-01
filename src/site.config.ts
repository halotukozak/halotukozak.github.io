import type {SiteConfig} from '~/types'

const config: SiteConfig = {
    // Absolute URL to the root of your published site, used for generating links and sitemaps.
    site: 'https://halotukozak.com',
    // The name of your site, used in the title and for SEO.
    title: 'halotukozak',
    // The description of your site, used for SEO and RSS feed.
    description: 'Scala Software Engineer in an affair with Kotlin',
    // The author of the site, used in the footer, SEO, and RSS feed.
    author: 'Bartłomiej Kozak',
    // Keywords for SEO, used in the meta tags.
    tags: ['scala', 'kozak', 'kotlin', 'jvm', 'macro'],
    // Path to the image used for generating social media previews.
    // Needs to be a square JPEG file due to limitations of the social card generator.
    // Try https://squoosh.app/ to easily convert images to JPEG.
    socialCardAvatarImage: './src/content/avatar.jpeg',
    // Font imported from @fontsource or elsewhere, used for the entire site.
    // To change this see src/styles/global.css and import a different font.
    font: 'JetBrains Mono Variable',
    // For pagination, the number of posts to display per page.
    // The homepage will display half this number in the "Latest Posts" section.
    pageSize: 6,
    // Whether Astro should resolve trailing slashes in URLs or not.
    // This value is used in the astro.config.mjs file and in the "Search" component to make sure pagefind links match this setting.
    // It is not recommended to change this, since most links existing in the site currently do not have trailing slashes.
    trailingSlashes: false,
    // The navigation links to display in the header.
    navLinks: [
        {
            name: 'Home',
            url: '/',
        },
        {
            name: 'About me',
            url: '/about',
        },
        {
            name: 'Projects',
            url: '/#projects',
        },
        {
            name: 'Posts',
            url: '/posts',
        },
        {
            name: 'GitHub',
            url: 'https://github.com/halotukozak',
            external: true,
        },
    ],
    // The theming configuration for the site.
    themes: {
        // The theming mode. One of "single" | "select" | "light-dark-auto".
        mode: 'light-dark-auto',
        // The default theme identifier, used when themeMode is "select" or "light-dark-auto".
        // Make sure this is one of the themes listed in `themes` or "auto" for "light-dark-auto" mode.
        default: 'dark-plus',
        // Shiki themes to bundle with the site.
        // https://expressive-code.com/guides/themes/#using-bundled-themes
        // These will be used to theme the entire site along with syntax highlighting.
        // To use light-dark-auto mode, only include a light and a dark theme in that order.
        // include: [
        //   'github-light',
        //   'github-dark',
        // ]
        include: ['light-plus', 'dark-plus'],
        // Optional overrides for specific themes to customize colors.
        // Their values can be either a literal color (hex, rgb, hsl) or another theme key.
        // See themeKeys list in src/types.ts for available keys to override and reference.
        overrides: {
            // Improve readability for aurora-x theme
            // 'aurora-x': {
            //   background: '#292929FF',
            //   foreground: '#DDDDDDFF',
            //   warning: '#FF7876FF',
            //   important: '#FF98FFFF',
            //   note: '#83AEFFFF',
            // },
            // Make the GitHub dark theme a little cuter
            // 'github-light': {
            //   accent: 'magenta',
            //   heading1: 'magenta',
            //   heading2: 'magenta',
            //   heading3: 'magenta',
            //   heading4: 'magenta',
            //   heading5: 'magenta',
            //   heading6: 'magenta',
            //   separator: 'magenta',
            //   link: 'list',
            // },
        },
    },
    // Social links to display in the footer.
    socialLinks: {
        github: 'https://github.com/halotukozak',
        email: 'mailto:bartlomiejkozak@proton.me',
        linkedin: 'https://www.linkedin.com/in/halotukozak/',
        rss: true, // Set to true to include an RSS feed link in the footer
    },
    // Configuration for Giscus comments.
    // To set up Giscus, follow the instructions at https://giscus.app/
    // You'll need a GitHub repository with discussions enabled and the Giscus app installed.
    // Take the values from the generated script tag at https://giscus.app and fill them in here.
    // IMPORTANT: Update giscus.json in the root of the project with your own website URL
    // If you don't want to use Giscus, set this to undefined.
    giscus: {
        repo: 'halotukozak/halotukozak.github.io',
        repoId: 'R_kgDOQLddvg',
        category: 'General',
        categoryId: 'DIC_kwDOQLddvs4CxOEV',
        reactionsEnabled: true, // Enable reactions on post itself
    },
    // These are characters available for the character chat feature.
    // To add your own character, add an image file to the top-level `/public` directory
    // Make sure to compress the image to a web-friendly size (<100kb)
    // Try using the excellent https://squoosh.app web app for creating small webp files
    characters: {
        owl: '/owl.webp',
        unicorn: '/unicorn.webp',
        duck: '/duck.webp',
    },
    // Projects displayed in the "Projects" section on the homepage.
    // description is curated here (GitHub's "About" text tends to be inconsistent length and
    // isn't always written for a small card) — kept roughly equal in length across projects so the
    // cards line up evenly. url (docs microsite) and language are still fetched live from the
    // GitHub API at build time — see ProjectsSection.astro.
    projects: [
        {
            name: 'M&DE',
            description:
                'Scala 3 macro library extending Mirror derivation with annotation metadata, default values, and transparent wrappers.',
            repo: 'https://github.com/halotukozak-com/made',
        },
        {
            name: 'Alpaca',
            description:
                'Type-safe lexer and parser library for Scala 3, featuring compile-time validation and a pattern-matching DSL for grammars.',
            repo: 'https://github.com/halotukozak-com/alpaca',
        },
        {
            name: 'mcodec',
            description:
                'Format-agnostic, streaming serialization library for Scala 3, built on M&DE with derived type class encoders and decoders.',
            repo: 'https://github.com/halotukozak-com/mcodec',
        },
        {
            name: 'sure',
            description:
                'Type-safe value validation DSL for Kotlin Multiplatform, catching invalid state at compile time instead of at runtime.',
            repo: 'https://github.com/halotukozak-com/sure',
        },
        {
            name: 'justworks',
            description:
                'Gradle plugin that just works, generating type-safe Kotlin Ktor clients straight from OpenAPI specifications.',
            repo: 'https://github.com/AVSystem/justworks',
        },
        // {
        //     name: 'mrpc',
        //     description:
        //         'AVSystem/commons-style RPC framework for Scala 3, built on top of Made and mcodec for wire serialization.',
        //     repo: 'https://github.com/halotukozak-com/mrpc',
        // },
    ],
}

export default config
