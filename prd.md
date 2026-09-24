# SHABLLON PRD (Product Requirements Document) — 1 Faqe
**Kursi:** Programimi per Pajisje Mobile (2026/2027) • **Kolegji AAB**  
**Emri i Projektit:** Vexor Growth — Shadow Operating  
**Themeluesi / Ekipi:** Velime Shabani, RE-34849/24  
**Data & Versioni:** Java 02 • Versioni 1.0 (Draft per MVP)

---

## 1. Perdoruesi dhe Problemi Real
- **Kush e perjeton dhimbjen?** Kreatoret e rrjeteve sociale kudo ne bote (Instagram, TikTok, YouTube) me 10k–200k ndjekes, qe kane audience aktive por nuk fitojne te ardhura te qendrueshme prej saj.
- **Kur ndodh?** Pas nje postimi viral (kur audienca pyet "a ke kurs/ebook?" dhe kreatori s'ka asgje per te shitur) dhe kur kreatori kerkon nje agjenci qe ta ndihmoje, por nuk di cilen te zgjedhe dhe si ta kontaktoje.
- **Si e zgjidhin sot?** Provojne vete te krijojne produkte digjitale dhe i braktisin ne gjysme, ose dergojne DM agjencive ne Instagram, ku mesazhet humbasin, pergjigjet vonojne dite te tera dhe informacioni per sherbimet eshte i shperndare.

## 2. Evidenca e Vezhgimit (3 Bisedat me Perdoruesit)
- **Biseda 1 (Kreatore fitness, 45k ndjekes):** *"Çdo jave me pyesin per plan ushqimi, por nuk e di çfare produkti te bej dhe sa ta shes. E di qe po humb para."*
- **Biseda 2 (Kreator edukativ, 120k ndjekes):** *"I shkrova nje agjencie ne DM dhe me ktheu pergjigje pas nje jave. Deri atehere kisha humbur interesin."*
- **Biseda 3 (Kreatore lifestyle, 18k ndjekes):** *"Para se te punoj me dike, dua te di kush jane, çfare mjetesh perdorin dhe si punojne."*

## 3. Hipoteza e Vleres
> **Nese** u ofrojme kreatoreve nje PWA mobile ku marrin falas nje analize me AI me 3 ide produktesh digjitale per audiencen e tyre, shohin sherbimet e Vexor Growth, informacionin "Rreth Nesh" dhe mjetet AI qe perdorim, dhe na kontaktojne me nje formular te thjeshte,  
> **atehere** me shume kreatore do ta kontaktojne agjencine (qellimi: te pakten 10 kerkesa ne muajin e pare), ekipi do te pergjigjet brenda 24 oreve ne vend te diteve, dhe asnje kerkese nuk do te humbase si ndodh me DM-te.

## 4. Rrjedha Kryesore e Perdoruesit (Core Flow — Max 5 Hapa)
1. **Hapja:** Kreatori hap aplikacionin dhe sheh mesazhin e agjencise me butonin "Merr analize falas me AI".
2. **Analiza me AI:** Zgjedh nichen, numrin e ndjekesve, platformen dhe shkruan çfare e pyet me shpesh audienca.
3. **Rezultati:** Merr 3 ide produktesh (ebook, mini-kurs, template) me strukture,qmim te sugjeruar dhe arsyen pse do te shiten.
4. **Kontakti:** Shtyp "Dua ta nderojme bashke" dhe formulari hapet i plotesuar me idete; kreatori shton emrin dhe emailin dhe e dergon.
5. **Pergjigja:** Kerkesa shfaqet menjehere ne panelin e ekipit; ekipi e kontakton kreatorin dhe ndryshon statusin ("E re" → "Kontaktuar" → "Klient").

## 5. Kufijte e MVP-se (Scope Contract)
- **BRENDA MVP-se (Maksimumi 3 funksione):**
  1. Analiza falas me AI (thirrje ne Claude API permes Supabase Edge Function; rezultati ruhet ne databaze).
  2. Formulari i kontaktit me validim (email i sakte,fusha te detyrueshme)qe ruan kerkesen ne Supabase.
  3. Paneli i ekipit ne kohe reale (Supabase Realtime),i mbrojtur me Supabase Auth dhe Row Level Security:vetem administratori i sheh kerkesat.
- **JASHTE MVP-se (Te perjashtuara qellimisht per kete semester):**
  - Zero pagesa brenda aplikacionit (marreveshjet dhe faturimi behen jashte aplikacionit).
  - Zero chat i drejteperdrejte (komunikimi pas kontaktit behet me email ose thirrje).
  - Zero panel per klientet ekzistues per ndjekjen e projekteve (planifikohet per versionin e ardhshem).

## 6. Kriteret e Pranimit (Acceptance Criteria - Çfare testohet)
- [ ] **AC-1:** Kur kreatori shtyp "Gjenero idete", brenda 20 sekondash shfaqen 3 ide me titull, strukture dhe qmim te sugjeruar.
- [ ] **AC-2:** Formulari nuk dergohet nese emaili eshte i pasakte ose mungon emri, dhe shfaqet mesazh gabimi.
- [ ] **AC-3:** Kur kreatori dergon kerkesen,ajo shfaqet menjehere ne panelin e ekipit pa rifreskuar faqen.
- [ ] **AC-4:** Nje perdorues qe nuk eshte administrator nuk mund t'i lexoje kerkesat(testohet me dy llogari).
- [ ] **AC-5:** Aplikacioni instalohet ne ekranin kryesor te telefonit dhe faqet e sherbimeve hapen edhe offline.

## 7. Modeli Minimal i te Dhenave (Supabase PostgreSQL)
```sql
services (id,title,description,sort_order)
ai_analyses (id,niche,platform,followers_range,audience_question,ideas_json,created_at)
leads (id,full_name,email,platform,followers,service,message,analysis_id,status,created_at)
```

## 8. Rreziku Kryesor qe Duhet Testuar
- **Rreziku:** A do te kete kreatori mjaftueshem besim tek nje agjenci e re sa te ploteson formularin e kontaktit pas analizes me AI?
- **Testi ne Javen 2:** 5 kreatore e perdorin analizen me AI.Nese te pakten 3 nga 5 thone se idete jane te dobishme dhe te pakten 2 e plotesojne formularin realisht, hipoteza e besimit konsiderohet e validuar.