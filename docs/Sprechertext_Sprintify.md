# Sprechertext — Sprintify-Diplompräsentation

**Ziel-Dauer:** 45–60 Min (Pflicht laut Leitfaden). Dieser Text ergibt ~40 Min reines Sprechen; mit Pausen, Zeigen an Diagrammen/Screenshots und natürlicher Ausführung landest du realistisch bei ~45–52 Min.

**Tipp:** Bei den Screenshot-Folien (24–35) hast du am meisten Spielraum, live zu ergänzen, falls du Zeit brauchst. Mit Stoppuhr proben!

**Grobe Zeiteinteilung:** Einstieg & Kontext (1–7) ~10 Min · Vorgehen & KI (8–9) ~4 Min · Architektur/Technik (10–15) ~9 Min · Module & Prozess (16–22) ~9 Min · Demo (23–35) ~9 Min · Würdigung/Reflexion/Wirtschaftlichkeit/Empfehlung (36–40) ~8 Min

---

## Folie 1 — 

Guten Tag zusammen. Mein Name ist Timo Haldi, ich arbeite als Cloud Engineer bei der Netcloud AG, und ich freue mich, Ihnen heute meine Diplomarbeit vorzustellen. Es geht um Sprintify – ein Web-Tool für die Sprint-Kapazitätsplanung, das ich im Rahmen dieser Arbeit für meine Abteilung entwickelt habe. Ich werde Ihnen in den nächsten rund fünfzig Minuten zeigen, welches Problem ich gelöst habe, wie ich dabei vorgegangen bin, was am Ende herausgekommen ist – und ich werde die Arbeit auch kritisch einordnen. Fragen beantworte ich gerne im Anschluss; Sie dürfen sich gerne schon während der Präsentation Notizen machen.

## Folie 2 — Sprintify

Der vollständige Titel meiner Arbeit lautet: «Sprintify – Entwicklung eines Capacity-Planning-Tools mit Jira-Integration». Lassen Sie mich das gleich zu Beginn in einem Satz auf den Punkt bringen, denn dieser Satz zieht sich wie ein roter Faden durch die ganze Präsentation: Sprintify beantwortet die Frage, wie viele Story Points ein Scrum-Team im nächsten Sprint realistisch schaffen kann – und zwar datenbasiert, statt aus dem Bauch heraus. Diese eine Frage klingt banal, aber sie zuverlässig zu beantworten, war in unserem Alltag überraschend schwierig. Betreut wurde die Arbeit von meinem Coach Ardin Ibraimi, bei dem ich mich für die Begleitung herzlich bedanke.

## Folie 3 — Agenda

Zum Ablauf, damit Sie wissen, was Sie erwartet. Ich starte mit meinem beruflichen Kontext, also wer ich bin und in welchem Umfeld die Arbeit entstanden ist. Danach schildere ich die Problemstellung und den konkreten Auftrag, den ich von meinem Arbeitgeber erhalten habe. Anschliessend zeige ich mein methodisches Vorgehen – inklusive eines Themas, das mir wichtig ist, nämlich der Einsatz von künstlicher Intelligenz als Co-Engineer. Im Hauptteil geht es dann um Architektur, Technologieentscheidungen und die einzelnen Module, und ich zeige Ihnen die fertige Anwendung anhand von Screenshots. Zum Schluss folgen die kritische Würdigung, meine persönliche Reflexion, eine kurze Betrachtung der Wirtschaftlichkeit und meine Empfehlung. Beginnen wir mit dem Kontext.

## Folie 4 — Vorstellung und Kontext

Zunächst zu mir und meinem Umfeld, weil das die Ausgangslage der ganzen Arbeit erklärt. Ich arbeite als Cloud Engineer bei der Netcloud AG, einem Schweizer IT-Dienstleister mit Fokus auf Cloud-Infrastruktur und Managed Services. In der Abteilung Public Cloud Solutions betreuen wir Kundenprojekte rund um Microsoft Azure. Unser Team arbeitet nach Scrum, in zweiwöchigen Sprints. Ein Punkt ist für dieses Projekt besonders wichtig, und ich komme später mehrfach darauf zurück: Weil wir für verschiedene Kunden aus verschiedenen Branchen arbeiten, haben wir es mit ganz unterschiedlichen Jira-Setups zu tun – jeder Kunde konfiguriert sein Jira anders. Diese Heterogenität ist am Ende zur grössten technischen Herausforderung geworden. Für die Arbeit selbst ist relevant: Ich habe hier sowohl die Rolle des Projektleiters als auch die des alleinigen Entwicklers übernommen, das heisst, alle Entscheidungen und die gesamte Umsetzung lagen bei mir.

## Folie 5 — Problemstellung

Kommen wir zum eigentlichen Problem. Unsere Sprint-Planung lief bisher zweigeteilt: Die Sprints selbst und die User Stories verwalteten wir in Jira, die Kapazitätsplanung dagegen in Excel-Tabellen, verstreut über verschiedene SharePoint-Ordner. Das hat funktioniert, aber ehrlich gesagt nur knapp. Drei Dinge fehlten uns systematisch. Erstens: Historische Velocity-Daten lagen nirgends aufbereitet vor – wenn man wissen wollte, wie viel das Team in den letzten Sprints tatsächlich geschafft hat, musste man das mühsam zusammensuchen. Zweitens: Die individuelle Kapazität – also Ferien, Teilzeitpensen, interne Projekte – floss nur informell in die Planung ein, meist im Kopf des Scrum Masters. Und drittens, als Konsequenz daraus: Wenn im Planning die Frage kam, wie viele Story Points wir realistisch schaffen, konnte das niemand datenbasiert beantworten. Man hat sich die Antwort mehr oder weniger zusammengereimt. Die Folgen waren spürbar: Wir haben regelmässig zu viel oder zu wenig eingeplant, dadurch Sprint-Ziele verfehlt, und es entstand unnötiger Abstimmungsaufwand. Genau hier setzt Sprintify an.

## Folie 6 — Auftrag

Aus diesem Problem ergab sich mein konkreter Auftrag, und der bestand aus fünf Punkten. Erstens: Sprintify soll Sprints, User Stories und Teammitglieder automatisch aus Jira übernehmen – niemand soll Daten doppelt pflegen. Zweitens: eine Kapazitätsplanung pro Person und Sprint, und zwar wochenweise, weil ein zweiwöchiger Sprint eben aus zwei Wochen mit möglicherweise unterschiedlicher Verfügbarkeit besteht. Drittens: Sprint Analytics mit Burndown-Chart, Velocity-Verlauf und dem Nachverfolgen von Scope-Änderungen. Viertens – und das ist der eigentliche Kern und das Neue an der Lösung: eine Story-Point-Empfehlung, die die historische Velocity mit der aktuell verfügbaren Kapazität kombiniert. Und fünftens eine rollenbasierte Zugriffskontrolle, damit klar ist, wer was darf. Die Rahmenbedingungen waren: Deployment in der Azure-Cloud, Umsetzung als Ein-Mann-Projekt, und ein Zeitrahmen von rund acht Monaten.

## Folie 7 — Marktanalyse

Bevor ich selbst etwas gebaut habe, habe ich den Markt evaluiert – denn eine eigene Entwicklung muss man rechtfertigen, wenn es fertige Produkte gibt. Ich habe drei etablierte Tools genauer angeschaut. Tempo Timesheets ist ein sehr verbreitetes Jira-Plugin, stark in der Zeiterfassung – aber es bietet keine wochenbasierte, vorausschauende Kapazitätsplanung. Jira Advanced Roadmaps, Teil von Jira Premium, kann Portfolio- und Roadmap-Planung, ist aber vergleichsweise teuer, komplex in der Einrichtung, und hat keine Team-Kapazitätsansicht in der Form, die wir brauchten. Und Forecast.app deckt klassische Projekt- und Ressourcenplanung ab, hat aber keine direkte Jira-Synchronisation und keine Story-Point-Empfehlung. Preislich bewegen sich diese Tools je nach Modell zwischen etwa zehn und sechzehn Franken pro Benutzer und Monat, was für ein kleines Team schnell ins Gewicht fällt. Mein Fazit aus der Evaluation: Jedes dieser Tools deckt einen Teilbereich gut ab, aber keines verbindet wochenbasierte Kapazitätsplanung, automatische Jira-Synchronisation und Sprint Analytics in einer einzigen Oberfläche. Genau diese Lücke wollte ich schliessen – und das war für mich die Rechtfertigung für eine Eigenentwicklung.

## Folie 8 — Vorgehen

Zum methodischen Vorgehen. Ich habe mich für ein iteratives Vorgehen in Anlehnung an Scrum entschieden – was naheliegend ist, wenn man ein Werkzeug für Scrum-Teams baut. Als Ein-Mann-Projekt habe ich das Framework aber bewusst vereinfacht: zweiwöchige Iterationen mit klar definierten Zielen, und nach jeder Iteration eine Besprechung der Ergebnisse mit meinem Vorgesetzten als Auftraggeber. Diese regelmässige Rückkopplung hat die Rolle des Reviews übernommen, die man als Solo-Entwickler sonst nicht hat. Das Projekt lief in vier Phasen über rund acht Monate: In der ersten Phase Analyse und Konzeption, dann die Backend-Entwicklung, danach das Frontend, und schliesslich Integration und Deployment. Warum iterativ und nicht klassisch nach Plan? Weil sich meine Anforderungen im Verlauf tatsächlich mehrfach geändert haben – vor allem bei der Jira-Integration. Vieles zeigt sich dort erst, wenn man mit echten Daten arbeitet. Ein starres Wasserfall-Vorgehen hätte diese Änderungen nicht aufgefangen. Das deckt sich auch mit dem Grundgedanken von Scrum, der empirischen Prozesssteuerung: Transparenz schaffen, regelmässig inspizieren, und dann anpassen.

## Folie 9 — KI als Co-Engineer

Ein Thema, das mir wichtig ist und das ich transparent machen möchte, ist der Einsatz von künstlicher Intelligenz. Ich habe für dieses Projekt Claude Code von Anthropic als KI-gestützten Co-Engineer eingesetzt. Wichtig ist mir die Abgrenzung, was die KI gemacht hat und was nicht. Eingesetzt habe ich sie für wiederkehrende Code-Teile, für das initiale Aufsetzen von Komponenten und für Dokumentationsentwürfe. Was ausdrücklich bei mir lag: die Architektur, das Datenmodell, das Sicherheitskonzept und sämtliche Designentscheidungen. Mein Arbeitszyklus war dabei immer derselbe, sechs Schritte: Ich formuliere die Anforderung präzise, stelle den Kontext und die Architektur bereit, lasse einen Vorschlag generieren – und dann kommt der entscheidende Teil: Code-Review Zeile für Zeile, manuelles Anpassen und Verifizieren gegen echte Daten. Von diesen sechs Schritten ist nur einer, das Generieren, die eigentliche Beschleunigung durch die KI; die restlichen fünf sind meine Eigenleistung. Mein fachlicher Hintergrund war die Voraussetzung dafür, Vorschläge überhaupt beurteilen, anpassen oder verwerfen zu können. Das vollständige Chat-Protokoll und meine Reflexion dazu finden Sie in den Anhängen E und F – ich habe das bewusst lückenlos dokumentiert, weil Nachvollziehbarkeit hier für mich zentral ist.

## Folie 10 — Architektur

Damit komme ich zum technischen Teil und beginne mit der Architektur – also der grundlegenden Struktur der Anwendung.

## Folie 11 — Architekturübersicht

Sprintify folgt einer klassischen Drei-Schichten-Architektur: Präsentation, Logik und Datenhaltung sind sauber getrennt. Das Frontend ist eine Single-Page-Application auf Basis von React 19, geschrieben in TypeScript, gebaut mit Vite und gestylt mit Tailwind CSS. Das Backend läuft auf Node.js mit dem Framework Express und nutzt Sequelize als objektrelationalen Mapper. Die API ist in zehn Route-Module aufgeteilt, dazu kommt ein Middleware-Stack für Authentifizierung und Sicherheit. Als Datenbank kommt PostgreSQL zum Einsatz, betrieben als Managed-Dienst in Azure. Lassen Sie mich die zwei wichtigsten Technologieentscheidungen begründen. Node.js habe ich gewählt, weil ich bereits fundierte Erfahrung mit JavaScript und TypeScript hatte und weil das ereignisgesteuerte, nicht-blockierende I/O-Modell hervorragend zur Jira-Anbindung passt – dort fallen sehr viele parallele HTTP-Calls an, und genau das kann Node effizient. PostgreSQL war naheliegend, weil unsere Datenstruktur klar relational ist und weil ACID-Transaktionen für die Konsistenz von Sprint- und Story-Daten wichtig sind. Rechts sehen Sie die beiden externen Systeme: Jira Cloud, angebunden über zwei APIs, und Microsoft Entra ID für die Authentifizierung. Ein Scheduler synchronisiert automatisch alle 15 Minuten mit Jira.

## Folie 12 — Datenmodell

Schauen wir auf das Datenmodell – es umfasst sieben Entitäten. Von links nach rechts: Ein Projekt hat mehrere Sprints, und ein Sprint hat mehrere User Stories. Das ist die zentrale Hierarchie. Interessanter sind die Verknüpfungstabellen, die ich blau markiert habe. Die Beziehung zwischen Usern und Projekten ist eine Many-to-Many-Beziehung – ein User kann in mehreren Projekten sein, ein Projekt hat mehrere User. Aufgelöst wird das über die Tabelle ProjectUser, und genau dort ist auch die Rolle hinterlegt: Admin, Member oder Viewer. Diese Beziehung war einer der Gründe für PostgreSQL, weil relationale Datenbanken solche Many-to-Many-Konstrukte sauber abbilden. Ähnlich der CapacityPlan: Er hängt sowohl am Sprint als auch am User und speichert die wochenweisen Kapazitätsdaten – also für jede Person in jedem Sprint einen eigenen Plan. Und schliesslich die Retrospektive, die über einen Unique Constraint genau einem Sprint zugeordnet ist, damit historisch nachvollziehbar bleibt, welche Verbesserungen wann beschlossen wurden. Sieben Modelle klingt schlank, und das ist Absicht: Ich habe das Datenmodell bewusst so einfach wie möglich gehalten.

## Folie 13 — Sicherheit und Zugriffskontrolle

Zum Thema Sicherheit und Zugriffskontrolle, das mir als Cloud Engineer besonders am Herzen liegt. Die Authentifizierung läuft über Microsoft Entra ID mit der Microsoft Authentication Library. Im Frontend kommt der OAuth-2.0-Authorization-Code-Flow zum Einsatz, im Backend werden die ausgestellten JWT-Tokens validiert. Der grosse Vorteil dieses Ansatzes: Wir bekommen Single Sign-On gegen das bestehende Active Directory der Organisation, und es gibt keinen eigenen Passwort-Speicher – das schliesst eine ganze Klasse von Angriffen von vornherein aus. Für die lokale Entwicklung gibt es zusätzlich einen Fallback über eine lokale JWT-Authentifizierung. Die Autorisierung arbeitet auf zwei Ebenen: Global unterscheide ich Admin und Member, auf Projektebene kommt über die ProjectUser-Tabelle zusätzlich der Viewer mit reinem Lesezugriff dazu. Als Sicherheits-Baseline setze ich Helmet für die HTTP-Security-Header ein – also Content Security Policy, X-Frame-Options, HSTS – sowie eine restriktive CORS-Konfiguration. Und jetzt bin ich bewusst ehrlich: CSRF-Schutz, Rate Limiting und erweiterte Input-Sanitisierung sind noch nicht umgesetzt, sondern als nächste Härtungsphase vor dem produktiven Go-Live geplant, orientiert an den OWASP Top 10. In der Diplomphase ist die App nur im internen Netz erreichbar, deshalb ist diese Reihenfolge vertretbar – aber vor einem echten Rollout gehört das ergänzt.

## Folie 14 — Jira-Integration

Kommen wir zu dem Teil, der mir am meisten Kopfzerbrechen bereitet hat: der Jira-Integration.

## Folie 15 — Jira-Integration

Die Jira-Anbindung war klar der anspruchsvollste Teil der Arbeit – und interessanterweise nicht wegen der Technik im engeren Sinn, sondern wegen der Vielfalt der Konfigurationen. Sprintify spricht zwei verschiedene APIs an: die REST-API Version 2 für die Issues, also die User Stories, und die Agile-API Version 1 für Boards und Sprints. Warum zwei? Weil Jira diese Konzepte tatsächlich über getrennte Schnittstellen anbietet. Die Synchronisation läuft in drei Schritten: Zuerst rufe ich über die Agile-API die Boards und deren Sprints ab. Dann synchronisiere ich die Issues pro Sprint. Und zuletzt verknüpfe ich die Jira-Benutzer anhand ihrer Account-ID oder E-Mail mit den lokalen Benutzern. Zwei Details, die den Aufwand erklären: Die Story Points liest das System über ein konfigurierbares Custom Field aus – standardmässig ein bestimmtes Feld, aber jedes Projekt kann ein anderes verwenden, deshalb muss das einstellbar sein. Und der Jira-Status wird auf ein einheitliches Schema gemappt, weil die Teams unterschiedliche Status-Bezeichnungen nutzen. Zum Schluss der Fallstrick, der mich am meisten Zeit gekostet hat: Eine Story kann in mehreren Sprints vorkommen. Nur wenn man die Sprints chronologisch aufsteigend synchronisiert, gewinnt die Zuordnung zum neuesten Sprint. Synchronisiert man absteigend, landet die Story im falschen Sprint. Solche Eigenheiten sieht man nicht in der Dokumentation – die findet man erst mit echten Daten, und ich musste Teile der Synchronisation deswegen neu schreiben.

## Folie 16 — Module im Detail

Nach der Architektur und der Integration zeige ich Ihnen jetzt die einzelnen fachlichen Module im Detail.

## Folie 17 — Modul: Capacity Planning

Das Herzstück von Sprintify ist die Kapazitätsplanung. Pro Teammitglied und Sprint lässt sich die verfügbare Arbeitszeit wochenweise aufschlüsseln, und zwar in vier Kategorien: Holiday für Ferien und Feiertage, Customer für Kundenprojektarbeit, Internal für Meetings, Weiterbildung und interne Entwicklung, und Other für sonstige Abwesenheiten. Bearbeitet wird direkt in der Tabelle, per Inline-Editing – möglichst wenig Reibung, damit es im Alltag auch wirklich genutzt wird. Wird ein Sprint zum ersten Mal geöffnet, legt das System automatisch leere Kapazitätspläne für alle Projektmitglieder an, orientiert an Start- und Enddatum des Sprints. Und jetzt zum eigentlich Neuen: Aus diesen Daten leitet Sprintify eine Story-Point-Empfehlung ab. Die Formel lautet: empfohlene Story Points gleich durchschnittliche Velocity mal Kapazitätsfaktor. Der Kapazitätsfaktor ist das Verhältnis der aktuellen Sprint-Kapazität zur durchschnittlichen Kapazität der letzten sechs abgeschlossenen Sprints. Konkret heisst das: Hat das Team im nächsten Sprint weniger Stunden zur Verfügung als im Schnitt – etwa wegen Ferienzeit – fällt die Empfehlung automatisch tiefer aus. Und falls noch keine historischen Kapazitätsdaten vorliegen, greift das System auf die reine durchschnittliche Velocity zurück. Das ist die datenbasierte Antwort auf die Frage vom Anfang.

## Folie 18 — Modul: Sprint Analytics

Das zweite grosse Modul ist Sprint Analytics, und es hat vier Ansichten. Ich finde es hilfreich, jede Ansicht mit der Frage zu verknüpfen, die sie beantwortet. Die Overview zeigt die Kennzahlen des aktuellen Sprints und ein Burndown-Chart – sie beantwortet die Frage: Sind wir auf Kurs? Die Compare-Ansicht stellt die aktuelle Velocity dem vorherigen Sprint und Langzeit-Benchmarks gegenüber – sie beantwortet: Werden wir besser oder schlechter? Die Changes-Ansicht zeigt, welche Stories während des Sprints zum Umfang dazugekommen sind – sie beantwortet die Frage: Warum haben wir das Ziel verfehlt? Denn in unserer Erfahrung sind genau solche nachträglichen Scope-Änderungen einer der häufigsten Gründe für verfehlte Sprint-Ziele. Und die vierte Ansicht, Team Performance, zeigt die Velocity pro Person als Balkendiagramm – sie beantwortet: Ist die Arbeit gleichmässig verteilt? Ein wichtiger Hinweis dazu: Diese Ansicht ist ausdrücklich nicht für die individuelle Leistungsbewertung gedacht, sondern um Überlastung oder eine ungleiche Verteilung frühzeitig zu erkennen.

## Folie 19 — Modul: Sprint History & Forecast

Zwei ergänzende Funktionen runden das ab. Die Sprint History zeigt die Velocity über alle abgeschlossenen Sprints als Balkendiagramm. Das ist wichtiger, als es klingt, denn genau diese historische Datenbasis existierte vorher nicht – und sie ist die Grundlage sowohl für die Story-Point-Empfehlung als auch für den Forecast. Und der Forecast, den Sie später auf dem Dashboard sehen, rechnet aus der durchschnittlichen Velocity und den noch verbleibenden Story Points im Backlog aus, wie viele Sprints voraussichtlich noch nötig sind und wann das Backlog fertig sein wird. So bekommt das Team nicht nur einen Blick zurück auf die geleistete Arbeit, sondern auch eine belastbare Prognose nach vorn – beides auf derselben Datenbasis.

## Folie 20 — Entwicklungsprozess

Ein kurzer Blick auf den Entwicklungsprozess und wie sich die acht Monate konkret aufgeteilt haben.

## Folie 21 — Sprints und Phasen

Über die vier Phasen verteilt waren es rund sechzehn zweiwöchige Sprints. In der Analysephase, den Sprints eins bis drei, ging es um die Anforderungsaufnahme mit dem Team, die eben gezeigte Marktanalyse und den Architekturentscheid – in dieser Phase ist auch ein erster UI-Prototyp entstanden. In der Backend-Phase, Sprint vier bis acht, habe ich das Datenmodell aufgebaut, die REST-API implementiert und die Jira-Integration entwickelt. Die Frontend-Phase, Sprint neun bis dreizehn, umfasste die gesamte React-Oberfläche: Dashboard, Kapazitätsplanung, Analytics, Sprint History und Teamverwaltung. Und in der Deployment-Phase, Sprint vierzehn bis sechzehn, kamen das Deployment auf Azure, Tests mit echten Jira-Daten, Performance-Optimierung und zuletzt die Story-Point-Empfehlung dazu. Dass diese Empfehlung erst spät kam, war kein Zufall – sie setzt ja historische Daten voraus, die ich erst sammeln musste.

## Folie 22 — Deployment und Betrieb

Zum Deployment und Betrieb. Sprintify läuft auf Azure App Service, also einer Managed-Cloud-Plattform. Der entscheidende Vorteil ist für mich nicht in erster Linie das Geld, sondern dass ich keinen eigenen Server warten muss: zentrale Updates, automatische Skalierung, kein Patchen am Wochenende. Gerade für ein Ein-Mann-Projekt war das entscheidend, weil ich für klassischen Server-Betrieb schlicht keine Kapazität gehabt hätte. Konkret läuft das Backend als App Service, das Frontend als vorkompilierte statische Dateien, und die Datenbank als Managed PostgreSQL – auch die will ich nicht selbst betreiben, Backups und Patches übernimmt die Plattform. Konfiguriert wird alles über Azure App Settings, also Umgebungsvariablen, sodass keine Zugangsdaten im Code liegen. Und Datenbankmigrationen laufen sauber versioniert über die Sequelize-CLI. Das Deployment über eine Managed-Plattform entspricht auch dem aktuellen Trend – man verlagert den Betriebsaufwand bewusst zum Cloud-Anbieter.

## Folie 23 — Sprintify im Einsatz

So viel zur Technik – jetzt zeige ich Ihnen die Anwendung selbst, anhand von Screenshots aus dem produktiven Einsatz. Ein Hinweis vorweg: Personennamen von Kolleginnen und Kollegen sowie Kundendaten habe ich aus Datenschutzgründen unkenntlich gemacht. Die Kennzahlen, die Sie sehen, sind aber echt.

## Folie 24 — Dashboard   —   Projektüberblick: Kennzahlen, Sprint-Fortschritt & Forecast

Das ist das Dashboard, der Einstiegspunkt für das Team. Ganz oben sehen Sie die zentralen Kennzahlen auf einen Blick: Anzahl Sprints, Anzahl Stories, Story Points und die Completion Rate. In der Mitte links der Sprint-Überblick mit aktiven und abgeschlossenen Sprints und der durchschnittlichen Velocity, rechts der Story Progress. Und ganz unten der Forecast, den ich vorhin angesprochen habe: durchschnittliche Velocity, verbleibende Punkte, die geschätzte Anzahl noch nötiger Sprints und das voraussichtliche Fertigstellungsdatum. Der Kerngedanke dieser Seite ist: Alles Wesentliche auf einen Blick, ohne dass jemand eine Excel-Datei öffnen oder Daten zusammensuchen muss.

## Folie 25 — Active Sprint   —   Aktueller Sprint: Status, Story Points & Team-Kapazität

Hier die Detailansicht des aktiven Sprints. Oben in der farbigen Leiste der Fortschritt in Prozent und die Laufzeit des Sprints. Darunter die vier wichtigsten Kennzahlen: Anzahl Stories, Story Points insgesamt, wie viele Punkte erledigt und wie viele gerade in Arbeit sind. Links unten die Status-Aufteilung – To Do, In Progress, Done – und rechts die Team-Kapazität für genau diesen Sprint. Das ist die Ansicht, die das Team im Tagesgeschäft während eines laufenden Sprints am häufigsten offen hat.

## Folie 26 — Sprint Analytics · Overview   —   Kennzahlen und Burndown-Chart (Ideal vs. Ist)

Jetzt das Analytics-Modul, zuerst die Overview mit dem Burndown-Chart. Oben wieder die Kennzahlen, darunter das eigentliche Chart. Die gestrichelte, fallende Linie ist der ideale Verlauf – so müssten die offenen Punkte gleichmässig abgearbeitet werden. Die durchgezogene Linie ist der tatsächliche Verlauf, berechnet aus den echten Abschlusszeitpunkten der einzelnen Stories. In diesem Beispiel sehen Sie schön, dass lange fast nichts passiert ist und die Kurve erst gegen Ende steil abfällt – ein typisches Muster, wenn viel auf den letzten Drücker fertig wird. Genau solche Muster macht das Burndown-Chart sofort sichtbar und damit besprechbar.

## Folie 27 — Sprint Analytics · Compare   —   Velocity vs. Vorsprint und Langzeit-Benchmarks

Die Compare-Ansicht. Links wird der aktuelle Sprint dem vorherigen direkt gegenübergestellt – hier 21 zu 9 Story Points. Rechts sehen Sie die Team-Benchmarks: die durchschnittliche Velocity und die beste jemals erreichte Velocity über alle abgeschlossenen Sprints. Und das kleine Label «Improving» fasst den Trend zusammen. Das gibt dem Team eine ehrliche Standortbestimmung: Bewegen wir uns in die richtige Richtung, oder lässt die Leistung nach?

## Folie 28 — Sprint Analytics · Changes   —   Während des Sprints hinzugefügte und entfernte Stories

Die Changes-Ansicht zeigt, was während des Sprints am Umfang verändert wurde – hinzugefügte und entfernte Stories. In diesem Beispiel wurden 45 Stories nachträglich in den laufenden Sprint hineingenommen, das sehen Sie oben an der Kennzahl «Net Change plus 45». Wie gesagt: Solche Scope-Änderungen sind in der Praxis einer der häufigsten Gründe, warum ein Sprint-Ziel am Ende nicht erreicht wird. Bisher ist das oft untergegangen; hier wird es sichtbar und lässt sich in der Retrospektive gezielt ansprechen. Die einzelnen Story-Titel habe ich unkenntlich gemacht, weil sie Kundennamen enthalten.

## Folie 29 — Sprint Analytics · Team Performance   —   Velocity und Completion Rate pro Teammitglied

Team Performance zeigt die Velocity pro Teammitglied als Balkendiagramm, ergänzt um die Completion Rate. Ich betone es noch einmal, weil es mir wichtig ist: Diese Ansicht ist bewusst nicht als Ranking oder zur Leistungsbeurteilung gedacht. Der Zweck ist, zu erkennen, ob die Arbeit im Team gleichmässig verteilt ist, oder ob einzelne Personen strukturell überlastet sind. Die Namen sind anonymisiert, die Zahlen dahinter sind echt.

## Folie 30 — Sprint History   —   Velocity-Verlauf über alle abgeschlossenen Sprints

Die Sprint History zeigt die Velocity über alle abgeschlossenen Sprints hinweg – hier mit einem Durchschnitt von rund zwanzig Punkten. Das mag unspektakulär aussehen, ist aber ein Kernstück: Diese aufbereitete historische Datenreihe gab es vorher schlicht nicht, sie lag höchstens verstreut in alten Excel-Dateien. Auf genau dieser Basis rechnen die Story-Point-Empfehlung und der Forecast. Ohne diese Historie wäre alles andere nur geschätzt.

## Folie 31 — Capacity Planning   —   Wochenkapazität, Kategorien und Story-Point-Empfehlung

Das ist die Kapazitätsplanung in Aktion – das Herzstück, jetzt mit echten Daten. Oben die aggregierten Zahlen: Gesamtkapazität, Anzahl aktive Mitglieder, Durchschnitt pro Person und Sprint-Dauer. In der Mitte, hervorgehoben, die konkrete Empfehlung: neunzehn Story Points. Und Sie sehen direkt darunter die Herleitung – durchschnittliche Velocity mal Kapazitätsfaktor 0.92, mit der aktuellen und der historischen Kapazität daneben. Es bleibt also nachvollziehbar, wie die Zahl zustande kommt, es ist keine Blackbox. Darunter die Aufteilung nach den vier Kategorien, und ganz unten die individuellen Wochenpläne pro Person – die Namen sind ausgeblendet, das Stundenraster mit den Kategorien pro Woche sehen Sie. Das ist der Punkt, an dem alles zusammenläuft.

## Folie 32 — Retrospective   —   Went Well, Needs Improvement und Action Items

Als bewusst schlank gehaltene Nebenfunktion gibt es ein Retrospektiven-Modul. Pro Sprint können die Teammitglieder festhalten, was gut lief, was verbessert werden soll und welche konkreten Action Items daraus folgen. Ich habe das ganz bewusst einfach gehalten – es soll keine spezialisierten Retro-Tools ersetzen, sondern eine Basis-Dokumentation genau an der Stelle anbieten, an der das Team ohnehin auf seine Sprint-Daten schaut. So bleibt nachvollziehbar, welche Verbesserungen wann beschlossen wurden.

## Folie 33 — Team   —   Mitgliederverwaltung mit Rollen (admin / member / viewer)

Die Teamverwaltung. Hier werden die Mitglieder mit ihren jeweiligen Rollen verwaltet – Admin, Member oder Viewer. Admins können Projekte und Benutzer verwalten, Viewer haben ausschliesslich Lesezugriff. Namen und E-Mail-Adressen habe ich hier natürlich anonymisiert, weil es sich um echte Kolleginnen und Kollegen handelt.

## Folie 34 — Projects   —   Projektübersicht mit eigener Jira-Integration

Die Projektübersicht. Ein wichtiges Detail hier: Jedes Projekt hat seine eigene, separate Jira-Integration. Das war eine bewusste Anforderung, weil unsere Teams – wie eingangs erwähnt – unterschiedliche Jira-Instanzen und -Konfigurationen nutzen. Von dieser Ansicht aus lässt sich die Synchronisation direkt anstossen oder man wechselt in die Projekt-Einstellungen.

## Folie 35 — Projekt-Einstellungen   —   Jira-Anbindung, Board-Mapping und Synchronisation

Und zuletzt die Projekt-Einstellungen, wo die eigentliche Jira-Anbindung konfiguriert wird: Server-URL, Zugangsdaten, der Project Key und optional die Board-ID. Man kann die Verbindung testen, bevor man speichert, einen vollständigen Sync manuell auslösen und den aktuellen Sync-Status samt Zeitpunkt einsehen. Die konkrete URL und der hinterlegte Benutzer sind hier ausgeblendet. Damit haben Sie einen vollständigen Rundgang durch die Anwendung gesehen.

## Folie 36 — Kritische Würdigung

Kommen wir zur kritischen Würdigung – und da will ich ehrlich sein, in beide Richtungen. Was ist gut gelaufen? Das iterative Vorgehen hat sich klar bewährt, gerade weil sich Anforderungen unterwegs geändert haben. Die Anwendung läuft heute produktiv mit echten Daten, und die Ergebnisse stimmen. Die Story-Point-Empfehlung als Kombination aus Kapazität und Velocity ist, soweit ich das im Markt gesehen habe, ein echtes Alleinstellungsmerkmal. Und auch der KI-Einsatz hat mich spürbar beschleunigt – aber, und das gehört zur Ehrlichkeit dazu, nur weil ich jeden Vorschlag konsequent manuell reviewt habe. Was würde ich anders machen? Erstens habe ich die schiere Vielfalt der Jira-Konfigurationen deutlich unterschätzt. Ein kurzer technischer Spike ganz zu Beginn – ein Wegwerf-Prototyp nur für die Jira-Anbindung – hätte mir den Aufwand realistischer gezeigt und einiges an Nacharbeit erspart. Zweitens habe ich automatisierte Tests aus Zeitgründen nur punktuell geschrieben; das ist eine Schwäche, die die Wartbarkeit betrifft. Und drittens ist die Single-Tenant-Architektur eine bewusste Einschränkung – für die Netcloud reicht sie, für einen Einsatz bei mehreren Organisationen bräuchte es eine Mandantentrennung.

## Folie 37 — Persönliche Reflexion

Zur persönlichen Reflexion – was ich aus diesem Projekt für meine berufliche Praxis mitnehme. Die vielleicht wichtigste Erkenntnis: Bei Integrationsprojekten steckt die grösste Herausforderung selten in der eigenen Codebasis, sondern in den Eigenheiten und Inkonsistenzen des Systems, an das man anbindet. Das werde ich in Zukunft von Anfang an einplanen. Das Projekt allein umzusetzen hatte zwei Seiten: Ich konnte Entscheidungen schnell treffen und musste mich mit niemandem abstimmen – aber mir fehlte das zweite Paar Augen, die Code-Reviews, die man im Team hat. Ohne die schleichen sich Fehler ein, die man selbst nicht sieht. Fachlich habe ich viel dazugelernt: Vorher lag mein Schwerpunkt auf Frontend und Infrastruktur, durch dieses Projekt habe ich fundierte Backend-Erfahrung gewonnen. Drei konkrete Dinge nehme ich mit: Integrationen immer mit einem Spike beginnen, automatisierte Tests von Anfang an schreiben, und auch als Solo-Entwickler Code-Reviews zumindest simulieren. Und zum KI-Einsatz meine zentrale Lehre: Generative KI beschleunigt einen erfahrenen Entwickler erheblich, aber sie ersetzt Fachkompetenz nicht. Wer Vorschläge ungeprüft übernimmt, baut sich Inkonsistenzen, Sicherheitslücken oder erfundene Funktionen ein. Genau deshalb war die manuelle Review-Phase nach jedem Output für mich der entscheidende Schritt.

## Folie 38 — Wirtschaftlichkeit

Bevor ich zur Empfehlung komme, ein Blick auf die Wirtschaftlichkeit – denn eine Lösung muss sich am Ende rechnen. Auf der Kostenseite: Der Betrieb von Sprintify kostet rund 630 Franken pro Jahr, im Wesentlichen die Azure-Ressourcen, weil es auf unserer bestehenden Infrastruktur mitläuft. Zum Vergleich habe ich die kommerziellen Alternativen gerechnet: Tempo Timesheets liegt bei rund 960 Franken pro Jahr, Jira Advanced Roadmaps bei über 1500 Franken – und das bei geringerem Funktionsumfang im Bereich Kapazitätsplanung. Sprintify ist also nicht nur günstiger, sondern für unseren konkreten Zweck auch besser zugeschnitten. Auf der Nutzenseite: Ich schätze die Zeitersparnis konservativ auf 80 bis 120 Stunden pro Jahr, allein bei der Datenerhebung und der Re-Planung, die heute manuell laufen. Bei einem internen Stundensatz von 120 Franken entspricht das einer jährlichen Einsparung von rund 9600 bis 14400 Franken. Der Return on Investment ist damit schon ab dem ersten Jahr deutlich positiv – und das ist die betriebswirtschaftliche Begründung für den produktiven Einsatz.

## Folie 39 — Empfehlung und nächste Schritte

Damit komme ich zu meiner Empfehlung. Ich empfehle klar, Sprintify in der Abteilung Public Cloud Solutions produktiv einzusetzen – die Anwendung erfüllt die definierten Anforderungen und läuft stabil mit echten Daten. Für den laufenden Betrieb schlage ich fünf konkrete nächste Schritte vor: Erstens die produktive Jira-Anbindung über einen schreibgeschützten Service-Account laufen lassen, damit keine persönlichen Zugangsdaten hinterlegt werden müssen. Zweitens eine kurze Einführungsschulung für das Team. Drittens in den ersten drei Sprints gezielt Feedback sammeln und einfliessen lassen. Viertens die automatisierten Tests ausbauen, um die Wartbarkeit zu sichern. Und fünftens mittelfristig eine mobile Ansicht ergänzen, damit das Tool auch während der Stand-ups am Handy nutzbar ist. Was passiert, wenn wir es nicht einsetzen? Dann bleibt die Kapazitätsplanung auf verteilte Excel-Listen angewiesen, und die Sprint-Schätzungen basieren weiterhin auf Erfahrungswerten statt auf Daten – mit allen Nachteilen, die ich eingangs geschildert habe.

## Folie 40 — Sprintify

Damit bin ich am Ende meiner Präsentation. Lassen Sie mich mit dem Satz schliessen, mit dem ich angefangen habe: Sprintify gibt dem Team eine datenbasierte Antwort auf die Frage, wie viele Story Points wir im nächsten Sprint realistisch schaffen. Aus einem Bauchgefühl ist eine nachvollziehbare, datengestützte Empfehlung geworden. Ich danke Ihnen herzlich für Ihre Aufmerksamkeit und freue mich jetzt auf Ihre Fragen.
