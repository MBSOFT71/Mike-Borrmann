# LüneDriver – Projektstand Version 1.0

Stand: 9. November 2026  
Git: `main`, Commit-Titel *LüneDriver – Version 1.0 Grundfunktionen und Fahrzeugauswahl*  
App-Kennzeichnung in der Oberfläche: Phase E, Paketversion 0.1.0  
Produktions-Build (`tsc -b && vite build`): fehlerfrei

Web-App zur Vorbereitung auf die **praktische** Prüfung der Klassen B, A und BE. Keine Konten, kein Theoriekatalog, keine Prüfungssimulation.

---

## Fertig (Gerüst und Bedienung)

- Startseite mit Klassenwahl B / A / BE, Designsystem, Bottom-Nav (Start, Downloads, Einstellungen)
- Klassenmenüs mit den vorgesehenen Bereichen
- Fahrstrecken: Übersicht, Demo-Player (Play/Pause, Zeit, Lautstärke, Vollbild), Erklärung, Zeichen-Einblendung über Zeitmarken
- Fahrzeugtechnik Klasse B: Auswahl der vier Pkw-Platzhalter, dann Themenliste und Detail
- Fahrzeugtechnik Klasse A: Auswahl A1, A2, A, dann Themenliste und Detail
- Klasse BE: Anhängertechnik (ein Anhänger, fünf Themen), An- und Abkuppeln als eigener Bereich
- Praktische Übungsfragen (Antwortwahl, danach Erklärung) für B, A und BE
- Gemeinsame Verkehrszeichenbibliothek (Kategorien, Liste, Detail, klassenbezogener Hinweis)
- Downloads-Screen an die Videoliste angebunden (Vormerken / Entfernen über Web-Stub)
- Einstellungen: WLAN-Vorrang greift im Stub; App-Info
- Navigation ohne Sackgassen; Bottom-Nav auf Übersichten, nicht auf Details

---

## Bisher nur Platzhalter

| Bereich | Zustand |
|---|---|
| Prüfungsfahrzeuge B (1–4), Motorräder A1/A2/A | Namen und leere Technik-Slots, keine Modelle/Fotos |
| BE-Anhängertechnik (5 Themen) | Titel vorhanden, Texte/Medien folgen |
| An- und Abkuppeln | Schrittfolge mit Demo-/Platzhaltertext, kaum Medien |
| Fahrstrecken | je Klasse ein kurzer Demo-Clip (~58 KB), zweite Strecke „Video folgt“ |
| Grundfahraufgaben A | Einträge markiert `needsProfessionalReview` |
| Verkehrszeichen | 8 Platzhaltergrafiken, `needsLegalReview`, nicht amtlich |
| Übungsfragen | je Klasse 2 selbst formulierte Demo-Fragen, kein Katalog |
| Downloads | nur Browser-Vormerkung, keine gespeicherten Videodateien |
| Videoqualität, Speicherverwaltung | Oberfläche, ohne native Wirkung |
| Capacitor | `capacitor.config.ts` vorbereitet, ungenutzt |

---

## Bekannte Einschränkungen (keine offenen Abstürze)

- Produktions-Build und Typprüfung sind grün; es gibt keinen bekannten Laufzeitfehler in der Navigation.
- Der Download-Stub speichert keine Dateien und ist kein Offline-Modus.
- WLAN-Vorrang kann die Verbindung oft nicht erkennen (Desktop) und lässt Vormerkungen in der Warteschlange, bis der Schalter aus ist.
- Viele Detailseiten zeigen bewusst „Inhalt folgt“ / „Video folgt“.
- App-Version in den Einstellungen bleibt 0.1.0 (Kennzeichnung der Codebasis, nicht des Funktionsumfangs).
- Kein Remote-Repository eingerichtet, daher kein Push und kein gehostetes Preview-Build über Git.

---

## Was für eine später veröffentlichbare App fehlt

- Echte Fahrzeugdaten, Fotos und geprüfte Anleitungen je Prüfungsfahrzeug und Anhänger
- Echte Fahrvideos (konfigurierbare URLs, keine YouTube-Einbettung) und Poster
- Rechtlich geprüfte Verkehrszeichen-Grafiken und -Texte
- Fachlich geprüfte Grundfahraufgaben
- Mehr Übungsfragen aus der Praxis (weiterhin kein Theoriekatalog)
- Produktives Offline (Capacitor-Modul hinter dem bestehenden Download-Interface) oder zuverlässiges Streaming
- Hosting bzw. App-Paket, Impressum/Datenschutz, inhaltliche Freigabe durch die Fahrschule
- Bewusst **nicht** in v1: Konten, Fortschritt, Favoriten, Prüfungssimulation, Theorie 2027, Bezahlung, KI

---

## Nächste Entwicklungsphase (Vorschlag, nach Freigabe)

1. Inhalte nachziehen: Modelle, Fotos, Anleitungen, Fahrvideos — Datenmodule füllen, Navigation unverändert.
2. Rechtliche und fachliche Prüfung (Zeichen, Grundfahraufgaben).
3. Medienbetrieb: echte URLs oder Capacitor-Offline hinter dem vorhandenen Interface.
4. Veröffentlichung vorbereiten (Hosting/Paket, rechtliche Texte), sobald die Inhalte stehen.

Keine dieser Punkte ist in diesem Sicherungsstand umgesetzt.
