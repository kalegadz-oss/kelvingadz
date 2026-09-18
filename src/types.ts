export type RiskLevel = 'low' | 'moderate' | 'high';

export type ToolType =
  | 'message'
  | 'link'
  | 'shopping'
  | 'job'
  | 'prize';

export interface WarningSign {
  id: string;
  icon: string;
  title: string;
  explanation: string;
}

export interface AnalysisResult {
  toolType: ToolType;
  riskLevel: RiskLevel;
  warningSigns: WarningSign[];
  timestamp: string;
  inputSummary: string;
}

export interface ScanRecord {
  id: string;
  type: ToolType;
  typeLabel: string;
  date: string;
  warningCount: number;
  riskLevel: RiskLevel;
  inputSummary: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  warningSign: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  shortDescription: string;
  whatIsIt: string;
  howItWorks: string;
  warningSigns: string[];
  protection: string[];
  afterInteraction: string;
}

export const RISK_CONFIG: Record<RiskLevel, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  percent: number;
}> = {
  low: {
    label: 'LOW CAUTION',
    shortLabel: 'Low',
    color: 'success',
    bgColor: 'bg-success-500/15',
    borderColor: 'border-success-500/40',
    textColor: 'text-success-400',
    description: 'Few or no warning signs detected.',
    percent: 25,
  },
  moderate: {
    label: 'MODERATE CAUTION',
    shortLabel: 'Moderate',
    color: 'warning',
    bgColor: 'bg-warning-500/15',
    borderColor: 'border-warning-500/40',
    textColor: 'text-warning-400',
    description: 'Several warning signs detected. Review carefully before proceeding.',
    percent: 60,
  },
  high: {
    label: 'HIGH CAUTION',
    shortLabel: 'High',
    color: 'danger',
    bgColor: 'bg-danger-500/15',
    borderColor: 'border-danger-500/40',
    textColor: 'text-danger-400',
    description: 'Multiple warning signs detected. Exercise strong caution and independently verify the situation.',
    percent: 90,
  },
};

export const DISCLAIMER = 'ScamWise identifies potential warning signs based on the information provided. It cannot guarantee that something is legitimate or fraudulent. Always verify important claims through official sources.';
