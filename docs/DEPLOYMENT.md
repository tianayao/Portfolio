# Deployment: GitHub Pages and tinana.co.uk

This project is prepared for a root deployment from the `main` branch of `tianayao/Portfolio`. The repository root contains `index.html`, `.nojekyll`, and `CNAME`.

No live GitHub Pages or Wix DNS setting is changed by this document. DNS values and provider interfaces can change; verify them at action time.

## 1. Verify the release locally

From the repository root:

```bash
python3 -m http.server 4173
python3 -m unittest discover -s tests -p 'test_*.py' -v
git diff --check
```

Open the homepage and `tests/test.html`. Confirm that the test page has zero failures and no browser warning/error logs.

## 2. Publish the repository

Upload the production source to `https://github.com/tianayao/Portfolio` on `main`. The required public runtime is:

- `index.html`
- `.nojekyll`
- `CNAME`
- `assets/`

Keep `README.md`, `docs/`, and `tests/` in the repository for maintainability. The `.superpowers/` implementation ledger and recovered `references/` files are not runtime dependencies and do not need to be published.

## 3. Enable GitHub Pages from the repository root

In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main`, choose `/(root)`, and save.

Wait for the Pages deployment to finish and verify the generated `tianayao.github.io/Portfolio/` URL before changing DNS. Repository Pages documentation: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 4. Add the custom domain in GitHub first

The root `CNAME` file contains:

```text
tinana.co.uk
```

In **Settings → Pages → Custom domain**, enter `tinana.co.uk` and save before editing Wix DNS. This order lets GitHub prepare the domain association and reduces takeover/misconfiguration risk.

Follow [GitHub’s current documentation for managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Copy the current apex A/AAAA values and the recommended `www` CNAME target from that page at the time of deployment; do not rely on old copied DNS values.

## 5. Update DNS in Wix

The domain was purchased through Wix, so manage its DNS in the Wix account:

1. Open **Domains** and choose `tinana.co.uk`.
2. Open **Domain Actions → Manage DNS Records**.
3. For the apex/root domain, add the A records currently published by GitHub. Wix represents the apex with a blank host name (or the interface’s root-domain convention).
4. If using GitHub’s current IPv6 guidance, add the documented AAAA records.
5. Add the recommended `www` CNAME target from GitHub’s current documentation so both `tinana.co.uk` and `www.tinana.co.uk` resolve consistently.
6. Remove only records that directly conflict with the new GitHub Pages records; do not remove unrelated mail or verification records.
7. Save the DNS changes.

Wix reference: [Managing DNS records in your Wix account](https://support.wix.com/en/article/managing-dns-records-in-your-wix-account).

## 6. Verify DNS and HTTPS

After propagation, check:

```bash
dig tinana.co.uk A
dig tinana.co.uk AAAA
dig www.tinana.co.uk CNAME
```

Then verify the Pages status in GitHub and load both `https://tinana.co.uk` and `https://www.tinana.co.uk`. DNS and the GitHub TLS certificate can take time to propagate. Enable **Enforce HTTPS** in Pages once GitHub makes the control available.

If GitHub reports a domain or certificate error, compare the live records with GitHub’s current documentation rather than adding guessed records.

## Illustrative-content release gate

Before presenting the site as a real portfolio, replace bracketed biography/contact fields and illustrative project media. Keep the illustrative labels until every statement about role, research, outcomes, or metrics is supported by your actual evidence.
