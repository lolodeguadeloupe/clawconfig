export interface Metier {
  id: string
  emoji: string
  nom: string
  description: string
  questions: Question[]
  defaults: Record<string, string>
}

export interface Question {
  id: string
  label: string
  sublabel?: string
  type: 'select' | 'text' | 'multiselect' | 'textarea'
  options?: string[]
  placeholder?: string
}

export const METIERS: Metier[] = [
  // ─── 1. DÉVELOPPEUR FREELANCE ─────────────────────────────────────────────
  {
    id: 'dev-freelance',
    emoji: '🧑‍💻',
    nom: 'Développeur Freelance',
    description: 'Suivi projets, clients, facturation, veille tech',
    defaults: {},
    questions: [
      {
        id: 'stack',
        label: 'Ta stack principale ?',
        type: 'multiselect',
        options: ['React / Next.js', 'Vue.js', 'Node.js', 'Python / Django', 'PHP / Laravel', 'Flutter', 'React Native', 'TypeScript', 'Rust', 'Go'],
      },
      {
        id: 'specialite',
        label: 'Ta spécialité ?',
        type: 'select',
        options: ['Fullstack', 'Frontend', 'Backend', 'Mobile', 'DevOps / Cloud', 'IA / Data Science', 'E-commerce', 'API / Intégrations'],
      },
      {
        id: 'nb_clients',
        label: 'Combien de clients actifs en parallèle ?',
        type: 'select',
        options: ['1 seul à la fois', '2-3', '4-6', '7+'],
      },
      {
        id: 'outils',
        label: 'Outils que tu utilises au quotidien ?',
        type: 'multiselect',
        options: ['GitHub / GitLab', 'Jira / Linear', 'Notion', 'Slack', 'Discord', 'Toggl / Harvest', 'Stripe', 'Malt / Upwork', 'Figma', 'Vercel / Netlify'],
      },
      {
        id: 'douleurs',
        label: 'Tes principaux points de douleur ?',
        type: 'multiselect',
        options: ['Suivi du temps', 'Relances clients', 'Facturation', 'Veille technologique', 'Trouver de nouveaux clients', 'Gérer plusieurs projets', 'Documentation'],
      },
    ],
  },

  // ─── 2. AGENT IMMOBILIER ──────────────────────────────────────────────────
  {
    id: 'agent-immo',
    emoji: '🏠',
    nom: 'Agent Immobilier',
    description: 'Biens, visites, mandats, clients acheteurs & vendeurs',
    defaults: {},
    questions: [
      {
        id: 'type_agence',
        label: 'Type d\'agence ?',
        type: 'select',
        options: ['Indépendant', 'Réseau national (Century 21, Orpi...)', 'Boutique locale', 'Mandataire (IAD, Safti...)'],
      },
      {
        id: 'secteur',
        label: 'Votre marché principal ?',
        type: 'select',
        options: ['Résidentiel (maisons/apparts)', 'Immobilier de luxe', 'Locatif / Gestion', 'Immobilier commercial', 'Terrain / Promotion', 'Location courte durée'],
      },
      {
        id: 'zone',
        label: 'Ville / Région principale ?',
        type: 'text',
        placeholder: 'Ex : Toulouse, Paris 15e, Côte d\'Azur...',
      },
      {
        id: 'nb_mandats',
        label: 'Nombre de mandats actifs en moyenne ?',
        type: 'select',
        options: ['< 10', '10-25', '25-50', '50+'],
      },
      {
        id: 'crm',
        label: 'Logiciels utilisés ?',
        type: 'multiselect',
        options: ['Hektor', 'Apimo', 'Périclès', 'N2F', 'Google Agenda', 'Notion', 'Excel', 'WhatsApp Business', 'Leboncoin', 'SeLoger', 'Logic-Immo'],
      },
    ],
  },

  // ─── 3. E-COMMERCE MANAGER ────────────────────────────────────────────────
  {
    id: 'ecommerce-manager',
    emoji: '🛒',
    nom: 'E-Commerce Manager',
    description: 'Analytics, stock, SEO/SEA, marketplaces, CRO',
    defaults: {},
    questions: [
      {
        id: 'plateforme',
        label: 'Plateforme principale ?',
        type: 'select',
        options: ['Shopify', 'PrestaShop', 'WooCommerce', 'Magento', 'Amazon Seller', 'Cdiscount Pro', 'Marketplace B2B', 'Sur-mesure'],
      },
      {
        id: 'ca_mensuel',
        label: 'CA mensuel approximatif ?',
        type: 'select',
        options: ['< 10K€', '10-50K€', '50-200K€', '200K-1M€', '1M€+'],
      },
      {
        id: 'canaux',
        label: 'Canaux d\'acquisition actifs ?',
        type: 'multiselect',
        options: ['Google Ads (SEA)', 'SEO / Organique', 'Meta Ads (FB/IG)', 'TikTok Ads', 'Email marketing', 'Influenceurs', 'Marketplace (Amazon/Cdiscount)', 'Affiliation'],
      },
      {
        id: 'equipe',
        label: 'Taille de l\'équipe e-comm ?',
        type: 'select',
        options: ['Solo', '2-3 personnes', '4-10 personnes', '10+ personnes'],
      },
      {
        id: 'kpis',
        label: 'KPIs que tu suis chaque jour ?',
        type: 'multiselect',
        options: ['Chiffre d\'affaires', 'Taux de conversion', 'Panier moyen', 'CAC', 'ROAS', 'Stock / Ruptures', 'Avis clients', 'Taux d\'abandon panier', 'LTV'],
      },
    ],
  },

  // ─── 4. COMMERCIAL / SDR ──────────────────────────────────────────────────
  {
    id: 'commercial-sdr',
    emoji: '🎯',
    nom: 'Commercial / SDR',
    description: 'Prospection, pipeline, relances, CRM, closing',
    defaults: {},
    questions: [
      {
        id: 'type_vente',
        label: 'Type de vente ?',
        type: 'select',
        options: ['B2B (vente aux entreprises)', 'B2C (vente aux particuliers)', 'B2B2C', 'SaaS / Abonnements', 'Grands comptes / Entreprises', 'PME / TPE'],
      },
      {
        id: 'cycle',
        label: 'Durée du cycle de vente ?',
        type: 'select',
        options: ['< 1 semaine', '1-4 semaines', '1-3 mois', '3-12 mois', '12 mois+'],
      },
      {
        id: 'crm',
        label: 'CRM utilisé ?',
        type: 'select',
        options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Monday', 'Notion', 'Excel / Sheets', 'Aucun pour l\'instant'],
      },
      {
        id: 'objectif',
        label: 'Objectif mensuel ?',
        type: 'select',
        options: ['< 10K€', '10-50K€', '50-100K€', '100K€+', 'Volume de RDV (pas de CA)'],
      },
      {
        id: 'canaux_prospection',
        label: 'Canaux de prospection ?',
        type: 'multiselect',
        options: ['LinkedIn (cold outreach)', 'Email cold', 'Téléphone', 'Inbound (leads entrants)', 'Événements / Salons', 'Partenariats', 'Réseaux sociaux'],
      },
    ],
  },
]
