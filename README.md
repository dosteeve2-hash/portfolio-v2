# La forge du futur — portfolio de Steeve Donald Compaoré

Next.js (App Router), TypeScript strict, Tailwind CSS 4, Motion. Trilingue FR / EN / TR.

## Lancer

```powershell
npm install
npm run dev -- -p 3100   # http://localhost:3100  (redirige vers /fr, /en ou /tr)
npm run build
npm run lint
npx tsc --noEmit
```

## Structure

- `app/[locale]/` : pages (accueil, `cv`, 404) et layout racine (polices, `lang`, métadonnées).
- `proxy.ts` : détection de langue (cookie `NEXT_LOCALE`, puis `Accept-Language`) et redirection vers `/fr|/en|/tr`.
- `content/` : tous les textes et données. Jamais de texte en dur dans `components/`.
- `components/` : sections, intro chorégraphiée, braises (canvas), schéma animé.
- `lib/` : état de l'intro, coordonnées du schéma de l'orchestrateur.

## Modifier le contenu

- **Un texte** : `content/fr.ts`, `content/en.ts`, `content/tr.ts` (même structure, typée par `content/types.ts`). Le turc attend une relecture native.
- **Un projet** : `content/projects.ts`.
- **Une compétence ou son niveau** : `content/skills.ts` . Niveaux issus du CV (`veryGood`, `good`, `average`) ; un `level` absent = outil sans niveau chiffré.
- **Une certification** : ajouter un objet à `content/certifications.ts` (`title`, `issuer`, `date` au format `AAAA-MM`, `verifyUrl`, `pdfUrl` optionnels). Tant que la liste est vide, un état « Mise à jour en cours » s'affiche.
- **Contact, LinkedIn, CV** : `content/site.ts`. `linkedinUrl` vide masque le bloc LinkedIn. Pour activer le CV, déposer `public/cv/Steeve-Donald-Compaore-CV-{fr|en|tr}.pdf` puis passer `cvAvailable` à `true` ; sinon le bouton mène à la page « CV bientôt disponible ».
- **Photo** : remplacer `public/portrait.jpg` (ou changer `PORTRAIT_SRC` et le cadrage `PORTRAIT_FOCUS` dans `content/site.ts`).

## Mascotte et assistant

- `components/mascot/` : personnage SVG (`MascotFigure`, expressions dans `pose.ts`), mascotte flottante (`Mascot`, chargée en différé par `MascotLoader`), panneau de discussion (`AssistantPanel`).
- Page de revue non référencée : `/fr/mascot-lab` (toutes les expressions, boutons pour les déclencher).
- `content/assistantKb.ts` : base de connaissances de l'assistant (intentions, mots-clés FR/EN/TR, réponses construites à partir de `content/` et `content/cv-data.json`). `lib/assistant.ts` : moteur local de mots-clés, sans réseau.
- Textes de l'interface de la mascotte et libellés de l'accueil : `content/mascotText.ts`. Nom du personnage : `MASCOT_NAME` dans `content/site.ts`.
- Lumière du curseur et projecteur des cartes : `components/Atmosphere.tsx` (carte avec l'attribut `data-spotlight`). Écriture progressive de l'accueil : `components/TypedLine.tsx`.
