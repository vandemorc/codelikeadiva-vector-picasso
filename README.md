## Wichtige Infos vorab
+ Registriere dich für unsere Dev-Challenge auf deiner Wunschplattform (Xing, eventim oder meetup - näheres dazu unter [http://www.codelikeadiva.de/anmeldung.html](http://www.codelikeadiva.de/anmeldung.html)).
+ Erstelle einen Fork von diesem Repository und arbeite dort im ```develop```-Branch.
+ Damit wir dein Kunstwerk zuordnen können ist es wichtig, dass du die Datei ```src/config.js``` anpasst. Trage dich als Author ein, vergebe einen Titel für dein Kunstwerk und schreibe eine kurze Erklärung wie dieses generiert werden kann.
+ Die Projektbasis ist so aufgebaut, dass du gleich anfangen kannst mit entwickeln.  
Starte einfach in den Dateien ```src/js/my-code/index.js``` / ```src/scss/my-code/style.scss``` und tobe dich kreativ aus.
+ Konzentriere dich bei der Entwicklung auf dein Kunstwerkt. Die Optimierung für Chrome ist völlig ausreichend.
+ Einsendeschluss ist der **01. Dezember 2017**
+ Preisvergabe bei **Snacks** und **gekühlten Getränken** ist am **Donnerstag, 07. Dezember 2017**. Wir freuen uns auf deinen Besuch im Münchner Büro von diva-e.  
Weitere Infos hierzu findest du auch unter [http://www.codelikeadiva.de/aftercodeparty.html](http://www.codelikeadiva.de/aftercodeparty.html)

## Regeln
+ Ziel ist es eine vektor-basierte SVG-Grafik zu generieren und diese in der ```index.html```  innerhalb des ```<div id="artwork-wrapper"/>``` darzustellen.
+ Als Ergebnis muss zusätzlich die favorisierte Darstellung deines Kunstwerkes im Ordner ```./my-artwork``` gesichert sein. Dazu kannst du die eingebaute Exportfunktion nutzen.
+ Dein Code muss sich in einem Fork befinden.
+ Der zentrale Algorithmus zur Generierung deines Kunstwerkes muss selbst geschrieben sein.
+ Libraries zur Unterstützung können verwendet werden.

## Bewertungskriterien
Folgende Kriterien (mit Faktor) fließen in die Bewertung mit ein:
+ Technischer Ansatz der Renderlogik (2x)
+ Programmierstil (Struktur, Aufbau) und Code-Style (1.5x)
+ Kreativität / Kunstfaktor des eingereichten Bildes (1x)

## Projekt Setup
1. Installiere die nötigen Node-Modules.  
```npm i``` || ```yarn``` 
2. Fertig 😉

## Projekt Start
1. ```npm start``` || ```yarn start```
2. Öffne deinen Browser unter ```http://localhost:8080/```

## Einreichen
+ Das Kunstwerk, welches dir am besten gefällt muss von dir exportiert und gesichert werden.  
Lege es dann in den Ordner ```./my-artwork```.
+ **Wenn du die Dev-Challenge einreichen willst, update deinen Fork mit dem letzten Stand und sende uns eine E-Mail mit dem Link zu deinem Fork an [codelikea@diva-e.com](mailto:codelikea@diva-e.com).
Bitte achte hierbei darauf, die selbe E-Mailadresse wie bei deiner Anmeldung zu verwenden bzw. diese zu nennen.**

## Hast du Fragen?
Dann schreib uns einfach eine [E-Mail](mailto:codelikea@diva-e.com)!

## How to export in heigh resolution
The svg has too many layers, so it is not easy to resize it using vector editor app.
Unfortunately js canvas export noticeably decrease the quality.

Easy steps to export without loss of quality:  
1. use hash parameters to render only part of the image (http://localhost:8080/#0,5 == first tile from 5x5)
2. rename the svg using pattern [tile index]-[tile count].svg (e.g. first tile from 5x5 - "00-25.svg", second "01-25.svg", etc)
3. copy svg tiles to src/js/my-code/tools/
4. for 5x5 tiles export open index_by_25.html
5. use <select> to select the tile. Then right-click on the image and "Copy Image"
6. paste it in your favourite photo editor to combine raster parts together.
7. save combined image as png/jpg/...