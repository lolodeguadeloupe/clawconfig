'use client'
import { useState } from 'react'
import { METIERS } from '@/lib/metiers'
import { CheckCircle, Download, ChevronRight, ChevronLeft, Loader2, Zap, Star } from 'lucide-react'

type Step = 'metier' | 'questions' | 'nom' | 'generating' | 'done'

export default function ClawConfig() {
  const [step, setStep] = useState<Step>('metier')
  const [selectedMetier, setSelectedMetier] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [nom, setNom] = useState('')
  const [langue, setLangue] = useState<'fr' | 'en'>('fr')
  const [currentQ, setCurrentQ] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<Record<string, string> | null>(null)

  const metier = METIERS.find(m => m.id === selectedMetier)

  const handleAnswer = (qId: string, value: string, multi = false) => {
    setAnswers(prev => {
      if (multi) {
        const current = (prev[qId] as string[]) || []
        return { ...prev, [qId]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] }
      }
      return { ...prev, [qId]: value }
    })
  }

  const nextQuestion = () => {
    if (!metier) return
    if (currentQ < metier.questions.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      setStep('nom')
    }
  }

  const generate = async () => {
    if (!metier || !nom.trim()) return
    setStep('generating')
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metier: metier.nom, nom, answers, langue }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setStep('done')
    } catch (e) {
      setError('Une erreur est survenue. Réessaie.')
      setStep('nom')
    }
  }

  const reset = () => {
    setStep('metier')
    setSelectedMetier(null)
    setAnswers({})
    setNom('')
    setCurrentQ(0)
    setDownloadUrl(null)
    setError(null)
    setPreview(null)
  }

  const q = metier?.questions[currentQ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* NAV */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">ClawConfig</span>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">by OpenClaw</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLangue('fr')} className={`px-3 py-1 rounded-lg text-sm ${langue === 'fr' ? 'bg-white/20 font-semibold' : 'text-white/50 hover:text-white'}`}>🇫🇷 FR</button>
          <button onClick={() => setLangue('en')} className={`px-3 py-1 rounded-lg text-sm ${langue === 'en' ? 'bg-white/20 font-semibold' : 'text-white/50 hover:text-white'}`}>🇬🇧 EN</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ─── ÉTAPE 1 : Choix métier ──────────────────────────────────────── */}
        {step === 'metier' && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
                <Star className="w-4 h-4 text-yellow-400" /> Configurez votre IA OpenClaw en 2 minutes
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Quel est votre<br /><span className="text-blue-400">métier ?</span>
              </h1>
              <p className="text-white/50">On génère votre configuration personnalisée prête à l'emploi</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {METIERS.map(m => (
                <button key={m.id} onClick={() => { setSelectedMetier(m.id); setStep('questions'); setCurrentQ(0) }}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-2xl p-6 text-left transition-all hover:scale-[1.02]">
                  <div className="text-4xl mb-3">{m.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{m.nom}</h3>
                  <p className="text-white/40 text-sm">{m.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Choisir <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}

              {/* Autre métier */}
              <button className="bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl p-6 text-left transition-all opacity-60 hover:opacity-80">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-bold text-lg mb-1">Autre métier</h3>
                <p className="text-white/40 text-sm">Bientôt disponible — contactez-nous</p>
              </button>
            </div>
          </div>
        )}

        {/* ─── ÉTAPE 2 : Questions ─────────────────────────────────────────── */}
        {step === 'questions' && metier && q && (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-white/40 mb-2">
                <span>{metier.emoji} {metier.nom}</span>
                <span>Question {currentQ + 1} / {metier.questions.length}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / metier.questions.length) * 100}%` }} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-2">{q.label}</h2>
              {q.sublabel && <p className="text-white/40 text-sm mb-6">{q.sublabel}</p>}

              {/* SELECT */}
              {q.type === 'select' && (
                <div className="space-y-3 mt-6">
                  {q.options?.map(opt => (
                    <button key={opt} onClick={() => { handleAnswer(q.id, opt); setTimeout(nextQuestion, 200) }}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${answers[q.id] === opt ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* MULTISELECT */}
              {q.type === 'multiselect' && (
                <div>
                  <p className="text-white/40 text-xs mb-4">Sélectionnez tout ce qui s'applique</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {q.options?.map(opt => {
                      const selected = ((answers[q.id] as string[]) || []).includes(opt)
                      return (
                        <button key={opt} onClick={() => handleAnswer(q.id, opt, true)}
                          className={`px-4 py-2 rounded-xl text-sm border transition-all ${selected ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                          {selected && '✓ '}{opt}
                        </button>
                      )
                    })}
                  </div>
                  <button onClick={nextQuestion}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                    Continuer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TEXT */}
              {(q.type === 'text' || q.type === 'textarea') && (
                <div className="mt-6">
                  {q.type === 'textarea' ? (
                    <textarea value={(answers[q.id] as string) || ''} onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder} rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none mb-4" />
                  ) : (
                    <input value={(answers[q.id] as string) || ''} onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 mb-4" />
                  )}
                  <button onClick={nextQuestion}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                    Continuer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => currentQ > 0 ? setCurrentQ(q => q - 1) : setStep('metier')}
              className="mt-4 flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          </div>
        )}

        {/* ─── ÉTAPE 3 : Nom + Génération ──────────────────────────────────── */}
        {step === 'nom' && (
          <div className="text-center">
            <div className="text-6xl mb-6">{metier?.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">Presque prêt !</h2>
            <p className="text-white/40 mb-8">Votre prénom pour personnaliser la configuration</p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-left">
              <label className="block text-sm font-medium mb-2 text-white/70">Votre prénom</label>
              <input value={nom} onChange={e => setNom(e.target.value)}
                placeholder="Ex : Laurent"
                onKeyDown={e => e.key === 'Enter' && nom.trim() && generate()}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-400 mb-6" />

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button onClick={generate} disabled={!nom.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all">
                <Zap className="w-5 h-5" />
                Générer ma configuration IA
              </button>
              <p className="text-center text-white/30 text-xs mt-4">Génération en ~15 secondes par IA</p>
            </div>
          </div>
        )}

        {/* ─── GÉNÉRATION EN COURS ─────────────────────────────────────────── */}
        {step === 'generating' && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">L'IA configure votre assistant…</h2>
            <div className="text-white/40 space-y-1 text-sm">
              <p>✍️ Rédaction de SOUL.md…</p>
              <p>🎯 Personnalisation pour {metier?.nom}…</p>
              <p>💡 Création des tâches proactives…</p>
              <p>📦 Préparation du ZIP…</p>
            </div>
          </div>
        )}

        {/* ─── RÉSULTAT ────────────────────────────────────────────────────── */}
        {step === 'done' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Votre config est prête !</h2>
            <p className="text-white/40 mb-8">Configuration OpenClaw personnalisée pour {nom} · {metier?.nom}</p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6 text-left">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" /> Contenu du ZIP
              </h3>
              <div className="space-y-2">
                {['SOUL.md — Personnalité de votre IA', 'IDENTITY.md — Rôle et expertise', 'USER.md — Votre profil', 'HEARTBEAT.md — Tâches proactives', 'TOOLS.md — Notes sur vos outils', 'GUIDE.md — Guide de démarrage rapide'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-white/70">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href={downloadUrl!} download={`openclaw-${metier?.id}.zip`}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all mb-4">
              <Download className="w-5 h-5" />
              Télécharger ma configuration (.zip)
            </a>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left mb-6">
              <h4 className="font-semibold mb-3 text-sm">📋 Installation rapide :</h4>
              <div className="space-y-2 text-xs text-white/50 font-mono">
                <p>1. Décompressez le ZIP</p>
                <p>2. Copiez les .md dans votre workspace :</p>
                <p className="bg-black/30 px-3 py-2 rounded-lg text-white/70">cp *.md ~/.openclaw/workspace/</p>
                <p>3. Redémarrez OpenClaw</p>
                <p>4. ✅ Votre IA est configurée pour {metier?.nom}</p>
              </div>
            </div>

            <button onClick={reset} className="text-white/40 hover:text-white text-sm transition-colors">
              ← Générer une autre configuration
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
