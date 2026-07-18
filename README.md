# Anran Zhou Portfolio

Static source for [www.anranzhou.com](https://www.anranzhou.com/), hosted with
GitHub Pages from [`Anran1015/Anran1015.github.io`](https://github.com/Anran1015/Anran1015.github.io).

The site is a dependency-free HTML, CSS, and JavaScript migration of the
original Squarespace portfolio. All portfolio pages, images, animations,
documents, and locally owned video files are stored in this repository. No
Squarespace service is required at runtime. A few projects intentionally retain
their original third-party embeds, including Vimeo, YouTube, Figma, Adobe XD,
Google Slides, and Flipsnack.

## Local preview

Run a static server from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Structure

- `index.html` and route directories contain the static portfolio pages.
- `assets/` contains shared styles, JavaScript, fonts, images, videos, and PDFs.
- `sketch_171115b/` contains the original p5.js artwork used on the homepage.
- `404.html`, `sitemap.xml`, and `robots.txt` support discovery and navigation.
- `CNAME` configures the `www.anranzhou.com` custom domain.
- `.nojekyll` tells GitHub Pages to publish the files without Jekyll processing.

## GitHub Pages and DNS

Publish from the `master` branch and repository root in **Settings → Pages**,
then set the custom domain to `www.anranzhou.com`. At the DNS provider:

- Replace the apex-domain Squarespace records with GitHub Pages A records:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and
  `185.199.111.153`.
- Replace the `www` CNAME with `Anran1015.github.io`.
- Enable **Enforce HTTPS** after GitHub finishes issuing the certificate.

DNS changes can take up to 24 hours to propagate.
