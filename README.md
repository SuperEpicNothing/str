
# TODO:
- [ ] [**nauczmy sie tego**](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
- GENERAL:
  - stosować enkodowanie UTF-8
  - [ ] end credits scene
- LATER DOWN THE PIPELINE:
  - [ ] acheivment for no losses
- ==S: @Shinigami072
  - [x] ODBLOKOWYWANIE POJEDYŃCZYCH LEKCJI;
  - [x] UNLOCK EVENT;
  - [x] confuWin
  - [ ] Rework XP as instructed
  - [x] TEACHER MODE

  - [ ] animacje konfuzjusza
  - [ ] we hurt confu(abimations)
  - [ ] więcej animacj zadweania pytań przez konfuzjusza]
  
  - [x] nazwy statów - WIEDZA SYstem
  - [x] handleText in HTML
  - [X] make everything scalable
  - [x] hover nad zamkniętymi rozdziałami
  - [x] widok inwentarza
    - [x] trochę niższy, proponuję tak o 1/3
    - [x] czcionka opisu (prawy panel) mniejsza
	- [x] więcej przestrzeni na opis (Description, czyli dolna część prawego panelu), a mniej na "sztywne" dane (górna część prawego panelu, czyli Name, Type, Autor... + ilustracja)
	- [x] przetłumaczyć nazwy na polski (Zwoje?; Przedmioty; Nazwa; Typ; Autor; Opis)
  - [x] animacja otrzymywania odznaki?
  - [x] w menu: określenie "Prędkość" jest mylące, raczej "Czas wyświetlania" (na odwrót)
  - [x] character creation:
  - [x] make skip invisible when not in use
  - [x] handleText in HTML
  - [x] move restart button to top corner
  - [x] Audiohandling
  - [x] mute button top corner
  - [X] handle image smoothing better
  - [x] make skills make sense - clean player code
  - [x] fix broken inventory 
- ==L: @lukaszlamza
  - [ ] list of all Arguments, Achievements, Items
  - [ ] ile PD na lvl na skillpointa???????????
  - [ ] apply some animations for Konfutest
  - [x] apply class="texthandler" wherever needed
  - [x] add more item types into assets.json
  - [ ] help.html
  


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
`{"type":"unlockChap","time":"0","chapter":IDC,"lesson":IDL},` | odblokuj lekcję `IDL`["test" dla konfucjusza] w rozdziale `IDC`
`{"type":"change","time":"0","target":ID},`| przeskocz do sceny `ID`
`{"type":"question","time":czasPisaniaWiad,"arm":animacja,"text":pytanie},`| zadaje pytanie z animacją (patrz tabela poniżej)
`{"type":"resolve","time":trzebadobraćdokonkretprzyp,"arm":animacja,"player":"Argument Mocy i Zniszczenia","success":true},` | na początku bloku kolejnego pytania

arm|czas (w ms)(to be reevaluated)
---|---
`"sword"`|`6200`
`"robot"`|`6000`
`"laser"`|`2500`
`"book"`|`2000`

player|czas (w ms)(to be made)
---|---
`"none"`|`0`
`"cokolwiek"`|`~~5000`


REQ|corobi
---|---
`"req":{"type":"skill","skill":x,"amt":a,"mode":m}`| sprwadza czy zdolność `x` `m` od `a` optional-mode{"<",">"}
`"req":{"type":"item","item":ID}`| sprawdza czy gracz ma przedmiot `ID`
`"req":{"type":"hp","amt":a}`| hp gracza > a tylko Confutest

ItemColors|color
---|---
`"color":{"active":"#3a96c6","inactive":"#0a5074"},`|<a link="#0a5074" alink="#3a96c6">blue DEFAULT</a>
`"color":{"active":"#39c680","inactive":"#33b273"},`|<a link="#33b273" alink="#39c680">green</a>
`"color":{"active":"#c7c738","inactive":"#b3b333"},`|<a link="#b3b333" alink="#c7c738">yellow</a>
`"color":{"active":"#c73838","inactive":"#b33333"},`|<a link="#b33333" alink="#c73838">orange</a>






