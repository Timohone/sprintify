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

Zum Thema Velocity: Der Scrum Guide [Schwaber2020] definiert Velocity nicht als Pflichtmetrik. In der Praxis ist es aber das verbreitetste Werkzeug zur Sprint-Planung. Teams schätzen User Stories in Story Points, messen wie viele Points sie pro Sprint schaffen und leiten daraus ihre Kapazität für kommende Sprints ab. Sprintify baut genau auf diesem Mechanismus auf — es nimmt die historische Velocity eines Teams und macht daraus eine datenbasierte Planungsgrundlage.

## 2. Technologiewahl

Die Technologieentscheidungen habe ich anhand von vier Kriterien getroffen:

- **Vorwissen:** JavaScript und TypeScript sind die Sprachen, in denen ich am produktivsten bin. Bei einem Ein-Mann-Projekt mit begrenzter Zeit kann ich es mir nicht leisten, nebenbei noch eine neue Sprache zu lernen.
- **Eignung:** Node.js passt gut für API-intensive Anwendungen. Der Event Loop und das async I/O-Modell sind wie gemacht für Szenarien, in denen viele HTTP-Calls parallel laufen. Die Jira-API erfordert genau das — Projekte, Boards, Sprints, Stories, alles über separate Endpoints.
- **Community und Support:** Express.js, React und Sequelize haben grosse Communities und sind gut dokumentiert. Wenn ich um 22 Uhr auf ein Problem stosse, finde ich auf Stack Overflow in der Regel eine Antwort.
- **Deployment:** Azure App Service unterstützt Node.js nativ. Kein Docker nötig, kein Custom Runtime — einfach deployen und es läuft.

Konkret habe ich mich für folgende Technologien entschieden:

- **Node.js statt Python/Django:** Gleiche Sprache für Frontend und Backend. Und die async-Unterstützung für parallele API-Calls ist bei Node.js deutlich natürlicher als bei Python.
- **PostgreSQL statt MongoDB:** Die Daten in Sprintify sind relational. User gehören zu Projekten (Many-to-Many), Projekte haben Sprints, Sprints haben User Stories. Das schreit nach einer relationalen Datenbank mit ACID-Transaktionen. Sequelize als ORM macht die Arbeit damit angenehm.
- **React statt Angular oder Vue:** Komponentenbasiert, ich hatte bereits Erfahrung damit, und die Community ist die grösste im Frontend-Bereich.

## 3. Iteratives Vorgehen in der Praxis

Das Projekt war in vier Phasen gegliedert: Analyse, Backend, Frontend und Integration. Innerhalb jeder Phase habe ich in zweiwöchigen Iterationen gearbeitet. Das war kein starres Wasserfallmodell mit agilen Sprints drin — die Phasen haben sich teilweise überlappt, und ich bin auch mal zurückgesprungen, wenn es nötig war.

Ein konkretes Beispiel, das zeigt warum iteratives Vorgehen so wertvoll ist: die Jira-Integration.

- **Sprint 7-8:** Erster Versuch der Integration. Ich habe die Jira REST API angebunden, Projekte und Sprints synchronisiert. Mit meinem eigenen Jira-Projekt hat alles sauber funktioniert.
- **Sprint 9-10:** Dann habe ich ein anderes Projekt angebunden — und plötzlich stimmte nichts mehr. Andere Custom Fields, andere Status-Bezeichnungen, andere Workflows. Die ganze Sync-Logik musste überarbeitet werden, um mit unterschiedlichen Jira-Konfigurationen umzugehen.
- **Erkenntnis:** Ein Spike mit verschiedenen Jira-Konfigurationen zu Beginn hätte mir zwei Sprints gespart. Ich habe den Fehler gemacht, von meinem eigenen Setup auf alle anderen zu schliessen.

Ein weiteres Beispiel für die Stärke des iterativen Vorgehens: Die SP-Empfehlungsformel war ursprünglich nicht im Scope. Sie kam als Anforderung in Phase 3 dazu, weil das Team beim Testen sagte: "Wäre cool, wenn das Tool direkt sagen könnte, wie viele Story Points wir im nächsten Sprint schaffen." Weil ich iterativ gearbeitet habe, konnte ich diese Anforderung in den nächsten Sprint einplanen, ohne den Zeitplan zu sprengen.

## 4. Fazit

Iteratives Vorgehen hat sich bewährt — ohne feste Iterationen hätte ich die wechselnden Anforderungen nicht auffangen können. Scrum funktioniert auch als Solo-Entwickler, wenn man die Zeremonien pragmatisch anpasst und sich nicht sklavisch an das Framework klammert. Die wichtigste Lektion für zukünftige Projekte: Integrationen mit externen Systemen immer mit einem Spike starten, bevor man die eigentliche Implementierung beginnt. Zwei Tage Exploration am Anfang können zwei Wochen Nacharbeit am Ende verhindern.
