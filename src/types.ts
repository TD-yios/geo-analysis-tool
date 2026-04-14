export interface AnalysisResult {
  url: string;
  timestamp: number;
  overallScore: number;
  dimensions: DimensionScore[];
  details: AnalysisDetails;
  recommendations: Recommendation[];
  platformRecommendations?: PlatformRecommendations;
  abTestSuggestions?: ABTestSuggestion[];
  analysisTime?: number;
  pageCategories?: PageCategory[];
  mode?: string;
  pageType?: {
    isHomepage: boolean;
    isCategory: boolean;
    isArticle: boolean;
    isProduct: boolean;
    isAbout: boolean;
    isContact: boolean;
    type: string;
  };
  language?: string;
  renderingMode?: {
    mode: 'static' | 'spa' | 'ssr' | 'ssg' | 'isr';
    framework: string;
    confidence: 'high' | 'medium' | 'low';
    warnings: string[];
    details?: {
      hasSignificantContent: boolean;
      scriptCount: number;
      hasReactRoot: boolean;
      hasVueApp: boolean;
      hasAngularApp: boolean;
      hasNextData: boolean;
      hasNextAppRouter: boolean;
      hasNuxtData: boolean;
      hasGatsby: boolean;
      hasSvelteKit: boolean;
      hasAstroIsland: boolean;
      hasIsr: boolean;
      hasLazyHydration: boolean;
    };
  };
}

export interface RobotsAnalysis {
  exists: boolean;
  content: string | null;
  aiCrawlers: Array<{
    name: string;
    userAgent: string;
    description: string;
    status: 'allowed' | 'blocked' | 'unknown';
    recommendation: string;
  }>;
}

export interface AnalysisDetails {
  technical: TechnicalAnalysis;
  structuredData: StructuredDataAnalysis;
  contentStructure: ContentStructureAnalysis;
  eeat: EeatAnalysis;
  aiCitation: AiCitationAnalysis;
  brandMentions?: BrandMentionsAnalysis;
  robotsAnalysis?: RobotsAnalysis;
  citability?: CitabilityAnalysis;
  freshness?: FreshnessAnalysis;
  keywords?: KeywordsAnalysis;
  multiLanguage?: MultiLanguageAnalysis;
  totalPages?: number;
  analyzedUrls?: string[];
}

export interface PlatformRecommendations {
  chatgpt: Array<{ priority: string; title: string; description: string }>;
  perplexity: Array<{ priority: string; title: string; description: string }>;
  googleAIO: Array<{ priority: string; title: string; description: string }>;
  claude: Array<{ priority: string; title: string; description: string }>;
}

export interface ABTestSuggestion {
  testName: string;
  hypothesis: string;
  variationA: string;
  variationB: string;
  metric: string;
  expectedImpact: string;
  testDuration: string;
  sampleSize: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  weight: number;
  items: MetricItem[];
}

export interface MetricItem {
  name: string;
  score: number;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  recommendation?: string;
}

export interface TechnicalAnalysis {
  hasRobotsTxt: boolean;
  robotsValid: boolean;
  robotsContent: string;
  robotsAICrawlerConfig?: {
    hasGPTBot: boolean;
    hasGoogleExtended: boolean;
    hasCCBot: boolean;
    hasBaiduspider: boolean;
    hasSitemapDeclaration: boolean;
    blocksAllCrawlers: boolean;
  };
  hasLlmsTxt: boolean;
  llmsValid: boolean;
  llmsContent: string;
  hasSitemap: boolean;
  sitemapValid: boolean;
  sitemapUrlCount: number;
  isHttps: boolean;
  performanceScore: number;
  performanceDetails?: {
    contentSize: number;
    imageCount: number;
    scriptCount: number;
    hasLazyLoading: boolean;
    hasCdn: boolean;
    hasAsyncScript: boolean;
    hasCdnResources: boolean;
    cdnResourceCount: number;
    webpImages: number;
    lazyImages: number;
    imagesWithAlt: number;
    imageOptimizationRatio: number;
    thirdPartyScripts: number;
    hasAnalytics: boolean;
    hasSocialWidgets: boolean;
    hasTrackingScripts: boolean;
  };
  accessibilityDetails?: {
    hasLoginWall: boolean;
    hasLoginForm: boolean;
    hasAuthRequired: boolean;
    hasJsDependency: boolean;
    jsRatio: number;
    hasInlineScript: boolean;
    hasMobileFriendly: boolean;
    hasViewport: boolean;
    hasResponsiveWidth: boolean;
    hasMediaQueries: boolean;
    internalLinks: number;
    externalLinks: number;
    totalLinks: number;
    hasInternalLinks: boolean;
    hasMetaDescription: boolean;
    hasMetaKeywords: boolean;
    hasMetaAuthor: boolean;
    ogCompleteness: number;
    twitterCompleteness: number;
    hasBreadcrumb: boolean;
    hasRelatedArticles: boolean;
    hasSearchBox: boolean;
  };
}

export interface StructuredDataAnalysis {
  hasJsonLd: boolean;
  jsonLdCount: number;
  jsonLdValid: boolean;
  hasOpenGraph: boolean;
  ogDetails?: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  hasMicrodata: boolean;
  hasSpeakable: boolean;
  schemaTypes: string[];
  schemaDetails?: {
    article: {
      hasHeadline: boolean;
      hasAuthor: boolean;
      hasDatePublished: boolean;
      hasDateModified: boolean;
      hasDescription: boolean;
      hasImage: boolean;
      hasPublisher: boolean;
    };
    faqPage: {
      hasMainEntity: boolean;
      questionCount: number;
    };
    howTo: {
      hasName: boolean;
      hasDescription: boolean;
      hasSteps: boolean;
      stepCount: number;
    };
    organization: {
      hasName: boolean;
      hasUrl: boolean;
      hasLogo: boolean;
      hasContactPoint: boolean;
    };
    person: {
      hasName: boolean;
      hasJobTitle: boolean;
      hasAffiliation: boolean;
    };
  };
}

export interface ContentStructureAnalysis {
  hasHeadings: boolean;
  headingHierarchy: boolean;
  headingIssues: string[];
  hasFaq: boolean;
  faqCount: number;
  hasFaqStructure: boolean;
  hasWritingFramework: boolean;
  hasStepStructure: boolean;
  hasListStructure: boolean;
  hasIntroduction: boolean;
  hasConclusion: boolean;
  paragraphCount: number;
  readabilityScore: number;
  readabilityDetails?: {
    avgWordsPerParagraph: number;
    avgWordsPerSentence: number;
    totalWords: number;
    totalSentences: number;
  };
  titleOptimization?: {
    title: string;
    length: number;
    hasNumber: boolean;
    hasQuestion: boolean;
    hasColon: boolean;
    hasGuide: boolean;
    hasList: boolean;
    score: number;
  };
  contentQuality?: {
    singleTaskRatio: number;
    absoluteCount: number;
    hasAbsoluteExpression: boolean;
    dataCount: number;
    hasDataSupport: boolean;
    questionOriented: boolean;
    hasQuestionInTitle: boolean;
    termConsistency: number;
    hasConclusionFirst: boolean;
    hasSourceCitation: boolean;
    externalRefLinks: number;
    hasThreePartStructure: boolean;
    caseCompleteness: boolean;
    hasCaseStudy: boolean;
    hasMethodologyFramework: boolean;
    hasDefinitionBoundary: boolean;
    imageWithSizeRatio: number;
    hasDisclosure: boolean;
    hasFontOptimization: boolean;
    anchorQualityRatio: number;
  };
  h1Count: number;
  h2Count: number;
  h3Count: number;
}

export interface EeatAnalysis {
  hasAuthorInfo: boolean;
  authorDetail: boolean;
  hasCaseStudy: boolean;
  hasDataSupport: boolean;
  hasSpecificDetail: boolean;
  hasMethodology: boolean;
  hasTechnicalTerms: boolean;
  hasIndependentView: boolean;
  hasDefinition: boolean;
  hasAboutPage: boolean;
  hasPublicationDate: boolean;
  hasUpdateDate: boolean;
  hasContactInfo: boolean;
  hasPrivacyPolicy: boolean;
  hasTermsOfService: boolean;
  hasTrustSignals: boolean;
  hasCitation: boolean;
}

export interface AiCitationAnalysis {
  brandMentioned: boolean;
  contentQualityScore: number;
  sentimentScore: number;
  sentimentDetails?: {
    positiveCount: number;
    negativeCount: number;
    totalSentimentWords: number;
    sentiment: string;
  };
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action: string;
  businessImpact?: number;
  difficulty?: number;
  roi?: number;
}

export interface CitabilityAnalysis {
  avgParagraphLength: number;
  optimalLengthRatio: number;
  citationReadiness: number;
  hasSelfContainedContent: boolean;
  factDensity: number;
  hasQuestionAnswer: boolean;
  hasClearStructure: boolean;
  overallScore: number;
}

export interface FreshnessAnalysis {
  hasDateMarkers: boolean;
  dateCount: number;
  hasVersionInfo: boolean;
  versionCount: number;
  metaDateScore: number;
  freshnessScore: number;
  outdatedScore: number;
  overallFreshness: number;
  recommendation: string;
}

export interface KeywordsAnalysis {
  topKeywords: Array<{ word: string; count: number }>;
  keywordCount: number;
  titleKeywordCoverage: number;
  metaKeywordCoverage: number;
  searchIntent: string;
  intentDistribution: Record<string, number>;
  overallScore: number;
}

export interface MultiLanguageAnalysis {
  hasLangAttribute: boolean;
  langAttribute: string;
  hasContentLangMeta: boolean;
  contentLangMeta: string;
  hasHreflang: boolean;
  hreflangCount: number;
  hreflangLangs: string[];
  langConsistency: boolean;
  hasLanguageSwitcher: boolean;
  languageLinks: string[];
  hasTranslationMarkers: boolean;
  hasMixedLanguages: boolean;
  overallScore: number;
  recommendations: string[];
}

export interface ExportFormat {
  type: 'html' | 'json';
  data: string;
}

export interface PageCategory {
  type: string;
  label: string;
  count: number;
  avgScore: number;
  urls: string[];
}

export interface BrandMentionsAnalysis {
  platforms: Array<{
    name: string;
    site: string;
    icon: string;
    weight: number;
    found: boolean;
    mentionCount: number;
    searchUrl?: string;
    error?: string;
  }>;
  totalMentions: number;
  visibility: number;
}
