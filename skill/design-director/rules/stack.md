# Stack and component library

The one home for what the work is built with. The brief records it (`- Stack:` in
`modes/create.md` step 1); an existing project keeps its own (`modes/improve.md` → Map, don't
replace: no framework or styling-library migration).

## Admin panels, dashboards, back offices: shadcn/ui until the user agrees otherwise

Owner, 2026-11-07. When the user asks for an admin panel, a dashboard or a back office (screens
people work in: `modes/app-screen.md`) and no design system or component library has been agreed,
build it with **shadcn/ui (React + Tailwind)** until the user approves something else.

- **Why:** consistent, accessible components (Radix underneath: keyboard, focus, ARIA), fast to
  build tables, forms, dialogs and menus, and easy to restyle with tokens (CSS variables in the
  Tailwind theme), so the brand and the dials still apply.
- **Say it to the user** in the brief message, in the four-part form
  (`rules/brief-interview.md` → How every question is asked): "Untuk panel admin saya pakai
  komponen shadcn/ui (React + Tailwind) kecuali Anda sudah punya design system. Ini menentukan
  tampilan tombol, tabel, form dan dialog. Contoh: tabel pesanan dengan filter dan menu aksi per
  baris, seperti dasbor Vercel atau Linear. Rekomendasi: shadcn/ui, karena konsisten, mudah diakses
  keyboard, cepat dibangun dan warnanya bisa diganti lewat token. Atau percayakan ke AI."
  "Percayakan ke AI" keeps shadcn/ui.
- **Not this rule:** the project already has a library or design system (use it: `modes/improve.md`),
  or the user names one (use theirs). A landing page *for* a dashboard product is a page, not an
  admin panel: this rule does not apply.

The brief records it on one line:

```markdown
- Component library: shadcn/ui (React + Tailwind), default: none agreed; told the user
- Component library: MUI (the user's design system, agreed 2026-11-07)
```

`progress.mjs done brief` refuses a brief whose `What:` line asks for an admin panel, dashboard or
back office without a `Component library:` line, and refuses a default that is not shadcn/ui
(another library needs the user's agreement on that line). A default is written to
`.design/decisions.log` by `done brief` itself (`component-library default: shadcn/ui …`), so it
can be revisited when the user answers.
