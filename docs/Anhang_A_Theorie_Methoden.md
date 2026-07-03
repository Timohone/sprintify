# Anhang A: Theorie- und Methodenreflexion

## 1. Scrum als Vorgehensmodell

Scrum ist ein agiles Framework für die Produktentwicklung, das auf drei Säulen basiert: Transparenz, Überprüfung und Anpassung. Das Framework definiert drei Verantwortlichkeiten (Product Owner, Scrum Master, Developers), drei Artefakte (Product Backlog, Sprint Backlog, Inkrement) und fünf Events (Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective) [Schwaber2020].

Für ein Ein-Mann-Projekt passt das natürlich nicht eins zu eins. Die Anpassungen, die ich vorgenommen habe:

- **Keine Daily Standups.** Allein vor dem Bildschirm stehen und sich selbst erzählen, was man gestern gemacht hat, bringt nichts. Stattdessen habe ich morgens kurz das Sprint Board angeschaut und entschieden, was als Nächstes dran ist.
- **Keine formelle Retrospektive.** Am Ende jeder Iteration habe ich mir aber trotzdem 20 Minuten genommen und aufgeschrieben, was gut lief und was nicht. Keine Post-its, kein Framework — einfach ein paar ehrliche Sätze in einem Notizbuch.
- **Zweiwöchige Iterationen** mit klar definierten Zielen. Jede Iteration hatte ein Sprint Goal, das ich im Sprint Planning festgelegt habe.
- **Regelmässige Besprechung mit dem Vorgesetzten** als Ersatz für das Sprint Review. Alle zwei Wochen habe ich den aktuellen Stand gezeigt, Feedback eingeholt und die nächsten Prioritäten besprochen.

Was funktioniert hat: Feste Iterationen erzwingen eine regelmässige Standortbestimmung. Man kann nicht drei Monate vor sich hin arbeiten und am Ende merken, dass man komplett am Ziel vorbeigelaufen ist. Alle zwei Wochen musste ich liefern — und wenn auch nur einen kleinen, funktionierenden Teil.

Was nicht funktioniert hat: Ohne Team fehlt der Feedback-Loop komplett. Kein Pair Programming, keine Code-Reviews, niemand der sagt "das geht eleganter" oder "hast du an diesen Edge Case gedacht?". Ich habe versucht, das teilweise mit automatisierten Tests zu kompensieren, aber ein zweites Paar Augen ersetzt das nicht.

Zum Thema Velocity: Der Scrum Guide [Schwaber2020] definiert Velocity nicht als Pflichtmetrik. In der Praxis ist es aber das verbreitetste Werkzeug zur Sprint-Planung. Cohn beschreibt Velocity als die zentrale empirische Grösse, um aus der Vergangenheit eines Teams ableiten zu können, was es in einem Sprint realistisch schafft (vgl. Cohn 2005, Kap. 16 [Cohn2005]). Sutherland argumentiert ähnlich, dass Teams ihre Velocity messen müssen, um sich kontinuierlich zu verbessern [Sutherland2014]. Teams schätzen User Stories in Story Points, messen wie viele Points sie pro Sprint schaffen und leiten daraus ihre Kapazität für kommende Sprints ab. Sprintify baut genau auf diesem Mechanismus auf — es nimmt die historische Velocity eines Teams und macht daraus eine datenbasierte Planungsgrundlage.

## 2. Technologiewahl

Die Technologieentscheidungen habe ich anhand von vier Kriterien getroffen:

- **Vorwissen:** JavaScript und TypeScript sind die Sprachen, in denen ich am produktivsten bin. Bei einem Ein-Mann-Projekt mit begrenzter Zeit kann ich es mir nicht leisten, nebenbei noch eine neue Sprache zu lernen.
- **Eignung:** Node.js passt gut für API-intensive Anwendungen. Der Event Loop und das non-blocking I/O-Modell [NodeJS2026] sind wie gemacht für Szenarien, in denen viele HTTP-Calls parallel laufen. Die Jira-API erfordert genau das — Projekte, Boards, Sprints, Stories, alles über separate Endpoints.
- **Community und Support:** Express.js, React und Sequelize haben grosse Communities und sind gut dokumentiert. Wenn ich um 22 Uhr auf ein Problem stosse, finde ich auf Stack Overflow in der Regel eine Antwort.
- **Deployment:** Azure App Service unterstützt Node.js nativ. Kein Docker nötig, kein Custom Runtime — einfach deployen und es läuft.

Konkret habe ich mich für folgende Technologien entschieden:

- **Node.js statt Python/Django:** Gleiche Sprache für Frontend und Backend. Und die async-Unterstützung für parallele API-Calls ist bei Node.js deutlich natürlicher als bei Python.
- **PostgreSQL statt MongoDB:** Die Daten in Sprintify sind relational. User gehören zu Projekten (Many-to-Many), Projekte haben Sprints, Sprints haben User Stories. Das schreit nach einer relationalen Datenbank mit ACID-Transaktionen [PostgreSQL2026]. Sequelize als ORM macht die Arbeit damit angenehm.
- **React statt Angular oder Vue:** Komponentenbasiert, ich hatte bereits Erfahrung damit, und die Community ist die grösste im Frontend-Bereich.

## 3. Iteratives Vorgehen in der Praxis

Das Projekt war in vier Phasen gegliedert: Analyse, Backend, Frontend und Integration. Innerhalb jeder Phase habe ich in zweiwöchigen Iterationen gearbeitet. Das war kein starres Wasserfallmodell mit agilen Sprints drin — die Phasen haben sich teilweise überlappt, und ich bin auch mal zurückgesprungen, wenn es nötig war.

Ein konkretes Beispiel, das zeigt warum iteratives Vorgehen so wertvoll ist: die Jira-Integration.

- **Sprint 6-7:** Erster Versuch der Integration. Ich habe die Jira REST API angebunden, Projekte und Sprints synchronisiert. Mit meinem eigenen Jira-Projekt hat alles sauber funktioniert. Schon dabei zeigten sich erste Probleme mit Custom Fields.
- **Sprint 8:** Als ich ein anderes Projekt anband, stimmte vieles nicht mehr. Andere Custom Fields, andere Status-Bezeichnungen, andere Workflows. Die ganze Sync-Logik musste überarbeitet werden, um mit unterschiedlichen Jira-Konfigurationen umzugehen. Ausserdem habe ich in diesem Sprint den Scheduler implementiert.
- **Erkenntnis:** Ein Spike mit verschiedenen Jira-Konfigurationen zu Beginn hätte mir zwei Sprints gespart. Ich habe den Fehler gemacht, von meinem eigenen Setup auf alle anderen zu schliessen.

Ein weiteres Beispiel für die Stärke des iterativen Vorgehens: Die SP-Empfehlungsformel war ursprünglich nicht im Scope. Sie kam als Anforderung in Phase 3 dazu, weil das Team beim Testen sagte: "Wäre cool, wenn das Tool direkt sagen könnte, wie viele Story Points wir im nächsten Sprint schaffen." Weil ich iterativ gearbeitet habe, konnte ich diese Anforderung in den nächsten Sprint einplanen, ohne den Zeitplan zu sprengen.

## 4. KI-gestützte Entwicklung als Methode

Generative KI ist 2026 ein etabliertes Werkzeug in der professionellen Software-Entwicklung. Microsoft GitHub Copilot, JetBrains AI Assistant, Cursor und Claude Code sind in vielen Entwicklungsteams Standard geworden. Für diese Diplomarbeit habe ich bewusst entschieden, mit einem solchen Werkzeug zu arbeiten — konkret mit Claude Code (Anthropic) — und den Einsatz transparent zu dokumentieren.

**Warum KI-gestützt arbeiten?**

Drei Gründe haben für den Einsatz gesprochen:

- **Geschwindigkeit:** Als Ein-Mann-Projekt mit 300 Stunden Zeitbudget neben der Vollzeitstelle musste ich Engineering-Aufwand reduzieren, wo es ohne Qualitätsverlust möglich war. Boilerplate-Code, repetitive CRUD-Endpoints und initiale Komponenten-Gerüste sind dafür ideal.
- **Realitätsnähe:** Diplomarbeiten sollen Praxisbezug zeigen. In der Praxis arbeite ich täglich mit KI-Unterstützung. Eine Diplomarbeit, in der ich diese Werkzeuge bewusst weglasse, wäre weniger praxisnah als eine, in der ich sie transparent nutze.
- **Fokus auf Designentscheide:** Indem ich Routine-Implementierung beschleunige, gewinne ich Zeit für die Bereiche, in denen menschliche Entscheidung den Unterschied macht — Architektur, Sicherheit, Datenmodell, Nutzerführung.

**Was hat funktioniert?**

- **Schnelle Implementierung von Boilerplate.** Routes, Sequelize-Modelle, Migrationen, React-Komponenten-Gerüste. Was früher Tage gebraucht hätte, ging in Stunden.
- **Architektur-Sparring.** Verschiedene Optionen durchspielen, ohne jede einzelne zu prototypen. Beispiel: Many-to-Many-Verknüpfung User-Project — JSON-Spalte vs. Junction Table vs. Policy-basiert. Ich konnte die Trade-offs vergleichen und mich begründet entscheiden.
- **Dokumentations-Entwürfe.** Erste Fassungen für Abstract, Anhänge und Foliennotizen. Die fachliche Substanz kommt von mir, der sprachliche Feinschliff geht schneller mit KI-Hilfe.

**Wo waren die Grenzen?**

- **Halluzinationen bei Library-Details.** Mehrfach wurden Funktionen oder Konfigurationsoptionen vorgeschlagen, die in der genutzten Version gar nicht existierten. Ohne Verifizierung gegen die offizielle Dokumentation wäre das eingeflossen. Lehre: KI-Aussagen zu APIs immer gegen die offizielle Dokumentation prüfen.
- **Sicherheitslücken in ersten Entwürfen.** Initiale Vorschläge enthielten teilweise fehlende Authorization-Checks oder naive SQL-Statements. Hier war die manuelle Review entscheidend. Ein unerfahrener Entwickler hätte diese Lücken übersehen.
- **Generische Vorschläge.** KI optimiert auf den Durchschnitt der Trainingsdaten. Wer eine spezifische, architekturell saubere Lösung will, muss den Vorschlag aktiv anpassen — ungeprüft übernehmen führt zu Inkonsistenzen.
- **Falsches Selbstvertrauen.** KI klingt überzeugend, auch wenn der Vorschlag fachlich falsch ist. Das ist die grösste Falle, gerade für Entwickler, die das Thema noch nicht beherrschen.

**Mein Arbeitszyklus**

Aus den Erfahrungen habe ich einen wiederkehrenden Zyklus etabliert:

1. Anforderung präzise formulieren — Was, warum, in welchen Constraints
2. Existierende Architektur als Kontext mitgeben
3. KI generiert einen Vorschlag
4. Code Zeile für Zeile lesen, prüfen, hinterfragen
5. Manuell anpassen (Stil, Architektur-Konsistenz, Edge Cases)
6. In der Test-Umgebung gegen echte Daten validieren
7. Bei Problemen: gezielte Rückkopplung mit konkreten Beobachtungen

Schritte 1, 2, 4, 5, 6 und 7 sind Eigenleistung. Schritt 3 ist die Beschleunigung. Diese Trennung war für mich der Schlüssel, KI nutzbar zu machen ohne die Kontrolle über das Projekt zu verlieren.

**Schlussfolgerung**

KI ersetzt keinen Engineer, aber sie verändert die Rolle. Wer mit KI gut arbeiten kann, muss noch genauer wissen, was er will, denn die Maschine liefert nur das, was sie versteht. Vage Anforderungen führen zu vagen Lösungen. Klare Anforderungen, gute Reviews und konsequente Validierung sind heute wichtiger als die reine Tipp-Geschwindigkeit.

Für die Praxis nehme ich mit: KI-Werkzeuge bewusst einsetzen, ihre Grenzen kennen, Output nie ungeprüft übernehmen — und nicht versuchen, sie zu verstecken. Wer offen damit umgeht, gewinnt Geschwindigkeit ohne fachliche Substanz zu verlieren.

Das vollständige KI-Chat-Protokoll mit repräsentativen Sessions und Reflexion findet sich in Anhang E.

## 5. Fazit

Iteratives Vorgehen hat sich bewährt — ohne feste Iterationen hätte ich die wechselnden Anforderungen nicht auffangen können. Scrum funktioniert auch als Solo-Entwickler, wenn man die Zeremonien pragmatisch anpasst und sich nicht sklavisch an das Framework klammert. Die wichtigste Lektion für zukünftige Projekte: Integrationen mit externen Systemen immer mit einem Spike starten, bevor man die eigentliche Implementierung beginnt. Zwei Tage Exploration am Anfang können zwei Wochen Nacharbeit am Ende verhindern. Der KI-Einsatz hat das Projekt deutlich beschleunigt, ohne die Qualität zu gefährden — vorausgesetzt, jeder Vorschlag wird kritisch geprüft.
