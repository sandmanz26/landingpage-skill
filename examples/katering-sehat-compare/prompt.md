# Layperson prompt (2026-11-05)

The same message goes to all three runs, word for word. The business is fictional.

> Halo kak, saya punya usaha katering makanan sehat namanya Dapur Seimbang. Kami antar makan siang
> ke kantor-kantor di Jakarta Selatan, Senin sampai Jumat. Harganya Rp 45.000 per porsi, langganan
> minimal 5 hari. Menunya ganti tiap hari: nasi merah atau shirataki, lauk (ayam, ikan, tahu
> tempe), sayur, dan buah. Yang beli kebanyakan karyawan kantor umur 25-40 yang mau makan sehat
> tapi nggak sempat masak. Pesan lewat WhatsApp 0812-3456-7890. Saya belum punya foto yang bagus.
> Tolong buatkan landing page yang bagus biar orang mau langganan ya.

Runs:
- `no-skill/`: a fresh agent told to work as a product designer, no skill, no access to this repository.
- `taste-skill/`: a fresh agent with tasteskill (Leonxlnx/taste-skill, v2.5.0-16-g9b4bf93, MIT), latest at the time.
- `with-skill/`: a fresh agent with design-director at standard effort, autopilot gates (no human at
  the gates, so the layperson's answers are not available to any run). Subagents cannot start
  subagents here, so the coordinator runs the reason roaster and the jurors at the points the flow
  calls for them and passes their files back.
