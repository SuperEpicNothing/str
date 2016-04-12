
# TODO:
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] todo mk II?
- [ ] [**nauczmy sie tego**](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
- GENERAL:
  - stosować enkodowanie UTF-8
  - [ ] ile PD na lvl na skillpointa
  - [ ] nazwy statów
  - [ ] end credits scene
- LATER DOWN THE PIPELINE:
  - [ ] handleText in HTML
  - [ ] więcej animacj zadweania pytań przez konfuzjusza
  - [ ] confutius sprawdza ile razy pregrałeś i zminia mowę
  - [ ] acheivment for no losses
  - [ ] we hurt confu(abimations)
- ==S:
  - [ ] hover nad zamkniętymi rozdziałami
  - [ ] widok inwentarza
    - [ ] trochę niższy, proponuję tak o 1/3
    - [ ] czcionka opisu (prawy panel) mniejsza
	  - [ ] więcej przestrzeni na opis (Description, czyli dolna część prawego panelu), a mniej na "sztywne" dane (górna część prawego panelu, czyli Name, Type, Autor... + ilustracja)
	  - [ ] przetłumaczyć nazwy na polski (Zwoje?; Przedmioty; Nazwa; Typ; Autor; Opis)
  - [ ] animacja otrzymywania odznaki?
  - [ ] w menu: określenie "Prędkość" jest mylące, raczej "Czas wyświetlania" (na odwrót)
  - [ ] make skip invisible when not in use
  - [x] handleText in HTML
  - [ ] move restart button to top corner
  - [ ] mute button top corner
  - [ ] handle image smoothing better
- ==L:
  - coś zrobiłem...

# Tags: 
 * [playerGender] [playerGender {male|female}] - gendered 
 * [playerName] - imie gracza
 * [playerAge] - wiek gracza
 * [playerLvl] - level gracza
 * [playerSkill id] -  skill level
 * ['] "

# Event:
* {"type":"give","time":4600,"item":"001","book"":"ID","xp":2} - give item andor book andor xp 
* {"type":"unlockAch","time":"4200","ach":id}, - unlock Achievment
* {"type":"change","time":"0","target":id}, - jump to scene id

# REQ:
* "req":{"type":"skill","skill":4,"amt":3,"mode":"<"} optional-mode{"<",">"}
* "req":{"type":"item","item":"ID"}
* "req":{"type":"hp","amt":"a"} hp gracza > a tylko Confutest

# Question animations:
* "sword" - 6200
* "robot" - 6000
* "laser" - 2500
* "book" - 2000
* {"type":"question","time":czasPisaniaWiad,"arm":animacja,"text":pytanie}



