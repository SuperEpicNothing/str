
# TODO:
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] :sparkles: todo mk II :sparkles: ?
- [ ] [**nauczmy sie tego**](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
- GENERAL:
  - stosować enkodowanie UTF-8
  - [ ] ile PD na lvl na skillpointa
  - [x] nazwy statów - WIEDZA SYstem
  - [ ] end credits scene
- LATER DOWN THE PIPELINE:
  - [x] handleText in HTML
  - [ ] więcej animacj zadweania pytań przez konfuzjusza
  - [ ] confutius sprawdza ile razy pregrałeś i zminia mowę
  - [ ] acheivment for no losses
  - [ ] we hurt confu(abimations)
- ==S: @Shinigami072 
  - [ ] hover nad zamkniętymi rozdziałami
  - [ ] widok inwentarza
    - [ ] trochę niższy, proponuję tak o 1/3
    - [ ] czcionka opisu (prawy panel) mniejsza
	  - [ ] więcej przestrzeni na opis (Description, czyli dolna część prawego panelu), a mniej na "sztywne" dane (górna część prawego panelu, czyli Name, Type, Autor... + ilustracja)
	  - [ ] przetłumaczyć nazwy na polski (Zwoje?; Przedmioty; Nazwa; Typ; Autor; Opis)
  - [x] animacja otrzymywania odznaki?
  - [ ] w menu: określenie "Prędkość" jest mylące, raczej "Czas wyświetlania" (na odwrót)
  - [x] make skip invisible when not in use
  - [x] handleText in HTML
  - [x] move restart button to top corner
  - [ ] Audiohandling
  - [x] mute button top corner
  - [ ] handle image smoothing better
  - [ ] make skills make sense - clean player code
- ==L: @lukaszlamza
  - coś zrobiłem...

Tag|corobi
---|---
`[playerGender]` | wyswietla symbol płci gracza
`[playerGender {male|female}]` | zmaina tekstu w zalożności od płci gracza 
`[playerName]` | Imię gracza
`[playerAge]` | Wiek gracza
`[playerLvl]` | level gracza
`[playerSkill id]`| poziom zdolności `id` gracza 
`[']`| `"`

Event|corobi
---|---
`{"type":"give","time":4600,"item":IDI,"book"":IDB,"xp":xpamt},` | daj graczowi Item `IDI`, książkę `IDB`, `xpamt` Doświadczenia
`{"type":"unlockAch","time":"4200","ach":ID},` | odblokuj osiągnięcie `ID`
`{"type":"change","time":"0","target":ID},`| przeskocz do sceny `ID`
`{"type":"question","time":czasPisaniaWiad,"arm":animacja,"text":pytanie},`| zadaje pytanie z animacją (patrz tabela poniżej)

arm|czas (w ms)
---|---
`"sword"`|`6200`
`"robot"`|`6000`
`"laser"`|`2500`
`"book"`|`2000`

REQ|corobi
---|---
`"req":{"type":"skill","skill":x,"amt":a,"mode":m}`| sprwadza czy zdolność `x` `m` od `a` optional-mode{"<",">"}
`"req":{"type":"item","item":ID}`| sprawdza czy gracz ma przedmiot `ID`
`"req":{"type":"hp","amt":a}`| hp gracza > a tylko Confutest






