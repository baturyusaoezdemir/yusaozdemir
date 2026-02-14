# 🚀 Argo CD mit einer Root-App auf Kubernetes deployen

## Einführung

**GitOps** ist ein modernes Konzept, um Infrastrukturen und Applikationen **deklarativ** über **Git** zu verwalten.
Anstatt manuelle Deployments mit `kubectl` oder komplexe CI/CD-Pipelines auszuführen, legt man in einem Git-Repository die Files mit dem gewünschten Zustand ab – dieser wird dann automatisch auf das Zielsystem angewendet.

**Argo CD** und **FluxCD** sind bekannte Tools, um genau diesen Prozess abzubilden.

In diesem Tutorial zeige ich dir, wie du Argo CD mit einer **Root-App** deployen kannst.
Die Root-App dient als zentraler Einstiegspunkt, um alle anderen Applikationen im Cluster zu verwalten – ideal für größere oder modulare Umgebungen. Dieses Verfahren ist auch bekannt unter dem Namen **App-of-App Pattern**

---

## Voraussetzungen

Bevor wir starten, solltest du Folgendes installiert haben:

* Ein Kubernetes-Cluster (z. B. [Kind](https://kind.sigs.k8s.io/), [Minikube](https://minikube.sigs.k8s.io/), GKE, EKS, AKS, etc.)
* `kubectl` CLI
* `helm`
* Ein Git-Repository, das deine Kubernetes-Manifeste enthält

---

## 1. Argo CD installieren

Wir beginnen mit der Installation im Namespace `argocd`:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Nach wenigen Minuten sollte Argo CD laufen:

```bash
kubectl get pods -n argocd
```

Um dich im Web-UI einzuloggen:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Und das Admin-Passwort abrufen:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

Dann unter [https://localhost:8080](https://localhost:8080) im Browser öffnen.

---

## 2. Repository-Struktur vorbereiten

Lege ein Git-Repository für deine Deployments an, z. B. so:

```plaintext
gitops-repo/
├── root-app.yaml
├── apps/
│   ├── argocd.yaml
│   ├── nginx.yaml
│   ├── monitoring.yaml
```

* `root-app.yaml`: zentrale Root-App-Definition
* Unter `apps/` liegen die einzelnen Applications, die Argo CD deployt

---

## 3. Beispiel-App (nginx.yaml)

Eine einfache App-Definition für `nginx`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/deinuser/gitops-repo.git
    path: manifests/nginx
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## 4. Die Root-App erstellen

Jetzt definieren wir die Root-App, die alle Sub-Apps steuert:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/deinuser/gitops-repo.git
    path: apps
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Diese App überwacht den Ordner `apps/` im Git-Repo und erstellt automatisch alle dort definierten Anwendungen.

---

## 5. Root-App deployen

Einfach im Cluster anwenden:

```bash
kubectl apply -f root-app.yaml -n argocd
```

Innerhalb weniger Sekunden siehst du im Argo-CD-Dashboard die Root-App und alle darunterliegenden Anwendungen.

---

## 6. Root-App im Dashboard

Im UI sieht man eine **hierarchische Baumstruktur**:

* Ganz oben die `root-app`
* Darunter `argocd`, `nginx`, `monitoring`, etc.

So hast du **einen zentralen Einstiegspunkt**, um dein gesamtes Setup zu verwalten.

---

## 7. GitOps-Workflow

Sobald du im Repository Änderungen machst (z. B. neue App hinzufügst oder ein Manifest änderst), erkennt Argo CD diese automatisch und synchronisiert den Cluster.

**Vorteile:**

* Kein manuelles Deployment nötig
* Klare Versionskontrolle über Git
* Einfache Rollbacks
* Übersicht über alle Cluster-Komponenten

---

## 8. Fazit

Mit einer **Root-App-Struktur** kannst du dein gesamtes Kubernetes-Setup elegant und skalierbar über Git verwalten.
Neue Services lassen sich einfach hinzufügen, indem du neue Application-Files in dein Repo legst — Argo CD kümmert sich um den Rest.

Diese Struktur eignet sich besonders für:

* Multi-Environment-Setups (dev/stage/prod)
* Team-basierte Deployments
* Automatisierte Cluster-Setups per GitOps

---

👉 **Nächste Schritte:**

* Root-App um ApplicationSets erweitern (für dynamische Deployments)
* Automatische Cluster-Onboarding-Pipelines via Argo CD Bootstrap

---

Möchtest du, dass ich dir daraus eine **fertige Markdown-Datei** (`argocd-root-app-tutorial.md`) erstelle, die du direkt auf deiner Webseite einbauen kannst?
Ich kann sie auch mit Frontmatter für dein Blogsystem (z. B. Hugo oder Astro) vorbereiten.
Welches CMS nutzt du auf deiner Webseite?
